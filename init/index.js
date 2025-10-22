const mongoose = require("mongoose");
const initData = require("./data.js");
const listingModels = require("../models/listing.models.js");

const MONGODB_URL = "mongodb+srv://ayushDatabase:k7wWejneG1mvtq05@cluster0.ykrbyfe.mongodb.net/major-project";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGODB_URL);
}

async function initDB() {
    try {
        await listingModels.deleteMany({});
        initData.data = initData.data.map((object) => ({ ...object, owner: "68f8ff598519f949d3212eff" }))
        await listingModels.insertMany(initData.data);
        console.log("Database seeded successfully ✅");
    } catch (err) {
        console.error("Error seeding DB ❌", err.message);
        console.log(err.errors);
    }
}

initDB();