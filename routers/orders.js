const Order = require('../models/order');
const express = require('express');
const { OrderItem } = require('../models/orderItems');
const router = express.Router();

router.get('/', async (req, res) => {
    const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});
    if(!orderList) {
        res.status(500).json({
           success: false,
           message: error.message
        });
    }
    
    res.status(200).json({
        success: true,
        orderList
    });
});

router.get('/get/totalsales', async (req, res) => {
    const totalSales = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalSales : {
                    $sum : '$totalPrice'
                }
            }
        }
    ]);

    if(!totalSales) {
        return res.status(400).send('The order sales cannot be generated');
    }

    res.send({
        totalSales: totalSales.pop().totalSales
    });

});

router.get('/get/count', async (req, res) => {
    const orderCount = await Order.countDocuments((count) => count);

    if(!orderCount) {
        return res.status(500).json({
            success: false,
            message: 'Orders not found'
        });
    }

    res.status(200).json({
        success: true,
        orderCount
    });

});

router.get('/get/userorders/:userid', async (req, res) => {

    const userOrderList = await Order.find({
        user: req.params.userid
    }).populate({

        path: 'orderItems', populate: {
            path: 'product', populate: 'category'
        }

    }).sort({

        'dateOrderd': -1

    });

    if(!userOrderList) {
        res.status(500).json({
            success: false
        });
    }
    
    res.status(200).json({
        success: true,
        userOrderList
    });

});

router.get('/:id', async (req, res) => {

    const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({
        path: 'orderItems', populate: {
            path: 'product', populate: 'category'
        }
    })

    if(!order) {
        res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }

    res.status(200).json({
        success: true,
        order
    });

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

        const orderItemsResolved = await orderItemIds;

        const totalPrices = await Promise.all(orderItemsResolved.map(async orderItemIds => {
            const orderItem = await OrderItem.findById(orderItemIds).populate('product', 'price');
            const totalPrice = orderItem.product.price * orderItem.quantity;
            return totalPrice;
        }));

        //to get the total price of the order from the database instead of the front end
        const totalPrice = totalPrices.reduce((acc, val) => acc + val, 0);

        let order = new Order({
            orderItems: orderItemIds, 
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: totalPrice,
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

router.put('/:id', async (req, res) => {

    const order = await Order.findByIdAndUpdate(

        req.params.id,
        {
            status: req.body.status
        },
        {new: true}

    )

    if(!order) {
        res.status(500).json({
            success: false,
            message: 'Order not found'
        });
    }

    res.status(200).json({
        success: true,
        message: 'Order update success!',
        order
    });

});

router.delete('/:id', async (req, res) => {

    const order = await Order.findByIdAndDelete(req.params.id);

    if(!order) {
        res.status(500).json({
            success: false,
            message: 'Order not found/Internal server error'
        });
    }

    res.status(200).json({
        success: true,
        message: 'Order deleted successfully!'
    });

});

module.exports = router;