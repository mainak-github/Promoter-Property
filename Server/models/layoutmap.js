'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LayoutMap extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LayoutMap.belongsTo(models.Property, {
      foreignKey: 'propertyId',
      onDelete: 'CASCADE',
  });
    }
  }
  LayoutMap.init({
    propertyId: DataTypes.INTEGER,
    mapType: DataTypes.STRING,
    imageUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'LayoutMap',
  });
  return LayoutMap;
};