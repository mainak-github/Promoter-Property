'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PropertyAmenity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PropertyAmenity.init({
    propertyId: DataTypes.INTEGER,
    amenityId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PropertyAmenity',
  });
  return PropertyAmenity;
};