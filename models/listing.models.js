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
        url:String,
        filename:String,
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