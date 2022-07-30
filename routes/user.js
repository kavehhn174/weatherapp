const express = require('express');
const User = require('../Models/User');
const userController = require('../controllers/userController')
const cookieParser = require('cookie-parser');

const router = new express.Router();
router.use(cookieParser());

router.post("/signup", function (req,res){
    userController.signUp_post(req,res);
})

router.post("/login", function (req,res){
    userController.logIn_post(req,res);
})


router.get("/login" , function (req,res) {
    res.render("login");
})


router.get("/signup" , function (req,res) {
    res.render("signup");
})

router.post("/myCities", function (req,res){
    userController.cities_post(req,res);
})



module.exports = router;