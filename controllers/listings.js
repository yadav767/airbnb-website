const listingModel = require("../models/listing.models");

module.exports.index = async (req, res) => {
    const allListings = await listingModel.find({});
    res.render("listings/index.ejs", { allListings });
}
module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs");
}
module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    const listing = await listingModel.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}
module.exports.createListing = async (req, res, next) => {

    const newListing = new listingModel(req.body.listing);
    newListing.owner = req.user._id;

    await newListing.save();
    req.flash("success", "New listing created!")
    res.redirect("/listings");
}
module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await listingModel.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing })

}
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await listingModel.findByIdAndUpdate(
        id, { ...req.body.listing }
    )
    req.flash("success", "Listing Updated !")
    res.redirect(`/listings/${id}`);
}
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await listingModel.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings")
}