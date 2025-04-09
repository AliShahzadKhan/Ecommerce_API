const express = require('express');
const router = express.Router();
const Product = require('../models/product');


router.post(`/`, (req, res) => {
    const product = new Product({
        id: req.body.id,
        name: req.body.name,
        image: req.body.image,
        stock: req.body.stock
    });
    product.save().then((createdProduct)=>{
        res.status(200).json(createdProduct);
    }).catch((error)=>{
        res.status(500).json(error);
    });
});

router.get(`/`, async (req, res) => {
    const productList = await Product.find();
    res.send(productList);
});

module.exports = router;