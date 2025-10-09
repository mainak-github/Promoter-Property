'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the Properties table without the 'bedrooms' field
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
      googleMapLink: {
        type: Sequelize.STRING
      },
      propertyType: {
        type: Sequelize.ENUM('Flat', 'Apartment', 'Independent House', 'Villa')
      },
      status: {
        type: Sequelize.ENUM('Launching Soon', 'Ready to Move In', 'Under Construction')
      },
      // Removed the 'bedrooms' field from here
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
        type: Sequelize.STRING, // E.g., "1BHK", "2BHK"
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
