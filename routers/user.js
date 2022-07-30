const express = require('express');
const User = require('../Models/User');
const userController = require('../controllers/userController')

const router = new express.Router();

router.post("/signup", function (req,res){
    userController.signUp_post(req,res);
})

router.get("/signup" , function (req,res) {
    res.render("signup");
})

router.get("/" , function (req,res) {
    res.render("home");
})

module.exports = router;