require("dotenv").config({ path: './config/.env' });
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user');
require('./db/mongoose');
const User = require('./Models/User')

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


app.get("/" , requireAuth, async function (req,res) {
    if (req.cookies.jwt) {
        const token = req.cookies.jwt;
        const decoded = jwt.decode(token, process.env.JWT_SECRET)
        console.log(decoded);
        try {
                User.findById(decoded.id, function (err, docs) {
                const username = docs.username;
                res.render("home", {user: docs, loggedInName: username, activePage: "/"});
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
                res.render("myCities", {user: docs, loggedInName: username, activePage: "myCities"});
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