const listingModel = require("./models/listing.models")
const { listingScema } = require("./schems.js");
const ExpressError = require("./utils/ExpressError.js"); 
const {reviewSchema } = require("./schems.js");
const reviewModel=require("./models/review.js")

module.exports.isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing !");
        return res.redirect("/login");
    }
    next()
}
module.exports.saveRedirectUrl = function (req, res, next) {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let Listing = await listingModel.findById(id);
    if (!Listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing !");
        return res.redirect(`/listings/${id}`);
    }
    next()
}


module.exports.validateListing = (req, res, next) => {
    const { error } = listingScema.validate(req.body)
    console.log(error);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id ,reviewId } = req.params;
    let review = await reviewModel.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review !");
        return res.redirect(`/listings/${id}`);
    }
    next()
}
