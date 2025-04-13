const Order = require('../models/order');
const express = require('express');
const { OrderItem } = require('../models/orderItems');
const router = express.Router();

router.get('/', async (req, res) => {
    const orderList = Order.find();

    if(!orderList) {
        res.status(500).json({
            success: false,
            message: 'No orders active/found'
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const orderItemIds = await Promise.all(
            req.body.orderItems.map(async orderItem => {
                let newOrderItem = new OrderItem({
                    quantity: orderItem.quantity,
                    product: orderItem.product
                });
                newOrderItem = await newOrderItem.save();
                return newOrderItem._id;
            })
        );

        let order = new Order({
            orderItems: orderItemIds, 
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: req.body.totalPrice,
            user: req.body.user
        });

        order = await order.save();

        if (!order) {
            return res.status(500).json({
                success: false,
                message: 'Order could not be placed or Internal server error.'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Order saved successfully!',
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


module.exports = router;