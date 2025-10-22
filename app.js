const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local");
const userModel = require("./models/user.js");
const userRoute = require("./routes/user.js")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

const sessionOption = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
}

app.use(session(sessionOption))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user
    next();
})


app.use("/listings", listingRouter)
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRoute)

//Error handling Middleware
app.use((err, req, res, next) => {
    let { statusCode, message } = err;
    res.render("error.ejs", { message })
})


//Page not found 
app.use((req, res, next) => {
    res.render("PageNotFound.ejs");

});

module.exports = app;