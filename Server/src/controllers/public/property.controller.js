const db = require('../../config/db');
const { attachPropertyAssociations } = require('../../utils/propertyHelper');

exports.getApprovedProperties = async (req, res) => {
  const {
    search = '',
    minPrice,
    maxPrice,
    bedrooms,
    propertyType,
    city,
    status,
    furnishedStatus,
    facing,
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

  const parsedLimit = parseInt(limit, 10);
  const parsedPage = parseInt(page, 10);
  const offset = (parsedPage - 1) * parsedLimit;

  const whereConditions = ["approvalStatus = 'approved'"];
  const queryParams = [];

  if (search && search.trim() !== '') {
    whereConditions.push('(title LIKE ? OR shortDescription LIKE ? OR longDescription LIKE ? OR city LIKE ? OR suburb LIKE ? OR address LIKE ?)');
    const term = `%${search.trim()}%`;
    queryParams.push(term, term, term, term, term, term);
  }

  if (minPrice) {
    whereConditions.push('CAST(priceRange AS DECIMAL(15,2)) >= ?');
    queryParams.push(parseFloat(minPrice));
  }
  if (maxPrice) {
    whereConditions.push('CAST(priceRange AS DECIMAL(15,2)) <= ?');
    queryParams.push(parseFloat(maxPrice));
  }

  if (bedrooms) {
    whereConditions.push('bedrooms LIKE ?');
    queryParams.push(`%${bedrooms}%`);
  }

  if (propertyType) {
    whereConditions.push('propertyType = ?');
    queryParams.push(propertyType);
  }

  if (city && city.trim() !== '') {
    whereConditions.push('city LIKE ?');
    queryParams.push(`%${city.trim()}%`);
  }

  if (status && status.trim() !== '') {
    whereConditions.push('status = ?');
    queryParams.push(status.trim());
  }

  if (furnishedStatus && furnishedStatus.trim() !== '') {
    whereConditions.push('furnishedStatus = ?');
    queryParams.push(furnishedStatus.trim());
  }

  if (facing && facing.trim() !== '') {
    whereConditions.push('facing LIKE ?');
    queryParams.push(`%${facing.trim()}%`);
  }

  if (suburb) {
    whereConditions.push('suburb LIKE ?');
    queryParams.push(`%${suburb}%`);
  }
  if (district) {
    whereConditions.push('district LIKE ?');
    queryParams.push(`%${district}%`);
  }
  if (state) {
    whereConditions.push('state LIKE ?');
    queryParams.push(`%${state}%`);
  }
  if (pincode) {
    whereConditions.push('pincode LIKE ?');
    queryParams.push(`%${pincode}%`);
  }
  if (road) {
    whereConditions.push('road LIKE ?');
    queryParams.push(`%${road}%`);
  }
  if (country) {
    whereConditions.push('country LIKE ?');
    queryParams.push(`%${country}%`);
  }
  if (continent) {
    whereConditions.push('continent LIKE ?');
    queryParams.push(`%${continent}%`);
  }
  if (timezone) {
    whereConditions.push('timezone LIKE ?');
    queryParams.push(`%${timezone}%`);
  }
  if (isoCode) {
    whereConditions.push('isoCode LIKE ?');
    queryParams.push(`%${isoCode}%`);
  }
  if (latitude) {
    whereConditions.push('latitude LIKE ?');
    queryParams.push(`%${latitude}%`);
  }
  if (longitude) {
    whereConditions.push('longitude LIKE ?');
    queryParams.push(`%${longitude}%`);
  }
  if (address) {
    whereConditions.push('address LIKE ?');
    queryParams.push(`%${address}%`);
  }

  const allowedSortColumns = ['createdAt', 'priceRange', 'title', 'id'];
  const sortCol = allowedSortColumns.includes(sortBy) ? sortBy : 'createdAt';
  const sortDir = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  const whereSql = `WHERE ${whereConditions.join(' AND ')}`;

  try {
    const [countRows] = await db.query(
      `SELECT COUNT(*) AS total FROM Properties ${whereSql}`,
      queryParams
    );
    const total = countRows[0].total;

    const [rows] = await db.query(
      `SELECT * FROM Properties ${whereSql} ORDER BY ${sortCol} ${sortDir} LIMIT ? OFFSET ?`,
      [...queryParams, parsedLimit, offset]
    );

    await attachPropertyAssociations(rows);

    return res.status(200).json({
      status: 'success',
      message: 'Filtered properties fetched successfully',
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
    console.error('Error fetching public properties:', error);
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
    const [rows] = await db.query(
      "SELECT * FROM Properties WHERE id = ? AND approvalStatus = 'approved'",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found or not approved'
      });
    }

    const property = await attachPropertyAssociations(rows[0]);

    return res.status(200).json({
      status: 'success',
      message: 'Property fetched successfully',
      data: property
    });

  } catch (error) {
    console.error('Error fetching single property:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch property',
      error: error.message
    });
  }
};