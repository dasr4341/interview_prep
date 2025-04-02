'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users',{
    id: {
      type: Sequelize.INTEGER,
      field: 'id',
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      field: 'name',
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      field: 'email',
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      field: "createdAt",
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: "updatedAt",
      allowNull: false
    },
    deletedAt: {
      type: Sequelize.DATE,
      field: "deletedAt",
      allowNull: true
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('Users')
};