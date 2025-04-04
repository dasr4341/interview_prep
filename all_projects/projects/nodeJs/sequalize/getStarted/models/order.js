const Sequelize = require('sequelize');
const sequelize = require('../config');


const Order = sequelize.define('order',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey : true
    },
    total:{
        type: Sequelize.INTEGER,
        allowNull: false
    }

})

module.exports = Order;