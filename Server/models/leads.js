'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Lead extends Model {
    static associate(models) {
      // ✅ Each Lead belongs to a Property
      Lead.belongsTo(models.Property, {
        foreignKey: 'propertyId',
        as: 'property',
        onDelete: 'CASCADE'
      });

      // If you want leads to be linked to a broker (optional)
      Lead.belongsTo(models.User, {
        foreignKey: 'brokerId',
        as: 'broker',
        onDelete: 'SET NULL'
      });
    }
  }

  Lead.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    brokerId: { // Optional, in case you link to a broker
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Lead',
    tableName: 'leads', // Explicit table name
    timestamps: true // createdAt / updatedAt
  });

  return Lead;
};
