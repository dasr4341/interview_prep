'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('items', {
    id: {
      type: Sequelize.INTEGER,
      field: 'id',
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    img: {
      type: Sequelize.BLOB,
      field: 'img',
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      field: 'name',
      allowNull: false,
      unique: true
    },
    price: {
      type: Sequelize.INTEGER,
      field: 'price',
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      field: 'description',
      allowNull: false
    },
    status: {
      type: Sequelize.BOOLEAN,
      field: 'status',
      defaultValue: true,
      allowNull: false,
    },
    subcategory_id: {
      type: Sequelize.INTEGER,
      field: 'subcategory_id',
      allowNull: false,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('items')
};

