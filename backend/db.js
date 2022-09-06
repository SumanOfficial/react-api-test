const mongoose = require("mongoose");
const { URI } = require("./config");

// connect to mongoose
const connMongoose = () => {
    mongoose.connect(URI, () => {
        console.log("mongoose conected successfully");
    });
};

module.exports = connMongoose;
