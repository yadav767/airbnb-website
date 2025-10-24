const userModel = require("../models/user")

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs")
}

module.exports.signup = async (req, res) => {
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


}
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs")
}
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to wonderlust! ");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "You are logged out now !");
        res.redirect("/listings")
    })
}
