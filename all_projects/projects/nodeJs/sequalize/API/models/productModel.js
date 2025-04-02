module.exports = (sequelize,DataTypes)=>{

    const Product = sequelize.define("product", {
        title:{
            type: DataTypes.STRING,
            allowNull : false,
        },
        price:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        description:{
            type:DataTypes.TEXT,
            allowNull:false
        },
        published:{
            type:DataTypes.BOOLEAN
        }
    })
    return Product;

}