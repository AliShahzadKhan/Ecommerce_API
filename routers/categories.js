const Category = require('../models/category');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const categoryList = Category.find();

    if(!categoryList) {
        res.status(500).json({
            success: false
        });
    }
});

router.post('/', async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    });
    category = await category.save();
    if(!category){
        return res.status(404).send('Unable to create a category at this time.');
    }
    res.send(category);
});

router.delete('/:id', async (req, res) => {
    try {
        const deleteItem = await Category.findByIdAndDelete(req.params.id);
        if(deleteItem) {
            return res.status(200).json({
                success: true,
                message: 'Category deleted successfully!'
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Category not found!'
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error
        });
    }
});

router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);
    if(!category) {
        res.status(404).json({
            success: false,
            message: 'Category does not exist'
        });
    }
    res.status(200).send(category);
});

router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        },

        {new: true}
        
    );

    if(!category) {
        return res.status(404).json({
            success: false,
            message: 'Category does not exist!'
        });
    }
    return res.status(200).send(category);
});

module.exports = router;