const User = require('../models/user');
const {response} = require("express");
const jwt = require('jsonwebtoken');
const https = require('https');
const {cities_post} = require("./userController");



const maxAge = 60 * 60 * 24 * 3;

const createToken = (id) =>{
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
}

const findCityKey = (cityName, callback) => {
    const url = 'https://dataservice.accuweather.com/locations/v1/cities/search?apikey='
    https.get(url + process.env.WEATHER_APIKEY +'&q=' + cityName, function (response) {
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const cityCode = weatherData[0];
            const cityKey = cityCode.Key;
            callback(cityKey);
        })
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
    let cityKey = '';
    const url = 'https://dataservice.accuweather.com/locations/v1/cities/search?apikey='
    await https.get(url + process.env.WEATHER_APIKEY +'&q=' + newCity, function (response) {
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const cityCode = weatherData[0];
            cityKey = cityCode.Key;
            console.log(cityKey);
            try {
                const token = req.cookies.jwt;
                const decoded = jwt.decode(token, process.env.JWT_SECRET)
                User.findById(decoded.id, async function (err, doc){
                    doc.cityList.push({name: newCity, key: cityKey});
                    await doc.save();
                    res.status(201).redirect("/myCities");
                })
            }
            catch (err) {
                res.status(400).json(err);
            }
        })
    });

}

module.exports.logOut_get = async (req,res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/login');
}

module.exports.activeCity_post = async (req,res) => {
    const { cityCheck } = req.body;
    const token = req.cookies.jwt;
    const decoded = jwt.decode(token, process.env.JWT_SECRET)
    User.findById(decoded.id, async function (err, doc){
            findCityKey(cityCheck, async function (key){
            doc.activeCity.name = cityCheck;
            doc.activeCity.key = key;
            await doc.save();
            res.status(201).redirect("/mycities");
        })

    })
}

