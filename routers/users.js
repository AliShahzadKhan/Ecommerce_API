const User = require('../models/user');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

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
    

module.exports = router;