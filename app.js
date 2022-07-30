require("dotenv").config({ path: './config/.env' });
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.set('view engine', 'ejs');
const port = process.env.PORT;
const userRoutes = require('./Routers/user');
require('./db/mongoose');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json());
app.use(express.static("public"));
app.use(userRoutes);


app.listen(port, function () {
    console.log("Server running on port " + port)
})