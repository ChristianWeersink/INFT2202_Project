const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required:[true, "Please enter the user name"],
    },
    email: {
        type: String,
        required:[true, "Please enter email address"],
        unique:[true, "Email address is already used before"],
    },
    password: {
        type: String,
        required: [true, "Please enter the password"],
    },
},
    {
        timestamps:true,
}
);
module.exports = mongoose.model("User", userSchema);
