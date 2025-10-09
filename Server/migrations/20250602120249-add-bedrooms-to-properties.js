'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Properties');

    if (!tableInfo.bedrooms) {
      await queryInterface.addColumn('Properties', 'bedrooms', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Properties');

    if (tableInfo.bedrooms) {
      await queryInterface.removeColumn('Properties', 'bedrooms');
    }
  }
};
