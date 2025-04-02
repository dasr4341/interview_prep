'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('roles', {
    id: {
      type: Sequelize.INTEGER,
      field: 'id',
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      field: 'name',
      allowNull: false
    }
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('roles')
};
