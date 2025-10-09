const { Op } = require('sequelize');
const {
  Property,
  PropertyImage,
  Amenity,
  NearbyFacility,
  FloorPlan,
  DeveloperInfo,
  LayoutMap
} = require('../../../models');

exports.getApprovedProperties = async (req, res) => {
  const {
    search = '',
    minPrice,
    maxPrice,
    bedrooms,
    propertyType,
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
    address,
    sortBy = 'createdAt',
    order = 'desc',
    page = 1,
    limit = 10
  } = req.query;

  const offset = (page - 1) * limit;

  const where = {
    approvalStatus: 'approved',
    [Op.and]: []
  };

  // Full-text search
  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { shortDescription: { [Op.like]: `%${search}%` } },
      { longDescription: { [Op.like]: `%${search}%` } },
      { city: { [Op.like]: `%${search}%` } },
      { suburb: { [Op.like]: `%${search}%` } },
      { address: { [Op.like]: `%${search}%` } }
    ];
  }

  // Price filter
  if (minPrice || maxPrice) {
    where.priceRange = {};
    if (minPrice) where.priceRange[Op.gte] = parseFloat(minPrice);
    if (maxPrice) where.priceRange[Op.lte] = parseFloat(maxPrice);
  }

  // Bedroom filter (supports 1 BHK, 2 BHK etc)
  if (bedrooms) {
    where.bedrooms = {
      [Op.like]: `%${bedrooms}%`
    };
  }

  // Property Type
  if (propertyType) where.propertyType = propertyType;

  // Advanced location filters
  if (suburb) where.suburb = { [Op.like]: `%${suburb}%` };
  if (district) where.district = { [Op.like]: `%${district}%` };
  if (state) where.state = { [Op.like]: `%${state}%` };
  if (pincode) where.pincode = { [Op.like]: `%${pincode}%` };
  if (road) where.road = { [Op.like]: `%${road}%` };
  if (country) where.country = { [Op.like]: `%${country}%` };
  if (continent) where.continent = { [Op.like]: `%${continent}%` };
  if (timezone) where.timezone = { [Op.like]: `%${timezone}%` };
  if (isoCode) where.isoCode = { [Op.like]: `%${isoCode}%` };
  if (latitude) where.latitude = { [Op.like]: `%${latitude}%` };
  if (longitude) where.longitude = { [Op.like]: `%${longitude}%` };
  if (address) where.address = { [Op.like]: `%${address}%` };

  try {
    const { count, rows } = await Property.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[sortBy, order.toUpperCase()]],
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
      message: 'Filtered properties fetched successfully',
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
      message: 'Failed to fetch properties',
      error: error.message
    });
  }
};

exports.getSingleProperty = async (req, res) => {
  const { id } = req.params;

  try {
    const property = await Property.findOne({
      where: {
        id,
        approvalStatus: 'approved'
      },
      include: [
        { model: PropertyImage, as: 'images' },
        { model: Amenity, as: 'amenities' },
        { model: FloorPlan, as: 'floorPlans' },
        { model: DeveloperInfo, as: 'developerInfo' },
        { model: LayoutMap, as: 'layoutMaps' },
        { model: NearbyFacility, as: 'nearbyFacilities' }
      ]
    });

    if (!property) {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found or not approved'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Property fetched successfully',
      data: property
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch property',
      error: error.message
    });
  }
};