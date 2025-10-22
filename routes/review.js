const express=require("express");
const router =express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync")
const {reviewSchema } = require("../schems.js");
const ExpressError = require("../utils/ExpressError.js")
const reviewModel = require("../models/review.js")
const listingModel = require("../models/listing.models");



const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}

//Reviews
//Post route 
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing = await listingModel.findById(req.params.id);
    let newReview = new reviewModel(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New review created !")
    res.redirect(`/listings/${listing._id}`);
}));

//delete review

router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await listingModel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await reviewModel.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!")
    res.redirect(`/listings/${id}`)
}))

module.exports=router
