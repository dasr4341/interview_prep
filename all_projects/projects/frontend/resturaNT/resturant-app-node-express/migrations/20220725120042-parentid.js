'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('categories', {
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
      allowNull: false,
      unique: true
    },
    status: {
      type: Sequelize.BOOLEAN,
      field: 'status',
      defaultValue: true,
      allowNull: false,
    },
    parent_id: {
      type: Sequelize.INTEGER,
      field: 'parent_id',
      allowNull: true,
    },
    created_at: {
      type: Sequelize.DATE,
      field: 'created_at',
      allowNull: false
    },
    updated_at: {
      type: Sequelize.DATE,
      field: 'updated_at',
      allowNull: false
    },
    deleted_at: {
      type: Sequelize.DATE,
      field: 'deleted_at',
      allowNull: true
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('categories')
};

