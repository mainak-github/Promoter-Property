'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BrokerProfile extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate(models) {
      // ✅ Define the association here
      BrokerProfile.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }

  BrokerProfile.init({
    userId: DataTypes.INTEGER,
    mobileNumber: DataTypes.STRING,
    fullName: DataTypes.STRING,
    companyName: DataTypes.STRING,
    companyRegNo: DataTypes.STRING,
    gstId: DataTypes.STRING,
    brokerRegNo: DataTypes.STRING,
    agreementFile: DataTypes.STRING,
    address: DataTypes.TEXT,
    profilePhoto: DataTypes.STRING,
    memberId: DataTypes.STRING,
    approval_status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    created_by: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'BrokerProfile',
  });

  return BrokerProfile;
};
