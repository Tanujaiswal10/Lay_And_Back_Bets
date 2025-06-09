const mongoose = require('mongoose');

const connecToDB = async()=>{
    await mongoose.connect("mongodb://127.0.0.1:27017/betting")
    .then(()=>{console.log("Database connected")})
    .catch((err)=>{console.log(`Error while connecting Database`,err)})
}

module.exports = {connecToDB}