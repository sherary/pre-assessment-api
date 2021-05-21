'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('preAssessmentBackendSubmissions', {
      
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      data: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('preAssessmentBackendSubmissions');
  }
};