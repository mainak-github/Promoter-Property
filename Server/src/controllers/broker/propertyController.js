const db = require('../../config/db');
const { attachPropertyAssociations } = require('../../utils/propertyHelper');
const slugify = require('slugify');
const path = require('path');

exports.createProperty = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const {
      title, shortDescription, longDescription, priceRange, budgetType,
      city, suburb, district, state, pincode, road,
      country, continent, timezone, isoCode,
      latitude, longitude, googleMapLink, propertyType, status,
      bedrooms, bathrooms, furnishedStatus, parkingAvailable,
      launchDate, completionDate, floorNumber, numberOfTowers,
      carpetArea, totalArea, facing, amenities, nearbyFacilities,
      floorPlans, developerInfo,
      seoTitle, metaDescription, metaKeywords, ogTitle, ogType,
      ogDescription, twitterCard, canonicalUrl, focusKeyword, robotsIndex,
    } = req.body;

    let bedroomsArray = bedrooms;
    if (typeof bedrooms === 'string') {
      bedroomsArray = bedrooms.split(',').map(b => b.trim());
    }

    const slug = slugify(title || 'property', { lower: true });
    const coverPhotoPath = req.files?.coverPhoto ? path.relative('uploads', req.files.coverPhoto[0].path) : null;

    // 1. Create Property
    const [result] = await connection.query(
      `INSERT INTO Properties (
        brokerId, coverPhoto, title, shortDescription, longDescription,
        priceRange, budgetType, city, suburb, district, state, pincode, road,
        country, continent, timezone, isoCode, latitude, longitude, googleMapLink,
        propertyType, status, bedrooms, bathrooms, furnishedStatus, parkingAvailable,
        launchDate, completionDate, floorNumber, numberOfTowers, carpetArea, totalArea,
        facing, approvalStatus, seoTitle, metaDescription, metaKeywords, ogTitle,
        ogType, ogDescription, twitterCard, canonicalUrl, focusKeyword, robotsIndex
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        coverPhotoPath,
        title,
        shortDescription || null,
        longDescription || null,
        priceRange || null,
        budgetType || 'Budgeted',
        city || null,
        suburb || null,
        district || null,
        state || null,
        pincode || null,
        road || null,
        country || null,
        continent || null,
        timezone || null,
        isoCode || null,
        latitude ? parseFloat(latitude) : null,
        longitude ? parseFloat(longitude) : null,
        googleMapLink || null,
        propertyType || null,
        status || null,
        Array.isArray(bedroomsArray) ? bedroomsArray.join(',') : (bedrooms || null),
        bathrooms ? parseInt(bathrooms, 10) : null,
        furnishedStatus || null,
        parkingAvailable === 'true' || parkingAvailable === true ? 1 : 0,
        launchDate ? new Date(launchDate) : null,
        completionDate ? new Date(completionDate) : null,
        floorNumber || null,
        numberOfTowers || null,
        carpetArea || null,
        totalArea || null,
        facing || null,
        'pending',
        seoTitle || null,
        metaDescription || null,
        metaKeywords || null,
        ogTitle || null,
        ogType || 'website',
        ogDescription || null,
        twitterCard || 'summary_large_image',
        canonicalUrl || null,
        focusKeyword || null,
        robotsIndex || 'index,follow'
      ]
    );

    const propertyId = result.insertId;

    // 2. Additional Photos
    if (req.files?.additionalPhotos) {
      for (const file of req.files.additionalPhotos) {
        await connection.query(
          'INSERT INTO PropertyImages (propertyId, imageUrl, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
          [propertyId, path.relative('uploads', file.path)]
        );
      }
    }

    // 3. Amenities
    if (amenities) {
      let amenityNames = [];
      if (typeof amenities === 'string') {
        amenityNames = amenities.split(',').map(name => name.trim()).filter(name => name);
      } else if (Array.isArray(amenities)) {
        amenityNames = amenities;
      }

      for (const name of amenityNames) {
        // Find or create amenity
        let [existingAmenity] = await connection.query('SELECT id FROM Amenities WHERE name = ?', [name]);
        let amenityId;
        if (existingAmenity.length === 0) {
          const [insertAm] = await connection.query('INSERT INTO Amenities (name, createdAt, updatedAt) VALUES (?, NOW(), NOW())', [name]);
          amenityId = insertAm.insertId;
        } else {
          amenityId = existingAmenity[0].id;
        }

        await connection.query(
          'INSERT INTO PropertyAmenities (propertyId, amenityId, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
          [propertyId, amenityId]
        );
      }
    }

    // 4. Nearby Facilities
    if (nearbyFacilities) {
      const facilitiesArray = typeof nearbyFacilities === 'string' ? JSON.parse(nearbyFacilities) : nearbyFacilities;
      for (const fac of facilitiesArray) {
        await connection.query(
          'INSERT INTO NearbyFacilities (propertyId, facilityName, distance, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
          [propertyId, fac.facilityName || fac.facilityType, fac.distance]
        );
      }
    }

    // 5. Floor Plans
    if (floorPlans) {
      const floorPlansArray = typeof floorPlans === 'string' ? JSON.parse(floorPlans) : floorPlans;
      for (let i = 0; i < floorPlansArray.length; i++) {
        const fp = floorPlansArray[i];
        const photo = req.files?.floorPlans?.[i];
        await connection.query(
          'INSERT INTO FloorPlans (propertyId, floorName, photo, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
          [
            propertyId,
            fp.floorName || fp.title || 'Floor Plan',
            photo ? path.relative('uploads', photo.path) : null
          ]
        );
      }
    }

    // 6. Developer Info
    if (developerInfo) {
      const devInfo = typeof developerInfo === 'string' ? JSON.parse(developerInfo) : developerInfo;
      const logoUrl = req.files?.developerLogo ? path.relative('uploads', req.files.developerLogo[0].path) : null;
      await connection.query(
        'INSERT INTO DeveloperInfos (propertyId, developerName, developerDescription, developerLogo, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [propertyId, devInfo.developerName, devInfo.developerDescription || devInfo.aboutDeveloper, logoUrl]
      );
    }

    // 7. Layout Maps
    if (req.files?.layoutMaps) {
      for (const file of req.files.layoutMaps) {
        await connection.query(
          'INSERT INTO LayoutMaps (propertyId, mapType, imageUrl, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
          [propertyId, 'Layout Map', path.relative('uploads', file.path)]
        );
      }
    }

    await connection.commit();

    return res.status(201).json({
      message: 'Property created successfully, pending admin approval.',
      propertyId,
      seoData: {
        seoTitle,
        metaDescription,
        focusKeyword
      }
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
    const [properties] = await db.query('SELECT * FROM Properties ORDER BY createdAt DESC');
    await attachPropertyAssociations(properties);
    res.json(properties);
    console.log('Properties fetched successfully', properties);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch properties', message: err.message });
  }
};

exports.listBrokerProperties = async (req, res) => {
  try {
    const [properties] = await db.query('SELECT * FROM Properties WHERE brokerId = ? ORDER BY createdAt DESC', [req.params.id]);
    await attachPropertyAssociations(properties);
    res.json(properties);
    console.log('Broker properties fetched successfully', properties);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch broker properties', message: err.message });
  }
};

exports.getPropertyDetails = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Properties WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const property = await attachPropertyAssociations(rows[0]);
    res.status(200).json({ mes: 'Property details fetched successfully', property });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch property details', message: err.message });
  }
};