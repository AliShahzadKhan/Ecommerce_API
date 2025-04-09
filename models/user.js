const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    image: String,
    stock: {
        type: Number,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
