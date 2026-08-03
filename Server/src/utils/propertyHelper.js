const db = require('../config/db');

async function attachPropertyAssociations(properties) {
  if (!properties || properties.length === 0) return [];

  const isSingle = !Array.isArray(properties);
  const propertyList = isSingle ? [properties] : properties;
  const propertyIds = propertyList.map(p => p.id);

  if (propertyIds.length === 0) return isSingle ? properties : propertyList;

  // 1. Property Images
  const [images] = await db.query(
    `SELECT * FROM PropertyImages WHERE propertyId IN (?) ORDER BY id ASC`,
    [propertyIds]
  );

  // 2. Amenities (Joined through PropertyAmenities)
  const [amenities] = await db.query(
    `SELECT a.*, pa.propertyId 
     FROM Amenities a 
     JOIN PropertyAmenities pa ON a.id = pa.amenityId 
     WHERE pa.propertyId IN (?)`,
    [propertyIds]
  );

  // 3. Nearby Facilities
  const [nearbyFacilities] = await db.query(
    `SELECT * FROM NearbyFacilities WHERE propertyId IN (?) ORDER BY id ASC`,
    [propertyIds]
  );

  // 4. Floor Plans
  const [floorPlans] = await db.query(
    `SELECT * FROM FloorPlans WHERE propertyId IN (?) ORDER BY id ASC`,
    [propertyIds]
  );

  // 5. Developer Info
  const [developerInfos] = await db.query(
    `SELECT * FROM DeveloperInfos WHERE propertyId IN (?)`,
    [propertyIds]
  );

  // 6. Layout Maps
  const [layoutMaps] = await db.query(
    `SELECT * FROM LayoutMaps WHERE propertyId IN (?) ORDER BY id ASC`,
    [propertyIds]
  );

  // Group by propertyId
  const imagesByProperty = {};
  const amenitiesByProperty = {};
  const facilitiesByProperty = {};
  const floorPlansByProperty = {};
  const devInfoByProperty = {};
  const layoutMapsByProperty = {};

  images.forEach(img => {
    if (!imagesByProperty[img.propertyId]) imagesByProperty[img.propertyId] = [];
    imagesByProperty[img.propertyId].push(img);
  });

  amenities.forEach(am => {
    if (!amenitiesByProperty[am.propertyId]) amenitiesByProperty[am.propertyId] = [];
    const { propertyId, ...amenityData } = am;
    amenitiesByProperty[propertyId].push(amenityData);
  });

  nearbyFacilities.forEach(nf => {
    if (!facilitiesByProperty[nf.propertyId]) facilitiesByProperty[nf.propertyId] = [];
    facilitiesByProperty[nf.propertyId].push(nf);
  });

  floorPlans.forEach(fp => {
    if (!floorPlansByProperty[fp.propertyId]) floorPlansByProperty[fp.propertyId] = [];
    floorPlansByProperty[fp.propertyId].push(fp);
  });

  developerInfos.forEach(di => {
    devInfoByProperty[di.propertyId] = di;
  });

  layoutMaps.forEach(lm => {
    if (!layoutMapsByProperty[lm.propertyId]) layoutMapsByProperty[lm.propertyId] = [];
    layoutMapsByProperty[lm.propertyId].push(lm);
  });

  // Attach associations
  propertyList.forEach(p => {
    p.images = imagesByProperty[p.id] || [];
    p.amenities = amenitiesByProperty[p.id] || [];
    p.nearbyFacilities = facilitiesByProperty[p.id] || [];
    p.floorPlans = floorPlansByProperty[p.id] || [];
    p.developerInfo = devInfoByProperty[p.id] || null;
    p.layoutMaps = layoutMapsByProperty[p.id] || [];
  });

  return isSingle ? propertyList[0] : propertyList;
}

module.exports = {
  attachPropertyAssociations
};
