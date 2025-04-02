'use strict';

module.exports = {
   up: (queryInterface, Sequelize) => {
    return (
      queryInterface.changeColumn('orderItems', 'order_id', {
        field: 'order_id',
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id'
        },
        onDelete: 'CASCADE'
      })
    );
  },

   down: (queryInterface, Sequelize) => {
     return (
       queryInterface.changeColumn('orderItems', 'order_id', {
         field: 'order_id',
         type: Sequelize.INTEGER,
         allowNull: false,
       })
     );
  }
};
