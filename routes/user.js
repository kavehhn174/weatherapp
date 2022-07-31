const express = require('express');
const userController = require('../controllers/userController')
const cookieParser = require('cookie-parser');
const {requireAuth} = require("../middleware/userMiddleware");

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

router.get("/logout", function (req,res) {
    userController.logOut_get(req,res);
})

router.post("/activeCity", async function (req,res) {
    userController.activeCity_post(req,res);
})


module.exports = router;