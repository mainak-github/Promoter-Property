'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FloorPlan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FloorPlan.belongsTo(models.Property, {
      foreignKey: 'propertyId',
      onDelete: 'CASCADE',
  });
    }
  }
  FloorPlan.init({
    propertyId: DataTypes.INTEGER,
    floorName: DataTypes.STRING,
    towerName: DataTypes.STRING,
    shortDescription: DataTypes.STRING,
    priceRange: DataTypes.STRING,
    photo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'FloorPlan',
  });
  return FloorPlan;
};