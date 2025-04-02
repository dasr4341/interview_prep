const productController = require('../controller/productController');
const express = require('express')
const router = express.Router()


router.post('/addProduct',productController.addProduct);
router.get('/getAllProduct', productController.getAllProduct ) ;
router.get('/getPublishedProduct',productController.getPublishedProduct);

router.get('/one/:id',productController.getOneProduct);
router.put('/update/:id',productController.updateProduct);
router.delete('/del/:id',productController.deleteProduct);

module.exports = router;