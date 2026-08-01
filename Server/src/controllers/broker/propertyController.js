const { query, getConnection } = require('../../config/db');
const { populatePropertyAssociations } = require('../public/property.controller');
const slugify = require('slugify');
const path = require('path');

exports.createProperty = async (req, res) => {
  const connection = await getConnection();
  try {
    await connection.beginTransaction();

    const {
      title,
      shortDescription,
      longDescription,
      priceRange,
      budgetType,
      city,
      suburb,
      district,
      state,
      pincode,
      road,
      country,
      continent,
      timezone,
      isoCode,
      latitude,
      longitude,
      googleMapLink,
      propertyType,
      status,
      bedrooms,
      bathrooms,
      furnishedStatus,
      parkingAvailable,
      launchDate,
      completionDate,
      floorNumber,
      numberOfTowers,
      carpetArea,
      totalArea,
      facing,
      amenities,
      nearbyFacilities,
      floorPlans,
      developerInfo,
      seoTitle,
      metaDescription,
      metaKeywords,
      ogTitle,
      ogType,
      ogDescription,
      twitterCard,
      canonicalUrl,
      focusKeyword,
      robotsIndex,
    } = req.body;

    let bedroomsArray = bedrooms;
    if (typeof bedrooms === 'string') {
      bedroomsArray = bedrooms.split(',').map(b => b.trim());
    }

    const slug = slugify(title || 'property', { lower: true });
    const coverPhotoPath = req.files?.coverPhoto ? path.relative('uploads', req.files.coverPhoto[0].path) : null;

    const [propResult] = await connection.query(
      `INSERT INTO Properties (
        brokerId, coverPhoto, title, shortDescription, longDescription, priceRange, budgetType,
        city, suburb, district, state, pincode, road, country, continent, timezone, isoCode,
        latitude, longitude, googleMapLink, propertyType, status, bedrooms, bathrooms,
        furnishedStatus, parkingAvailable, launchDate, completionDate, floorNumber, numberOfTowers,
        carpetArea, totalArea, facing, approvalStatus, slug, seoTitle, metaDescription, metaKeywords,
        ogTitle, ogType, ogDescription, twitterCard, canonicalUrl, focusKeyword, robotsIndex,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        req.user.id, coverPhotoPath, title, shortDescription || null, longDescription || null,
        priceRange || null, budgetType || null, city || null, suburb || null, district || null,
        state || null, pincode || null, road || null, country || null, continent || null,
        timezone || null, isoCode || null, latitude || null, longitude || null, googleMapLink || null,
        propertyType || null, status || null, Array.isArray(bedroomsArray) ? bedroomsArray.join(',') : null,
        bathrooms ? parseInt(bathrooms) : null, furnishedStatus || null,
        parkingAvailable === 'true' || parkingAvailable === true,
        launchDate ? new Date(launchDate) : null, completionDate ? new Date(completionDate) : null,
        floorNumber || null, numberOfTowers || null, carpetArea || null, totalArea || null,
        facing || null, slug, seoTitle || null, metaDescription || null, metaKeywords || null,
        ogTitle || null, ogType || 'website', ogDescription || null, twitterCard || 'summary_large_image',
        canonicalUrl || null, focusKeyword || null, robotsIndex || 'index,follow'
      ]
    );

    const propertyId = propResult.insertId;

    // Additional Photos
    if (req.files?.additionalPhotos) {
      for (const file of req.files.additionalPhotos) {
        await connection.query(
          'INSERT INTO PropertyImages (propertyId, imageUrl, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
          [propertyId, path.relative('uploads', file.path)]
        );
      }
    }

    // Amenities
    if (amenities) {
      let amenityNames = [];
      if (typeof amenities === 'string') {
        amenityNames = amenities.split(',').map(n => n.trim()).filter(Boolean);
      } else if (Array.isArray(amenities)) {
        amenityNames = amenities;
      }

      for (const name of amenityNames) {
        const [existing] = await connection.query('SELECT id FROM Amenities WHERE name = ?', [name]);
        let amenityId;
        if (existing.length > 0) {
          amenityId = existing[0].id;
        } else {
          const [newAmenity] = await connection.query('INSERT INTO Amenities (name, createdAt, updatedAt) VALUES (?, NOW(), NOW())', [name]);
          amenityId = newAmenity.insertId;
        }

        await connection.query(
          'INSERT IGNORE INTO PropertyAmenities (propertyId, amenityId, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
          [propertyId, amenityId]
        ).catch(() => {});
      }
    }

    // Nearby Facilities
    if (nearbyFacilities) {
      const facilitiesArray = typeof nearbyFacilities === 'string' ? JSON.parse(nearbyFacilities) : nearbyFacilities;
      for (const fac of facilitiesArray) {
        await connection.query(
          'INSERT INTO NearbyFacilities (propertyId, facilityType, facilityName, distance, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
          [propertyId, fac.facilityType, fac.facilityName, fac.distance]
        );
      }
    }

    // Floor Plans
    if (floorPlans) {
      const floorPlansArray = Array.isArray(floorPlans) ? floorPlans : JSON.parse(floorPlans);
      for (let i = 0; i < floorPlansArray.length; i++) {
        const fp = floorPlansArray[i];
        const photo = req.files?.floorPlans?.[i];
        await connection.query(
          'INSERT INTO FloorPlans (propertyId, photo, floorName, towerName, shortDescription, priceRange, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
          [propertyId, photo ? path.relative('uploads', photo.path) : null, fp.floorName, fp.towerName, fp.shortDescription, fp.priceRange]
        );
      }
    }

    // Developer Info
    if (developerInfo) {
      const devInfo = typeof developerInfo === 'string' ? JSON.parse(developerInfo) : developerInfo;
      await connection.query(
        'INSERT INTO DeveloperInfos (propertyId, developerName, developerDescription, developerLogo, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [propertyId, devInfo.developerName, devInfo.developerDescription, req.files?.developerLogo ? path.relative('uploads', req.files.developerLogo[0].path) : null]
      );
    }

    // Layout Maps
    if (req.files?.layoutMaps) {
      for (const file of req.files.layoutMaps) {
        await connection.query(
          'INSERT INTO LayoutMaps (propertyId, mapPhoto, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
          [propertyId, path.relative('uploads', file.path)]
        );
      }
    }

    await connection.commit();

    return res.status(201).json({
      message: 'Property created successfully, pending admin approval.',
      propertyId,
      seoData: { seoTitle, metaDescription, focusKeyword }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating property:', error);
    return res.status(500).json({
      message: 'Failed to create property.',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

exports.listProperties = async (req, res) => {
  try {
    const properties = await query('SELECT * FROM Properties ORDER BY createdAt DESC');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch properties', message: err.message });
  }
};

exports.listBrokerProperties = async (req, res) => {
  try {
    const properties = await query('SELECT * FROM Properties WHERE brokerId = ? ORDER BY createdAt DESC', [req.params.id]);
    const populated = await populatePropertyAssociations(properties);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch broker properties', message: err.message });
  }
};

exports.getPropertyDetails = async (req, res) => {
  try {
    const properties = await query('SELECT * FROM Properties WHERE id = ?', [req.params.id]);
    if (properties.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const [populated] = await populatePropertyAssociations(properties);
    res.status(200).json({ mes: 'Property details fetched successfully', property: populated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch property details', message: err.message });
  }
};