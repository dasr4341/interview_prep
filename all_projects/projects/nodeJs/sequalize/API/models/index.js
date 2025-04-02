const dbConfig = require('../config/dbConfig')
const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host : dbConfig.HOST,
        dialect : dbConfig.DIALECT
    }
)

sequelize
.authenticate()
.then(()=>{
    console.log('connected')
}).catch((err)=>{
    console.log('err -> ',err);
})

const db ={}

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.products = require('../models/productModel')(sequelize,DataTypes);
db.reviews = require('../models/reviewModel')(sequelize,DataTypes);

db.sequelize.sync().then(()=>{
    console.log('yea re sync done !');
})

 module.exports = db;
