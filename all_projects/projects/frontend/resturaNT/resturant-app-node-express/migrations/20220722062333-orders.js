'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('orders', {
      id: {
        field: 'id',
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        field: 'user_id',
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        field: 'status',
        type: Sequelize.ENUM,
        values: ['pending', 'confirmed', 'ready', 'delivered'],
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
  down: (queryInterface) => queryInterface.dropTable('Orders'),
};

