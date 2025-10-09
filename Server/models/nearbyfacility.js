'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NearbyFacility extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NearbyFacility.belongsTo(models.Property, {
      foreignKey: 'propertyId',
      onDelete: 'CASCADE',
  });
    }
  }
  NearbyFacility.init({
    propertyId: DataTypes.INTEGER,
    facilityType: DataTypes.STRING,
    facilityName: DataTypes.STRING,
    distance: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'NearbyFacility',
  });
  return NearbyFacility;
};