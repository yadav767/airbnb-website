require("dotenv").config();
const app=require("./app");
const connectDB=require("./db/db");
connectDB();


app.listen(8080, ()=>{
    console.log("listening on port 8080");
})