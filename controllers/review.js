const listingModel = require("../models/listing.models");
const reviewModel = require("../models/review")

module.exports.createReview = async (req, res) => {
    let listing = await listingModel.findById(req.params.id);
    let newReview = new reviewModel(req.body.review);
    newReview.author = req.user._id
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New review created !")
    res.redirect(`/listings/${listing._id}`);
}
module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await listingModel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await reviewModel.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!")
    res.redirect(`/listings/${id}`)
}