const { query } = require('../../config/db');

async function populatePropertyAssociations(properties) {
  if (!properties || properties.length === 0) return [];
  const propertyIds = properties.map(p => p.id);

  const images = await query('SELECT * FROM PropertyImages WHERE propertyId IN (?)', [propertyIds]);
  const floorPlans = await query('SELECT * FROM FloorPlans WHERE propertyId IN (?)', [propertyIds]);
  const developerInfos = await query('SELECT * FROM DeveloperInfos WHERE propertyId IN (?)', [propertyIds]);
  const layoutMaps = await query('SELECT * FROM LayoutMaps WHERE propertyId IN (?)', [propertyIds]);
  const nearbyFacilities = await query('SELECT * FROM NearbyFacilities WHERE propertyId IN (?)', [propertyIds]);
  
  // Amenities via PropertyAmenities join table
  const amenities = await query(
    `SELECT pa.propertyId, a.* 
     FROM PropertyAmenities pa 
     JOIN Amenities a ON pa.amenityId = a.id 
     WHERE pa.propertyId IN (?)`,
    [propertyIds]
  ).catch(() => []);

  const imageMap = {};
  const floorPlanMap = {};
  const devInfoMap = {};
  const layoutMap = {};
  const facilityMap = {};
  const amenityMap = {};

  images.forEach(img => {
    if (!imageMap[img.propertyId]) imageMap[img.propertyId] = [];
    imageMap[img.propertyId].push(img);
  });

  floorPlans.forEach(fp => {
    if (!floorPlanMap[fp.propertyId]) floorPlanMap[fp.propertyId] = [];
    floorPlanMap[fp.propertyId].push(fp);
  });

  developerInfos.forEach(dev => {
    devInfoMap[dev.propertyId] = dev;
  });

  layoutMaps.forEach(lm => {
    if (!layoutMap[lm.propertyId]) layoutMap[lm.propertyId] = [];
    layoutMap[lm.propertyId].push(lm);
  });

  nearbyFacilities.forEach(nf => {
    if (!facilityMap[nf.propertyId]) facilityMap[nf.propertyId] = [];
    facilityMap[nf.propertyId].push(nf);
  });

  amenities.forEach(a => {
    if (!amenityMap[a.propertyId]) amenityMap[a.propertyId] = [];
    amenityMap[a.propertyId].push(a);
  });

  return properties.map(p => ({
    ...p,
    images: imageMap[p.id] || [],
    amenities: amenityMap[p.id] || [],
    nearbyFacilities: facilityMap[p.id] || [],
    floorPlans: floorPlanMap[p.id] || [],
    developerInfo: devInfoMap[p.id] || null,
    layoutMaps: layoutMap[p.id] || []
  }));
}

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

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const whereClauses = ["approvalStatus = 'approved'"];
  const params = [];

  if (search) {
    whereClauses.push('(title LIKE ? OR shortDescription LIKE ? OR longDescription LIKE ? OR city LIKE ? OR suburb LIKE ? OR address LIKE ?)');
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
  }

  if (minPrice) {
    whereClauses.push('priceRange >= ?');
    params.push(parseFloat(minPrice));
  }
  if (maxPrice) {
    whereClauses.push('priceRange <= ?');
    params.push(parseFloat(maxPrice));
  }
  if (bedrooms) {
    whereClauses.push('bedrooms LIKE ?');
    params.push(`%${bedrooms}%`);
  }
  if (propertyType) {
    whereClauses.push('propertyType = ?');
    params.push(propertyType);
  }

  const fieldFilters = { suburb, district, state, pincode, road, country, continent, timezone, isoCode, latitude, longitude, address };
  Object.keys(fieldFilters).forEach(key => {
    if (fieldFilters[key]) {
      whereClauses.push(`${key} LIKE ?`);
      params.push(`%${fieldFilters[key]}%`);
    }
  });

  const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
  const validSortFields = ['createdAt', 'updatedAt', 'title', 'priceRange'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  try {
    const countResult = await query(`SELECT COUNT(*) as total FROM Properties ${whereSQL}`, params);
    const total = countResult[0]?.total || 0;

    const selectParams = [...params, parseInt(limit), offset];
    const properties = await query(
      `SELECT * FROM Properties ${whereSQL} ORDER BY ${sortField} ${sortOrder} LIMIT ? OFFSET ?`,
      selectParams
    );

    const populatedProperties = await populatePropertyAssociations(properties);

    return res.status(200).json({
      status: 'success',
      message: 'Filtered properties fetched successfully',
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
      message: 'Failed to fetch properties',
      error: error.message
    });
  }
};

exports.getSingleProperty = async (req, res) => {
  const { id } = req.params;

  try {
    const properties = await query("SELECT * FROM Properties WHERE id = ? AND approvalStatus = 'approved'", [id]);

    if (properties.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found or not approved'
      });
    }

    const [populated] = await populatePropertyAssociations(properties);

    return res.status(200).json({
      status: 'success',
      message: 'Property fetched successfully',
      data: populated
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch property',
      error: error.message
    });
  }
};

module.exports.populatePropertyAssociations = populatePropertyAssociations;