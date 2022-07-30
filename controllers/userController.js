const User = require('../Models/User')
const {response} = require("express");
const jwt = require('jsonwebtoken');



const maxAge = 60 * 60 * 24 * 3;

const createToken = (id) =>{
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
}

module.exports.signUp_post = async (req,res) => {
    const {username, password} = req.body;
    try {
        const user = await User.create({username, password});
        console.log("User created");
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).redirect('/');
    }
    catch (err) {
        res.status(400).send(err);
    }

}

module.exports.logIn_post = async (req,res) => {
    const {username, password} = req.body;
    try {
        const user = await User.login(username,password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).redirect("/");
    }
    catch (err) {
        res.status(400).json(err);
    }

}

module.exports.cities_post = async (req,res) => {
    const { newCity } = req.body;
    try {
        const token = req.cookies.jwt;
        const decoded = jwt.decode(token, process.env.JWT_SECRET)
        User.findById(decoded.id, function (err, doc){
            doc.cityList.push(newCity);
            res.status(201).redirect("/myCities");
        })
    }
    catch (err) {
        res.status(400).json(err);
    }

}

