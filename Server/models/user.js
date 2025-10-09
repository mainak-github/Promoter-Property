'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // ✅ One-to-One with BrokerProfile
      User.hasOne(models.BrokerProfile, {
        foreignKey: 'userId',
        as: 'brokerProfile',
        onDelete: 'CASCADE'
      });

      // ✅ One-to-Many with Properties (for broker users)
      User.hasMany(models.Property, {
        foreignKey: 'brokerId',
        as: 'properties',
        onDelete: 'CASCADE'
      });
    }
  }

  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM('client', 'broker', 'admin'),
      allowNull: false,
      defaultValue: 'client'
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
