'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TermsAndConditions extends Model {
    static associate(models) {
      // No associations needed
    }
  }

  TermsAndConditions.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'TermsAndConditions',
  });

  return TermsAndConditions;
};
