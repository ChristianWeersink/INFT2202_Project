/*
    Final project
    Christina Jackson and Christian Weersink
    INFT 2202-07
    User structure
*/

const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter the user name"],
    },
    email: {
        type: String,
        required: [true, "Please enter email address"],
        unique: [true, "Email address is already used before"],
    },
    password: {
        type: String,
        required: [true, "Please enter the password"],
    },
}, {
    timestamps: true,
});

// Add comparePassword method to the user schema
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
