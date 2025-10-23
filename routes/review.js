const express=require("express");
const router =express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync")
const reviewModel = require("../models/review.js")
const listingModel = require("../models/listing.models");
const {validateReview, isLoggedIn, isOwner, isReviewAuthor}=require("../middleware.js")




//Reviews
//Post route 
router.post("/",isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let listing = await listingModel.findById(req.params.id);
    let newReview = new reviewModel(req.body.review);
    newReview.author=req.user._id
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New review created !")
    res.redirect(`/listings/${listing._id}`);
}));

//delete review

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await listingModel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await reviewModel.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!")
    res.redirect(`/listings/${id}`)
}))

module.exports=router
