const User = require('../models/user');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();

router.post('/', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: hashedPassword,
            street: req.body.street,
            apartment: req.body.apartment,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin
        });

        user = await user.save();

        res.status(201).json({
            success: true,
            message: 'User created successfully!',
            user: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
    });
    if(!user) {
        return res.status(400).send('User not found!');
    }
    const isMatch = await bcrypt.compare(req.body.password, user.passwordHash);
    if(!isMatch) {
        return res.status(400).send('Incorrect password!');
    }
    const token = jwt.sign(
        {
            userId: user.id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1d'
        }
    )
    res.status(200).send({
        user: user.email,
        token: token
    });
});

router.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: hashedPassword,
            street: req.body.street,
            apartment: req.body.apartment,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin
        });

        user = await user.save();

        res.status(201).json({
            success: true,
            message: 'User created successfully!',
            user: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get('/', async (req, res) => {
    const userList = await User.find().select('-passwordHash');
    if(!userList) {
        return res.status(404).json({
            success: false,
            message: 'No users found/Internal server error'
        });
    }

    res.status(200).send(userList);

});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if(!user) {
        res.status(404).json({
            success: false,
            message: 'User does not exist/Internal server error!'
        });
    }
    res.status(200).send(user);
});

module.exports = router;