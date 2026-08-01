const { query, getConnection } = require('../../config/db');
const { populatePropertyAssociations } = require('../public/property.controller');
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');

exports.getAllProperties = async (req, res) => {
  const {
    approvalStatus,
    search = '',
    page = 1,
    limit = 10
  } = req.query;

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const whereClauses = [];
  const params = [];

  if (approvalStatus) {
    whereClauses.push('approvalStatus = ?');
    params.push(approvalStatus);
  }

  if (search) {
    whereClauses.push('(title LIKE ? OR address LIKE ? OR shortDescription LIKE ?)');
    const pattern = `%${search}%`;
    params.push(pattern, pattern, pattern);
  }

  const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  try {
    const countResult = await query(`SELECT COUNT(*) as total FROM Properties ${whereSQL}`, params);
    const total = countResult[0]?.total || 0;

    const selectParams = [...params, parseInt(limit), offset];
    const properties = await query(
      `SELECT * FROM Properties ${whereSQL} ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
      selectParams
    );

    const populatedProperties = await populatePropertyAssociations(properties);

    return res.status(200).json({
      status: 'success',
      message: 'Admin property list fetched successfully',
      data: {
        properties: populatedProperties,
        pagination: {
          total,
          page: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch admin properties',
      error: error.message
    });
  }
};

exports.updateProperty = async (req, res) => {
  const connection = await getConnection();

  try {
    await connection.beginTransaction();
    const { id } = req.params;

    const [existingRows] = await connection.query('SELECT * FROM Properties WHERE id = ?', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Property not found' });
    }

    const existingProperty = existingRows[0];
    const {
      title, shortDescription, longDescription, priceRange, budgetType,
      city, subLocation, googleMapLink, propertyType, status,
      bedrooms, bathrooms, furnishedStatus, parkingAvailable,
      launchDate, completionDate, floorNumber, numberOfTowers,
      carpetArea, totalArea, facing, amenities, nearbyFacilities,
      floorPlans, developerInfo, suburb, district, state, pincode, road,
      country, continent, timezone, isoCode, latitude, longitude, address,
      seoTitle, metaDescription, metaKeywords, ogTitle, ogType, ogDescription,
      twitterCard, canonicalUrl, focusKeyword, robotsIndex, existingAdditionalPhotos
    } = req.body;

    let bedroomsArray = bedrooms;
    if (typeof bedrooms === 'string') {
      bedroomsArray = bedrooms.split(',').map(b => b.trim());
    }

    const coverPhotoPath = req.files?.coverPhoto ? path.relative('uploads', req.files.coverPhoto[0].path) : existingProperty.coverPhoto;
    const approvalStatus = req.user?.role === 'broker' ? 'pending' : existingProperty.approvalStatus;

    await connection.query(
      `UPDATE Properties SET
        title = COALESCE(?, title),
        shortDescription = COALESCE(?, shortDescription),
        longDescription = COALESCE(?, longDescription),
        priceRange = COALESCE(?, priceRange),
        budgetType = COALESCE(?, budgetType),
        city = COALESCE(?, city),
        googleMapLink = COALESCE(?, googleMapLink),
        propertyType = COALESCE(?, propertyType),
        status = COALESCE(?, status),
        bedrooms = COALESCE(?, bedrooms),
        bathrooms = COALESCE(?, bathrooms),
        furnishedStatus = COALESCE(?, furnishedStatus),
        parkingAvailable = COALESCE(?, parkingAvailable),
        launchDate = COALESCE(?, launchDate),
        completionDate = COALESCE(?, completionDate),
        floorNumber = COALESCE(?, floorNumber),
        numberOfTowers = COALESCE(?, numberOfTowers),
        carpetArea = COALESCE(?, carpetArea),
        totalArea = COALESCE(?, totalArea),
        facing = COALESCE(?, facing),
        coverPhoto = ?,
        approvalStatus = ?,
        suburb = COALESCE(?, suburb),
        district = COALESCE(?, district),
        state = COALESCE(?, state),
        pincode = COALESCE(?, pincode),
        road = COALESCE(?, road),
        country = COALESCE(?, country),
        continent = COALESCE(?, continent),
        timezone = COALESCE(?, timezone),
        isoCode = COALESCE(?, isoCode),
        latitude = COALESCE(?, latitude),
        longitude = COALESCE(?, longitude),
        address = COALESCE(?, address),
        seoTitle = COALESCE(?, seoTitle),
        metaDescription = COALESCE(?, metaDescription),
        metaKeywords = COALESCE(?, metaKeywords),
        ogTitle = COALESCE(?, ogTitle),
        ogType = COALESCE(?, ogType),
        ogDescription = COALESCE(?, ogDescription),
        twitterCard = COALESCE(?, twitterCard),
        canonicalUrl = COALESCE(?, canonicalUrl),
        focusKeyword = COALESCE(?, focusKeyword),
        robotsIndex = COALESCE(?, robotsIndex),
        updatedAt = NOW()
      WHERE id = ?`,
      [
        title, shortDescription, longDescription, priceRange, budgetType,
        city, googleMapLink, propertyType, status,
        Array.isArray(bedroomsArray) ? bedroomsArray.join(',') : null,
        bathrooms ? parseInt(bathrooms) : null, furnishedStatus,
        parkingAvailable !== undefined ? (parkingAvailable === 'true' || parkingAvailable === true) : null,
        launchDate ? new Date(launchDate) : null, completionDate ? new Date(completionDate) : null,
        floorNumber, numberOfTowers, carpetArea, totalArea, facing,
        coverPhotoPath, approvalStatus, suburb, district, state, pincode, road,
        country, continent, timezone, isoCode, latitude, longitude, address,
        seoTitle, metaDescription, metaKeywords, ogTitle, ogType, ogDescription,
        twitterCard, canonicalUrl, focusKeyword, robotsIndex, id
      ]
    );

    // Additional Photos
    const existingPhotos = existingAdditionalPhotos ? JSON.parse(existingAdditionalPhotos) : [];
    const [currentImages] = await connection.query('SELECT * FROM PropertyImages WHERE propertyId = ?', [id]);
    for (const img of currentImages) {
      if (!existingPhotos.includes(img.imageUrl)) {
        await connection.query('DELETE FROM PropertyImages WHERE id = ?', [img.id]);
      }
    }

    if (req.files?.additionalPhotos) {
      for (const file of req.files.additionalPhotos) {
        await connection.query(
          'INSERT INTO PropertyImages (propertyId, imageUrl, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
          [id, path.relative('uploads', file.path)]
        );
      }
    }

    // Nearby Facilities
    await connection.query('DELETE FROM NearbyFacilities WHERE propertyId = ?', [id]);
    if (nearbyFacilities) {
      const facilitiesArray = JSON.parse(nearbyFacilities);
      for (const fac of facilitiesArray) {
        await connection.query(
          'INSERT INTO NearbyFacilities (propertyId, facilityType, facilityName, distance, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
          [id, fac.facilityType, fac.facilityName, fac.distance]
        );
      }
    }

    // Floor Plans
    await connection.query('DELETE FROM FloorPlans WHERE propertyId = ?', [id]);
    if (floorPlans) {
      const floorPlansArray = Array.isArray(floorPlans) ? floorPlans : JSON.parse(floorPlans);
      for (let i = 0; i < floorPlansArray.length; i++) {
        const fp = floorPlansArray[i];
        const photo = req.files?.floorPlans?.[i];
        await connection.query(
          'INSERT INTO FloorPlans (propertyId, photo, floorName, towerName, shortDescription, priceRange, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
          [id, photo ? path.relative('uploads', photo.path) : null, fp.floorName, fp.towerName, fp.shortDescription, fp.priceRange]
        );
      }
    }

    // Developer Info
    await connection.query('DELETE FROM DeveloperInfos WHERE propertyId = ?', [id]);
    if (developerInfo) {
      const devInfo = JSON.parse(developerInfo);
      await connection.query(
        'INSERT INTO DeveloperInfos (propertyId, developerName, developerDescription, developerLogo, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [id, devInfo.developerName, devInfo.developerDescription, req.files?.developerLogo ? path.relative('uploads', req.files.developerLogo[0].path) : null]
      );
    }

    // Layout Maps
    await connection.query('DELETE FROM LayoutMaps WHERE propertyId = ?', [id]);
    if (req.files?.layoutMaps) {
      for (const file of req.files.layoutMaps) {
        await connection.query(
          'INSERT INTO LayoutMaps (propertyId, mapPhoto, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
          [id, path.relative('uploads', file.path)]
        );
      }
    }

    await connection.commit();
    return res.status(200).json({
      status: 'success',
      message: 'Property updated successfully.',
      propertyId: id
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating property:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update property',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

exports.deleteProperty = async (req, res) => {
  const { id } = req.params;
  const connection = await getConnection();

  try {
    const [properties] = await connection.query('SELECT * FROM Properties WHERE id = ?', [id]);
    if (properties.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Property not found' });
    }

    const property = properties[0];

    if (req.user?.role === 'broker' && property.brokerId !== req.user.id) {
      return res.status(403).json({ status: 'error', message: 'You are not authorized to delete this property' });
    }

    await connection.beginTransaction();

    await connection.query('DELETE FROM PropertyAmenities WHERE propertyId = ?', [id]).catch(() => {});
    await connection.query('DELETE FROM NearbyFacilities WHERE propertyId = ?', [id]);
    await connection.query('DELETE FROM FloorPlans WHERE propertyId = ?', [id]);
    await connection.query('DELETE FROM DeveloperInfos WHERE propertyId = ?', [id]);
    await connection.query('DELETE FROM LayoutMaps WHERE propertyId = ?', [id]);
    await connection.query('DELETE FROM PropertyImages WHERE propertyId = ?', [id]);
    await connection.query('DELETE FROM Properties WHERE id = ?', [id]);

    const propertyFolder = path.join(__dirname, '../../../uploads/properties', property.slug || `${property.id}`);
    if (fs.existsSync(propertyFolder)) {
      fs.rmSync(propertyFolder, { recursive: true, force: true });
    }

    await connection.commit();

    return res.status(200).json({ status: 'success', message: 'Property deleted successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting property:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to delete property', error: error.message });
  } finally {
    connection.release();
  }
};
