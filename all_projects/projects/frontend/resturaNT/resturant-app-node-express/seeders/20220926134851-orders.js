'use strict';
module.exports = {
 up :(queryInterface, Sequelize) => {
   return queryInterface.bulkInsert('orders', [
     {
       user_id: 2,
       status: 'pending',
       created_at: new Date(),
       updated_at: new Date(),
       deleted_at: null,
     },
   ]);
  },

 down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('orders', null, {}); 
  }
};
