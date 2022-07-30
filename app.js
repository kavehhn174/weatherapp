require("dotenv").config({ path: './config/.env' });
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user');
require('./db/mongoose');
const User = require('./Models/User')
const https = require('https');

const app = express();
app.use(cookieParser())
app.use(express.json());
app.use(express.static("public"));
const { requireAuth } = require("./middleware/userMiddleware");
const jwt = require("jsonwebtoken");

const port = process.env.PORT;


app.use(bodyParser.urlencoded({
    extended: true
}));


app.set('view engine', 'ejs');

function getTodayWeather (key, callback) {
    const url = 'https://dataservice.accuweather.com/currentconditions/v1/' + key + '?apikey=' + process.env.WEATHER_APIKEY
    https.get (url, function (response){
        response.on("data", function (data){
            const todayWeather = JSON.parse(data)
            const temp = todayWeather[0].Temperature.Metric.Value;
            return callback(temp);
        })
    })
}

app.get("/" , requireAuth, async function (req,res) {

    if (req.cookies.jwt) {
        const token = req.cookies.jwt;
        const decoded = jwt.decode(token, process.env.JWT_SECRET)
        console.log(decoded);
        try  {
                User.findById(decoded.id, async function (err, docs) {
                const username = docs.username;
                if (docs.cityList.length > 0) {
                    await getTodayWeather(docs.cityList[0].key , function(temp) {
                        res.render("home", {
                            user: docs,
                            loggedInName: username,
                            temperature: temp
                        });
                    })

                } else {
                    res.render("home", {user: docs,loggedInName: username});
                }
            })
        } catch (err) {
            console.log(err);
        }

    }
})

app.get("/mycities" , requireAuth, async function (req,res) {
    if (req.cookies.jwt) {
        const token = req.cookies.jwt;
        const decoded = jwt.decode(token, process.env.JWT_SECRET)
        console.log(decoded);
        try {
            User.findById(decoded.id, function (err, docs) {
                const username = docs.username;
                const cityList = docs.cityList;
                res.render("myCities", {user: docs, loggedInName: username, cityList: cityList});
            })
        } catch (err) {
            console.log(err);
        }

    }
})

app.use(userRoutes);

app.listen(port, function () {
    console.log("Server running on port " + port)
})