const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const ObjectID = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cityList: [{
        type: String
    }]
})


const User = mongoose.model('user', userSchema)

module.exports = User;