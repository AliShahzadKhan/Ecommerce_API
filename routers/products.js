const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Category = require('../models/category');
const mongoose = require('mongoose');


router.post(`/`, async (req, res) => {
    try {
    const category = await Category.findById(req.body.category);
    if(!category) {
        return res.status(400).send(
            'Invalid category provided!'
        );
    }

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    });

    product = await product.save();

    if(!product) {
        return res.status(500).send(
            'The product cannot be save!'
        );
    }
    return res.status(200).send(
        'Product saved successfully!'
    );
} catch (error) {
    res.send(error)
}
});

router.put('/:id', async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid product id');
    }
    const category = await Category.findById(req.body.category);
    if(!category) {
        return res.status(400).send(
            'Invalid category provided!'
        );
    }

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
        },
        {new: true}
    );
    if(!product) {
        return res.status(500).send('Product cannot be updated!')
    }
     res.status(200).send(product);
});

router.get(`/`, async (req, res) => {
    const productList = await Product.find().select('name image -_id');
    res.send(productList);
});

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(!product) {
        return res.status(404).json({
            success: false,
            message: `Product with id: ${product} not found!`
        });
    }
    return res.status(200).send(product);
});

router.delete('/:id', async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if(!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found!'
        });
    } else {
        return res.status(200).json({
            success: true,
            message: 'Product deleted successfully!'
        });
    }
});


module.exports = router;