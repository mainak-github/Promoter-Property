const {
  Property, PropertyImage, Amenity, NearbyFacility,
  FloorPlan, DeveloperInfo, LayoutMap, sequelize
} = require('../../../models');
const slugify = require('slugify');
const fs = require('fs');
const { Op } = require('sequelize');
const path = require('path');

exports.getAllProperties = async (req, res) => {
  const {
    approvalStatus, // optional: 'approved', 'pending', 'rejected'
    search = '',
    page = 1,
    limit = 10
  } = req.query;

  const offset = (page - 1) * limit;
  const where = {};

  if (approvalStatus) {
    where.approvalStatus = approvalStatus;
  }

  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { location: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ];
  }

  try {
    const { count, rows } = await Property.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        { model: PropertyImage, as: 'images' },
        { model: Amenity, as: 'amenities' },
        { model: NearbyFacility, as: 'nearbyFacilities' },
        { model: FloorPlan, as: 'floorPlans' },
        { model: DeveloperInfo, as: 'developerInfo' },
        { model: LayoutMap, as: 'layoutMaps' }
      ]
    });

    return res.status(200).json({
      status: 'success',
      message: 'Admin property list fetched successfully',
      data: {
        properties: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          totalPages: Math.ceil(count / limit)
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
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    const existingProperty = await Property.findByPk(id);

    if (!existingProperty) {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found',
      });
    }

    // Extract fields from req.body
    const {
      title, shortDescription, longDescription, priceRange, budgetType,
      city, subLocation, googleMapLink, propertyType, status,
      bedrooms, bathrooms, furnishedStatus, parkingAvailable,
      launchDate, completionDate, floorNumber, numberOfTowers,
      carpetArea, totalArea, facing, amenities, nearbyFacilities,
      floorPlans, developerInfo,

      // New Location fields
      suburb, district, state, pincode, road,
      country, continent, timezone, isoCode,
      latitude, longitude, address,

      // ============ SEO FIELDS ============
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
      // ============ END SEO FIELDS ============

      // Existing additional photos to retain (JSON string expected)
      existingAdditionalPhotos,
    } = req.body;

    // Handle bedrooms as array or string
    let bedroomsArray = bedrooms;
    if (typeof bedrooms === 'string') {
      bedroomsArray = bedrooms.split(',').map(b => b.trim());
    }

    // Update main property fields with SEO fields
    await existingProperty.update({
      title,
      shortDescription,
      longDescription,
      priceRange,
      budgetType,
      city,
      subLocation,
      googleMapLink,
      propertyType,
      status,
      bedrooms: Array.isArray(bedroomsArray) ? bedroomsArray.join(',') : null,
      bathrooms: bathrooms ? parseInt(bathrooms) : null,
      furnishedStatus,
      parkingAvailable: parkingAvailable === 'true' || parkingAvailable === true,
      launchDate: launchDate ? new Date(launchDate) : null,
      completionDate: completionDate ? new Date(completionDate) : null,
      floorNumber,
      numberOfTowers,
      carpetArea,
      totalArea,
      facing,
      coverPhoto: req.files.coverPhoto ? path.relative('uploads', req.files.coverPhoto[0].path) : existingProperty.coverPhoto,
      approvalStatus: req.user.role === 'broker' ? 'pending' : existingProperty.approvalStatus,

      // Location fields
      suburb, district, state, pincode, road,
      country, continent, timezone, isoCode,
      latitude, longitude, address,

      // ============ SEO FIELDS UPDATE ============
      seoTitle: seoTitle || null,
      metaDescription: metaDescription || null,
      metaKeywords: metaKeywords || null,
      ogTitle: ogTitle || null,
      ogType: ogType || 'website',
      ogDescription: ogDescription || null,
      twitterCard: twitterCard || 'summary_large_image',
      canonicalUrl: canonicalUrl || null,
      focusKeyword: focusKeyword || null,
      robotsIndex: robotsIndex || 'index,follow'
      // ============ END SEO FIELDS UPDATE ============
    }, { transaction: t });

    // === Handle Additional Photos preserving existing ones ===

    // Parse JSON string of retained photos, or empty array if none sent
    const existingPhotos = existingAdditionalPhotos 
      ? JSON.parse(existingAdditionalPhotos) 
      : [];

    // Get current images from database
    const currentImages = await PropertyImage.findAll({ where: { propertyId: id }, transaction: t });

    // Find images to delete that are NOT in the retained list
    const imagesToDelete = currentImages.filter(img => !existingPhotos.includes(img.imageUrl));

    // Delete images removed by user
    for (const img of imagesToDelete) {
      await PropertyImage.destroy({ where: { id: img.id }, transaction: t });
    }

    // Add newly uploaded photos
    if (req.files.additionalPhotos) {
      const newImages = req.files.additionalPhotos.map(file => ({
        propertyId: id,
        imageUrl: path.relative('uploads', file.path),
      }));
      await PropertyImage.bulkCreate(newImages, { transaction: t });
    }

    // === Amenities (many-to-many) update ===
    if (amenities) {
      let amenitiesArray = amenities;
      if (typeof amenities === 'string') {
        amenitiesArray = amenities
          .split(',')
          .map(id => parseInt(id.trim()))
          .filter(id => !isNaN(id));
      }
      if (Array.isArray(amenitiesArray) && amenitiesArray.length > 0) {
        await existingProperty.setAmenities(amenitiesArray, { transaction: t });
      }
    }

    // === Nearby Facilities (1-to-many) update ===
    await NearbyFacility.destroy({ where: { propertyId: id }, transaction: t });
    if (nearbyFacilities) {
      const facilitiesArray = JSON.parse(nearbyFacilities);
      for (const fac of facilitiesArray) {
        await existingProperty.createNearbyFacility({
          facilityType: fac.facilityType,
          facilityName: fac.facilityName,
          distance: fac.distance,
        }, { transaction: t });
      }
    }

    // === Floor Plans (1-to-many) update ===
    await FloorPlan.destroy({ where: { propertyId: id }, transaction: t });
    if (floorPlans) {
      const floorPlansArray = Array.isArray(floorPlans) ? floorPlans : JSON.parse(floorPlans);
      for (let i = 0; i < floorPlansArray.length; i++) {
        const fp = floorPlansArray[i];
        const photo = req.files.floorPlans && req.files.floorPlans[i];
        await FloorPlan.create({
          propertyId: id,
          photo: photo ? path.relative('uploads', photo.path) : null,
          floorName: fp.floorName,
          towerName: fp.towerName,
          shortDescription: fp.shortDescription,
          priceRange: fp.priceRange,
        }, { transaction: t });
      }
    }

    // === Developer Info (1-to-1) update ===
    await DeveloperInfo.destroy({ where: { propertyId: id }, transaction: t });
    if (developerInfo) {
      const devInfo = JSON.parse(developerInfo);
      await existingProperty.createDeveloperInfo({
        developerName: devInfo.developerName,
        developerDescription: devInfo.developerDescription,
        developerLogo: req.files.developerLogo ? path.relative('uploads', req.files.developerLogo[0].path) : null,
      }, { transaction: t });
    }

    // === Layout Maps (1-to-many) update ===
    await LayoutMap.destroy({ where: { propertyId: id }, transaction: t });
    if (req.files.layoutMaps) {
      const maps = req.files.layoutMaps.map(file => ({
        propertyId: id,
        mapPhoto: path.relative('uploads', file.path),
      }));
      await LayoutMap.bulkCreate(maps, { transaction: t });
    }

    // Commit all changes
    await t.commit();

    return res.status(200).json({
      status: 'success',
      message: 'Property updated successfully. Awaiting admin approval.',
      propertyId: existingProperty.id,
      seoData: {
        seoTitle: existingProperty.seoTitle,
        metaDescription: existingProperty.metaDescription,
        focusKeyword: existingProperty.focusKeyword
      }
    });

  } catch (error) {
    // Rollback on error
    await t.rollback();
    console.error('Error updating property:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update property',
      error: error.message,
    });
  }
};



