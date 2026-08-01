'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the Properties table with all fields including SEO
    await queryInterface.createTable('Properties', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      brokerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      coverPhoto: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      shortDescription: {
        type: Sequelize.STRING
      },
      longDescription: {
        type: Sequelize.TEXT
      },
      priceRange: {
        type: Sequelize.STRING
      },
      budgetType: {
        type: Sequelize.ENUM('Budgeted', 'Mid-Budget', 'Premium-Budget'),
        allowNull: false
      },
      city: {
        type: Sequelize.STRING
      },
      subLocation: {
        type: Sequelize.STRING
      },
      district: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      pincode: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      road: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      continent: {
        type: Sequelize.STRING
      },
      timezone: {
        type: Sequelize.STRING
      },
      isoCode: {
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 7)
      },
      longitude: {
        type: Sequelize.DECIMAL(10, 7)
      },
      googleMapLink: {
        type: Sequelize.STRING
      },
      propertyType: {
        type: Sequelize.ENUM('Flat', 'Apartment', 'Independent House', 'Villa', 'Plots')
      },
      status: {
        type: Sequelize.ENUM('Launching Soon', 'Ready to Move In', 'Under Construction')
      },
      bathrooms: {
        type: Sequelize.INTEGER
      },
      furnishedStatus: {
        type: Sequelize.ENUM('Fully Furnished', 'Semi-Furnished', 'Unfurnished')
      },
      parkingAvailable: {
        type: Sequelize.BOOLEAN
      },
      launchDate: {
        type: Sequelize.DATE
      },
      completionDate: {
        type: Sequelize.DATE
      },
      floorNumber: {
        type: Sequelize.STRING
      },
      numberOfTowers: {
        type: Sequelize.STRING
      },
      carpetArea: {
        type: Sequelize.STRING
      },
      totalArea: {
        type: Sequelize.STRING
      },
      facing: {
        type: Sequelize.ENUM('East Facing', 'West Facing', 'North Facing', 'South Facing')
      },
      approvalStatus: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
      },

      // ============ SEO FIELDS ============
      seoTitle: {
        type: Sequelize.STRING(60),
        allowNull: true,
        comment: 'SEO optimized title (50-60 chars recommended)'
      },
      metaDescription: {
        type: Sequelize.STRING(160),
        allowNull: true,
        comment: 'Meta description for search results (150-160 chars)'
      },
      metaKeywords: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Comma-separated keywords for SEO'
      },
      ogTitle: {
        type: Sequelize.STRING(60),
        allowNull: true,
        comment: 'Open Graph title for social media sharing'
      },
      ogType: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: 'website',
        comment: 'Open Graph type (website, article, product)'
      },
      ogDescription: {
        type: Sequelize.STRING(160),
        allowNull: true,
        comment: 'Open Graph description for social sharing'
      },
      twitterCard: {
        type: Sequelize.STRING(30),
        allowNull: true,
        defaultValue: 'summary_large_image',
        comment: 'Twitter card type'
      },
      canonicalUrl: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Canonical URL to prevent duplicate content'
      },
      focusKeyword: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Primary keyword for SEO ranking'
      },
      robotsIndex: {
        type: Sequelize.STRING(30),
        allowNull: true,
        defaultValue: 'index,follow',
        comment: 'Robots meta tag'
      },
      // ============ END SEO FIELDS ============

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create PropertyBedrooms table to handle bedroom types
    await queryInterface.createTable('PropertyBedrooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      propertyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Properties',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop the PropertyBedrooms table first to maintain referential integrity
    await queryInterface.dropTable('PropertyBedrooms');
    
    // Drop the Properties table
    await queryInterface.dropTable('Properties');
  }
};
