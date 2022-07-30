const jwt = require('jsonwebtoken');

const requireAuth = (req,res, next) => {

    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, function(err, decodedToken) {
            if (err) {
                res.redirect("/login")
                console.log(err.message);
            }
            else {
                next();
            }
        });

    }
    else {
        res.redirect("/login")
    }
}

module.exports = { requireAuth };