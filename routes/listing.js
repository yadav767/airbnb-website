const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync")

const listingModel = require("../models/listing.models");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");




//Index route

router.get("/", wrapAsync(async (req, res) => {
    const allListings = await listingModel.find({});
    res.render("listings/index.ejs", { allListings });
}));

//New Route
router.get("/new", isLoggedIn, (req, res) => {

    res.render("listings/new.ejs");
});

//Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await listingModel.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));

//Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {

    const newListing = new listingModel(req.body.listing);
    newListing.owner = req.user._id;

    await newListing.save();
    req.flash("success", "New listing created!")
    res.redirect("/listings");
}));

//Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await listingModel.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing })

}))

//Update Route

router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listingModel.findByIdAndUpdate(
        id, { ...req.body.listing }
    )
    req.flash("success", "Listing Updated !")
    res.redirect(`/listings/${id}`);
}))

//Delete Route

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await listingModel.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings")
}))

module.exports = router