const db = require('../models/index');

const Product  = db.products;

const addProduct = async (req,res) => {
    let info = {
        title:req.body.title,
        price:req.body.price,
        description:req.body.description,
        published:req.body.published ? req.body.published : false
    }
    const product = await Product.create(info);
    res.status(200).json(product);
    console.log(product);
}
const getAllProduct = async (req,res) => {
   
    const product = await Product.findAll({
        attributes:[
            'title',
            'price'
        ]
    });
    res.status(200).json(product);
    console.log(product);
}
const getOneProduct = async (req,res) => {
   const ID = req.params.id
    const product = await Product.findOne({
        where :{
            id : ID
        }
    });
    res.status(200).json(product);
}
 const updateProduct = async (req,res) => {
    const ID = req.params.id;
     const product = await Product.update(req.body,{
         where :{
             id : ID
         }
     });
     res.status(200).json(product);
 }
 const deleteProduct = async (req,res) => {
    const ID = req.params.id;
     await Product.destroy({
         where :{
             id : ID
         }
     });
     res.status(200).json('product deleted successfully');
 }

 const getPublishedProduct = async (req,res) => {
    const product = await Product.findAll({where : {published : true}})
    res.sendStatus(200).json(product);
 }

 module.exports = {
    addProduct,
    getAllProduct,
    getOneProduct,
    getPublishedProduct,
    updateProduct,
    deleteProduct
 }