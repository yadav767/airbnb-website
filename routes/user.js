const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
})
router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new userModel({
            email, username
        });
        const registeredUser = await userModel.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "User was registered successfully !");
            res.redirect("/listings");
        })

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup")
    }


}))

router.get("/login", (req, res) => {
    res.render("users/login.ejs")
})
router.post("/login",saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res) => {
    req.flash("success", "Welcome back to wonderlust! ");
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
})
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "You are logged out now !");
        res.redirect("/listings")
    })
})


module.exports = router;