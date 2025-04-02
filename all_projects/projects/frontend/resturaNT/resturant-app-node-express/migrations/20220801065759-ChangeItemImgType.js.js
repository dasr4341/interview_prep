'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('items', 'img', {
      type: Sequelize.STRING
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('items', 'img', {
      type: Sequelize.BLOB
    })
  }
};
