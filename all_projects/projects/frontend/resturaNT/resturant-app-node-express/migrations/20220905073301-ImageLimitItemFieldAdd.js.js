'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('items', 'item_limit', {
      type: Sequelize.INTEGER,
      field: 'item_limit',
      allowNull: false
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('items', 'item_limit')
  }
};
