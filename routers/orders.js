const Order = require('../models/order');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const orderList = Order.find();

    if(!orderList) {
        res.status(500).json({
            success: false
        });
    }
});

module.exports = router;