/*
    Final project
    Christina Jackson and Christian Weersink
    INFT 2202-07
    Database Connection
*/
const mongoose = require("mongoose");
const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log(
            "Connected to Database",
            connect.connection.host,
            connect.connection.name
        );
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};
module.exports = connectDb;