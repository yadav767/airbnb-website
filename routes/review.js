const express=require("express");
const router =express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync")
const reviewModel = require("../models/review.js")
const listingModel = require("../models/listing.models");
const {validateReview, isLoggedIn, isOwner, isReviewAuthor}=require("../middleware.js");
const reviewController = require("../controllers/review.js");




//Reviews
//Post route 
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//delete review

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview))

module.exports=router
