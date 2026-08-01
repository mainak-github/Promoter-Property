'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    static associate(models) {
      // Belongs to a broker (user)
      Property.belongsTo(models.User, {
        foreignKey: 'brokerId',
        as: 'broker',
        onDelete: 'CASCADE'
      });

      // Property Images
      Property.hasMany(models.PropertyImage, {
        foreignKey: 'propertyId',
        as: 'images',
        onDelete: 'CASCADE'
      });

      // Amenities (Many-to-Many)
      Property.belongsToMany(models.Amenity, {
        through: models.PropertyAmenity,
        foreignKey: 'propertyId',
        otherKey: 'amenityId',
        as: 'amenities',
        onDelete: 'CASCADE'
      });

      // Nearby Facilities
      Property.hasMany(models.NearbyFacility, {
        foreignKey: 'propertyId',
        as: 'nearbyFacilities',
        onDelete: 'CASCADE'
      });

      // Floor Plans
      Property.hasMany(models.FloorPlan, {
        foreignKey: 'propertyId',
        as: 'floorPlans',
        onDelete: 'CASCADE'
      });

      // Developer Info (One-to-One)
      Property.hasOne(models.DeveloperInfo, {
        foreignKey: 'propertyId',
        as: 'developerInfo',
        onDelete: 'CASCADE'
      });

      // Layout Maps
      Property.hasMany(models.LayoutMap, {
        foreignKey: 'propertyId',
        as: 'layoutMaps',
        onDelete: 'CASCADE'
      });
    }
  }

  Property.init({
    brokerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    coverPhoto: DataTypes.STRING,
    title: DataTypes.STRING,
    shortDescription: DataTypes.STRING,
    longDescription: DataTypes.TEXT,
    priceRange: DataTypes.STRING,
    budgetType: {
      type: DataTypes.ENUM('Budgeted', 'Mid-Budget', 'Premium-Budget'),
      allowNull: false
    },
    city: DataTypes.STRING,
    suburb: DataTypes.STRING,
    district: DataTypes.STRING,
    state: DataTypes.STRING,
    pincode: DataTypes.STRING,
    address: DataTypes.STRING,
    road: DataTypes.STRING,
    country: DataTypes.STRING,
    continent: DataTypes.STRING,
    timezone: DataTypes.STRING,
    isoCode: DataTypes.STRING,
    latitude: DataTypes.DECIMAL(10, 7),
    longitude: DataTypes.DECIMAL(10, 7),
    googleMapLink: DataTypes.STRING,
    propertyType: {
      type: DataTypes.ENUM('Flat', 'Apartment', 'Independent House', 'Villa','Plots')
    },
    status: {
      type: DataTypes.ENUM('Launching Soon', 'Ready to Move In', 'Under Construction')
    },
    bedrooms: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bathrooms: DataTypes.INTEGER,
    furnishedStatus: {
      type: DataTypes.ENUM('Fully Furnished', 'Semi-Furnished', 'Unfurnished')
    },
    parkingAvailable: DataTypes.BOOLEAN,
    launchDate: DataTypes.DATE,
    completionDate: DataTypes.DATE,
    floorNumber: DataTypes.STRING,
    numberOfTowers: DataTypes.STRING,
    carpetArea: DataTypes.STRING,
    totalArea: DataTypes.STRING,
    facing: {
      type: DataTypes.ENUM('East Facing', 'West Facing', 'North Facing', 'South Facing')
    },
    approvalStatus: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },

    // ============ SEO FIELDS ============
    seoTitle: {
      type: DataTypes.STRING(60),
      allowNull: true,
      comment: 'SEO optimized title (50-60 chars recommended)'
    },
    metaDescription: {
      type: DataTypes.STRING(160),
      allowNull: true,
      comment: 'Meta description for search results (150-160 chars)'
    },
    metaKeywords: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Comma-separated keywords for SEO'
    },
    ogTitle: {
      type: DataTypes.STRING(60),
      allowNull: true,
      comment: 'Open Graph title for social media sharing'
    },
    ogType: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: 'website',
      comment: 'Open Graph type (website, article, product)'
    },
    ogDescription: {
      type: DataTypes.STRING(160),
      allowNull: true,
      comment: 'Open Graph description for social sharing'
    },
    twitterCard: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: 'summary_large_image',
      comment: 'Twitter card type (summary, summary_large_image)'
    },
    canonicalUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Canonical URL to prevent duplicate content'
    },
    focusKeyword: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Primary keyword for SEO ranking'
    },
    robotsIndex: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: 'index,follow',
      comment: 'Robots meta tag (index,follow / noindex,nofollow)'
    }
    // ============ END SEO FIELDS ============

  }, {
    sequelize,
    modelName: 'Property',
  });

  return Property;
};
