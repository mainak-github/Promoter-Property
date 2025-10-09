'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BrokerProfiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      mobileNumber: {
        type: Sequelize.STRING
      },
      fullName: {
        type: Sequelize.STRING
      },
      companyName: {
        type: Sequelize.STRING
      },
      companyRegNo: {
        type: Sequelize.STRING
      },
      gstId: {
        type: Sequelize.STRING
      },
      brokerRegNo: {
        type: Sequelize.STRING
      },
      agreementFile: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.TEXT
      },
      profilePhoto: {
        type: Sequelize.STRING
      },
      memberId: {
        type: Sequelize.STRING
      },
      approval_status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
      created_by: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BrokerProfiles');
  }
};