exports.deleteProperty = async (req, res) => {
  const { id } = req.params;

  try {
    const property = await Property.findByPk(id, {
      include: ['images', 'amenities', 'nearbyFacilities', 'floorPlans', 'developerInfo', 'layoutMaps']
    });

    if (!property) {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found'
      });
    }

    // Only allow broker to delete their own properties
    if (req.user.role === 'broker' && property.brokerId !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to delete this property'
      });
    }

    // Begin transaction
    const t = await sequelize.transaction();

    try {
      // Remove associations first
      await property.setAmenities([], { transaction: t });

      await Promise.all([
        NearbyFacility.destroy({ where: { propertyId: id }, transaction: t }),
        FloorPlan.destroy({ where: { propertyId: id }, transaction: t }),
        DeveloperInfo.destroy({ where: { propertyId: id }, transaction: t }),
        LayoutMap.destroy({ where: { propertyId: id }, transaction: t }),
        PropertyImage.destroy({ where: { propertyId: id }, transaction: t })
      ]);

      // Delete the property itself
      await property.destroy({ transaction: t });

      // Optionally: delete the upload folder
      const propertyFolder = path.join(__dirname, '../../../uploads/properties', property.slug || `${property.id}`);
      if (fs.existsSync(propertyFolder)) {
        fs.rmSync(propertyFolder, { recursive: true, force: true });
      }

      await t.commit();

      return res.status(200).json({
        status: 'success',
        message: 'Property deleted successfully'
      });

    } catch (error) {
      await t.rollback();
      console.error('Transaction error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete property',
        error: error.message
      });
    }

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred',
      error: error.message
    });
  }
};

