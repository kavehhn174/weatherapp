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
        name: String,
        key: String,
    }],
    activeCity: {
        name: String,
        key: String,
    },
})


userSchema.statics.login = async function(username, password) {
    const user = await this.findOne({ username });
    if (user) {
        if (user.password === password) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

const User = mongoose.model('user', userSchema)

module.exports = User;