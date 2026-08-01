
// controllers/broker/property.controller.js
const { Property, PropertyImage, Amenity, NearbyFacility, FloorPlan, DeveloperInfo, LayoutMap, sequelize } = require('../../../models');
const slugify = require('slugify');
const path = require('path');

exports.createProperty = async (req, res) => {
  const t = await sequelize.transaction();
  try {
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
    } = req.body;

    // Convert comma-separated bedrooms string to array if needed
    let bedroomsArray = bedrooms;
    if (typeof bedrooms === 'string') {
      bedroomsArray = bedrooms.split(',').map(b => b.trim());
    }

    const slug = slugify(title, { lower: true });

    // 1. Create Property with SEO fields
    const property = await Property.create({
      brokerId: req.user.id,
      coverPhoto: req.files.coverPhoto ? path.relative('uploads', req.files.coverPhoto[0].path) : null,
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
      approvalStatus: 'pending',
      slug,
      // ============ SEO FIELDS ============
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
      // ============ END SEO FIELDS ============
    }, { transaction: t });

    // 2. Additional Photos
    if (req.files.additionalPhotos) {
      const images = req.files.additionalPhotos.map(file => ({
        propertyId: property.id,
        imageUrl: file.path ? path.relative('uploads', file.path) : null
      }));
      await PropertyImage.bulkCreate(images, { transaction: t });
    }

    // 3. Amenities
    if (amenities) {
      let amenityNames = [];
      
      if (typeof amenities === 'string') {
        amenityNames = amenities.split(',').map(name => name.trim()).filter(name => name);
      } else if (Array.isArray(amenities)) {
        amenityNames = amenities;
      }
      
      console.log('Amenity names:', amenityNames);
      
      if (amenityNames.length > 0) {
        const amenityInstances = [];
        
        // Find or create each amenity
        for (const name of amenityNames) {
          const [amenity] = await Amenity.findOrCreate({
            where: { name: name },
            defaults: { name: name },
            transaction: t
          });
          amenityInstances.push(amenity);
        }
        
        // Associate all amenities with the property
        await property.setAmenities(amenityInstances, { transaction: t });
        
        console.log('✅ Amenities associated:', amenityInstances.map(a => a.name));
      }
    }

    // 4. Nearby Facilities
    if (nearbyFacilities) {
      const facilitiesArray = typeof nearbyFacilities === 'string' ? JSON.parse(nearbyFacilities) : nearbyFacilities;
      for (const fac of facilitiesArray) {
        await property.createNearbyFacility({
          facilityType: fac.facilityType,
          facilityName: fac.facilityName,
          distance: fac.distance
        }, { transaction: t });
      }
    }

    // 5. Floor Plans
    if (floorPlans) {
      const floorPlansArray = Array.isArray(floorPlans) ? floorPlans : JSON.parse(floorPlans);
      for (let i = 0; i < floorPlansArray.length; i++) {
        const fp = floorPlansArray[i];
        const photo = req.files.floorPlans && req.files.floorPlans[i];
        await FloorPlan.create({
          propertyId: property.id,
          photo: photo ? path.relative('uploads', photo.path) : null,
          floorName: fp.floorName,
          towerName: fp.towerName,
          shortDescription: fp.shortDescription,
          priceRange: fp.priceRange
        }, { transaction: t });
      }
    }

    // 6. Developer Info
    if (developerInfo) {
      const devInfo = typeof developerInfo === 'string' ? JSON.parse(developerInfo) : developerInfo;
      await property.createDeveloperInfo({
        developerName: devInfo.developerName,
        developerDescription: devInfo.developerDescription,
        developerLogo: req.files.developerLogo ? path.relative('uploads', req.files.developerLogo[0].path) : null
      }, { transaction: t });
    }

    // 7. Layout Maps
    if (req.files.layoutMaps) {
      const maps = req.files.layoutMaps.map(file => ({
        propertyId: property.id,
        mapPhoto: path.relative('uploads', file.path)
      }));
      await LayoutMap.bulkCreate(maps, { transaction: t });
    }

    await t.commit();

    return res.status(201).json({
      message: 'Property created successfully, pending admin approval.',
      propertyId: property.id,
      seoData: {
        seoTitle: property.seoTitle,
        metaDescription: property.metaDescription,
        focusKeyword: property.focusKeyword
      }
    });

  } catch (error) {
    await t.rollback();
    console.error('Error creating property:', error);
    return res.status(500).json({
      message: 'Failed to create property.',
      error: error.message
    });
  }
};




// list all properties
exports.listProperties = async (req, res) => {
  try {
    const properties = await Property.findAll({
      // include: [{ model: Property, as: 'Property' }]
    });
    res.json(properties);
    console.log('Properties fetched successfully', properties);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch properties', message: err.message });
  }
};

// list broker specicific properties
exports.listBrokerProperties = async (req, res) => {
  try {
    const properties = await Property.findAll({
      where: { brokerId: req.params.id },
      include: [
        { model: PropertyImage, as: 'images' },
        { model: Amenity, as: 'amenities' },
        { model: NearbyFacility, as: 'nearbyFacilities' },
        { model: FloorPlan, as: 'floorPlans' },
        { model: DeveloperInfo, as: 'developerInfo' },
        { model: LayoutMap, as: 'layoutMaps' }
      ]
    });
    res.json(properties);
    console.log('Broker properties fetched successfully', properties);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch broker properties', message: err.message });
  }
}

// property details
exports.getPropertyDetails = async (req, res) => {
  try {
    const property = await Property.findOne({
      where: { id: req.params.id },
      include: [
        { model: PropertyImage, as: 'images' },
        { model: Amenity, as: 'amenities' },
        { model: NearbyFacility, as: 'nearbyFacilities' },
        { model: FloorPlan, as: 'floorPlans' },
        { model: DeveloperInfo, as: 'developerInfo' },
        { model: LayoutMap, as: 'layoutMaps' }
      ]
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
     res.status(200).json({mes: 'Property details fetched successfully', property });
     
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch property details', message: err.message });
  }
}