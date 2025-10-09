'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeveloperInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DeveloperInfo.belongsTo(models.Property, {
      foreignKey: 'propertyId',
      onDelete: 'CASCADE',
  });
    }
  }
  DeveloperInfo.init({
    propertyId: DataTypes.INTEGER,
    developerName: DataTypes.STRING,
    developerLogo: DataTypes.STRING,
    developerDescription: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'DeveloperInfo',
  });
  return DeveloperInfo;
};