const db = require('../../config/db');
const { attachPropertyAssociations } = require('../../utils/propertyHelper');
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');

exports.getAllProperties = async (req, res) => {
  const {
    approvalStatus, // optional: 'approved', 'pending', 'rejected'
    search = '',
    page = 1,
    limit = 10
  } = req.query;

  const parsedLimit = parseInt(limit, 10);
  const parsedPage = parseInt(page, 10);
  const offset = (parsedPage - 1) * parsedLimit;

  const whereConditions = [];
  const queryParams = [];

  if (approvalStatus) {
    whereConditions.push('approvalStatus = ?');
    queryParams.push(approvalStatus);
  }

  if (search && search.trim() !== '') {
    whereConditions.push('(title LIKE ? OR city LIKE ? OR suburb LIKE ? OR address LIKE ? OR shortDescription LIKE ? OR longDescription LIKE ?)');
    const searchTerm = `%${search.trim()}%`;
    queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
  }

  const whereSql = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  try {
    const [countRows] = await db.query(
      `SELECT COUNT(*) AS total FROM Properties ${whereSql}`,
      queryParams
    );
    const total = countRows[0].total;

    const [rows] = await db.query(
      `SELECT * FROM Properties ${whereSql} ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
      [...queryParams, parsedLimit, offset]
    );

    // Attach relational data
    await attachPropertyAssociations(rows);

    return res.status(200).json({
      status: 'success',
      message: 'Admin property list fetched successfully',
      data: {
        properties: rows,
        pagination: {
          total,
          page: parsedPage,
          totalPages: Math.ceil(total / parsedLimit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching admin properties:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch admin properties',
      error: error.message
    });
  }
};

exports.updateProperty = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const [existingRows] = await connection.query('SELECT * FROM Properties WHERE id = ?', [id]);

    if (existingRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        status: 'error',
        message: 'Property not found',
      });
    }

    const existingProperty = existingRows[0];

    const {
      title, shortDescription, longDescription, priceRange, budgetType,
      city, suburb, district, state, pincode, road,
      country, continent, timezone, isoCode,
      latitude, longitude, address, googleMapLink, propertyType, status,
      bedrooms, bathrooms, furnishedStatus, parkingAvailable,
      launchDate, completionDate, floorNumber, numberOfTowers,
      carpetArea, totalArea, facing, amenities, nearbyFacilities,
      floorPlans, developerInfo,
      seoTitle, metaDescription, metaKeywords, ogTitle, ogType,
      ogDescription, twitterCard, canonicalUrl, focusKeyword, robotsIndex,
      existingAdditionalPhotos,
    } = req.body;

    let bedroomsArray = bedrooms;
    if (typeof bedrooms === 'string') {
      bedroomsArray = bedrooms.split(',').map(b => b.trim());
    }

    const coverPhotoPath = req.files?.coverPhoto
      ? path.relative('uploads', req.files.coverPhoto[0].path)
      : existingProperty.coverPhoto;

    const updatedApprovalStatus = req.user?.role === 'broker' ? 'pending' : existingProperty.approvalStatus;

    await connection.query(
      `UPDATE Properties SET
        title = ?, shortDescription = ?, longDescription = ?, priceRange = ?, budgetType = ?,
        city = ?, suburb = ?, district = ?, state = ?, pincode = ?, road = ?,
        country = ?, continent = ?, timezone = ?, isoCode = ?,
        latitude = ?, longitude = ?, address = ?, googleMapLink = ?, propertyType = ?, status = ?,
        bedrooms = ?, bathrooms = ?, furnishedStatus = ?, parkingAvailable = ?,
        launchDate = ?, completionDate = ?, floorNumber = ?, numberOfTowers = ?,
        carpetArea = ?, totalArea = ?, facing = ?, coverPhoto = ?, approvalStatus = ?,
        seoTitle = ?, metaDescription = ?, metaKeywords = ?, ogTitle = ?, ogType = ?,
        ogDescription = ?, twitterCard = ?, canonicalUrl = ?, focusKeyword = ?, robotsIndex = ?
      WHERE id = ?`,
      [
        title || existingProperty.title,
        shortDescription !== undefined ? shortDescription : existingProperty.shortDescription,
        longDescription !== undefined ? longDescription : existingProperty.longDescription,
        priceRange !== undefined ? priceRange : existingProperty.priceRange,
        budgetType || existingProperty.budgetType,
        city !== undefined ? city : existingProperty.city,
        suburb !== undefined ? suburb : existingProperty.suburb,
        district !== undefined ? district : existingProperty.district,
        state !== undefined ? state : existingProperty.state,
        pincode !== undefined ? pincode : existingProperty.pincode,
        road !== undefined ? road : existingProperty.road,
        country !== undefined ? country : existingProperty.country,
        continent !== undefined ? continent : existingProperty.continent,
        timezone !== undefined ? timezone : existingProperty.timezone,
        isoCode !== undefined ? isoCode : existingProperty.isoCode,
        latitude ? parseFloat(latitude) : existingProperty.latitude,
        longitude ? parseFloat(longitude) : existingProperty.longitude,
        address !== undefined ? address : existingProperty.address,
        googleMapLink !== undefined ? googleMapLink : existingProperty.googleMapLink,
        propertyType || existingProperty.propertyType,
        status || existingProperty.status,
        Array.isArray(bedroomsArray) ? bedroomsArray.join(',') : (bedrooms || existingProperty.bedrooms),
        bathrooms ? parseInt(bathrooms, 10) : existingProperty.bathrooms,
        furnishedStatus || existingProperty.furnishedStatus,
        parkingAvailable === 'true' || parkingAvailable === true ? 1 : 0,
        launchDate ? new Date(launchDate) : existingProperty.launchDate,
        completionDate ? new Date(completionDate) : existingProperty.completionDate,
        floorNumber !== undefined ? floorNumber : existingProperty.floorNumber,
        numberOfTowers !== undefined ? numberOfTowers : existingProperty.numberOfTowers,
        carpetArea !== undefined ? carpetArea : existingProperty.carpetArea,
        totalArea !== undefined ? totalArea : existingProperty.totalArea,
        facing || existingProperty.facing,
        coverPhotoPath,
        updatedApprovalStatus,
        seoTitle || null,
        metaDescription || null,
        metaKeywords || null,
        ogTitle || null,
        ogType || 'website',
        ogDescription || null,
        twitterCard || 'summary_large_image',
        canonicalUrl || null,
        focusKeyword || null,
        robotsIndex || 'index,follow',
        id
      ]
    );

    // Photos retention / update
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
          'INSERT INTO PropertyImages (propertyId, imageUrl) VALUES (?, ?)',
          [id, path.relative('uploads', file.path)]
        );
      }
    }

    // Amenities
    if (amenities) {
      let amenitiesArray = amenities;
      if (typeof amenities === 'string') {
        amenitiesArray = amenities.split(',').map(aId => parseInt(aId.trim(), 10)).filter(aId => !isNaN(aId));
      }
      if (Array.isArray(amenitiesArray)) {
        await connection.query('DELETE FROM PropertyAmenities WHERE propertyId = ?', [id]);
        for (const amenityId of amenitiesArray) {
          await connection.query(
            'INSERT INTO PropertyAmenities (propertyId, amenityId) VALUES (?, ?)',
            [id, amenityId]
          );
        }
      }
    }

    // Nearby Facilities
    if (nearbyFacilities) {
      await connection.query('DELETE FROM NearbyFacilities WHERE propertyId = ?', [id]);
      const facilitiesArray = typeof nearbyFacilities === 'string' ? JSON.parse(nearbyFacilities) : nearbyFacilities;
      for (const fac of facilitiesArray) {
        await connection.query(
          'INSERT INTO NearbyFacilities (propertyId, facilityName, distance) VALUES (?, ?, ?)',
          [id, fac.facilityName || fac.facilityType, fac.distance]
        );
      }
    }

    // Floor Plans
    if (floorPlans) {
      await connection.query('DELETE FROM FloorPlans WHERE propertyId = ?', [id]);
      const floorPlansArray = typeof floorPlans === 'string' ? JSON.parse(floorPlans) : floorPlans;
      for (let i = 0; i < floorPlansArray.length; i++) {
        const fp = floorPlansArray[i];
        const photo = req.files?.floorPlans?.[i];
        await connection.query(
          'INSERT INTO FloorPlans (propertyId, title, imageUrl) VALUES (?, ?, ?)',
          [
            id,
            fp.floorName || fp.title || 'Floor Plan',
            photo ? path.relative('uploads', photo.path) : (fp.imageUrl || fp.photo || null)
          ]
        );
      }
    }

    // Developer Info
    if (developerInfo) {
      await connection.query('DELETE FROM DeveloperInfos WHERE propertyId = ?', [id]);
      const devInfo = typeof developerInfo === 'string' ? JSON.parse(developerInfo) : developerInfo;
      const logoUrl = req.files?.developerLogo ? path.relative('uploads', req.files.developerLogo[0].path) : (devInfo.logoUrl || null);
      await connection.query(
        'INSERT INTO DeveloperInfos (propertyId, developerName, aboutDeveloper, logoUrl) VALUES (?, ?, ?, ?)',
        [id, devInfo.developerName, devInfo.developerDescription || devInfo.aboutDeveloper, logoUrl]
      );
    }

    // Layout Maps
    if (req.files?.layoutMaps) {
      await connection.query('DELETE FROM LayoutMaps WHERE propertyId = ?', [id]);
      for (const file of req.files.layoutMaps) {
        await connection.query(
          'INSERT INTO LayoutMaps (propertyId, title, imageUrl) VALUES (?, ?, ?)',
          [id, 'Layout Map', path.relative('uploads', file.path)]
        );
      }
    }

    await connection.commit();

    return res.status(200).json({
      status: 'success',
      message: 'Property updated successfully.',
      propertyId: id,
      seoData: {
        seoTitle,
        metaDescription,
        focusKeyword
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error updating property:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update property',
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

exports.deleteProperty = async (req, res) => {
  const { id } = req.params;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.query('SELECT * FROM Properties WHERE id = ?', [id]);
    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        status: 'error',
        message: 'Property not found'
      });
    }

    const property = rows[0];

    if (req.user?.role === 'broker' && property.brokerId !== req.user.id) {
      await connection.rollback();
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to delete this property'
      });
    }

    await connection.query('DELETE FROM PropertyAmenities WHERE propertyId = ?', [id]);
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

    return res.status(200).json({
      status: 'success',
      message: 'Property deleted successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting property:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete property',
      error: error.message
    });
  } finally {
    connection.release();
  }
};
