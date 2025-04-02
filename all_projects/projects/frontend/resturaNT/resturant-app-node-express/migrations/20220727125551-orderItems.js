'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('orderItems', {
      id: {
        field: 'id',
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      order_id: {
        field: 'order_id',
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      item_id: {
        type: Sequelize.INTEGER,
        field: 'item_id',
        allowNull: false,
      },
      item_price: {
        field: 'item_price',
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      no_of_items: {
        field: 'no_of_items',
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        field: 'created_at',
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        field: 'updated_at',
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        field: 'deleted_at',
        type: Sequelize.DATE,
        allowNull: true,
      },
    }),
  down: (queryInterface) => queryInterface.dropTable('orderItems'),
};
