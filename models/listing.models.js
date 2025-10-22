const { ref } = require("joi");
const mongoose = require("mongoose");
const reviewModel = require("./review");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        default: "https://media.istockphoto.com/id/508184291/photo/office-buildings-in-financial-district-la-defense-paris-france.webp?a=1&b=1&s=612x612&w=0&k=20&c=cwRduaCCqZxdLDNT9BYKgHijkxB8zfJkvlKAc6SXg-w=",
        set: (v) => v == "" ? "https://media.istockphoto.com/id/508184291/photo/office-buildings-in-financial-district-la-defense-paris-france.webp?a=1&b=1&s=612x612&w=0&k=20&c=cwRduaCCqZxdLDNT9BYKgHijkxB8zfJkvlKAc6SXg-w=" : v,

    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "review"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
})

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){

        await reviewModel.deleteMany({ _id : { $in: listing.reviews } })
    }
})

const listingModel = mongoose.model("Listing", listingSchema);

module.exports = listingModel;