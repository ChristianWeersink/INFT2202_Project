const mongoose = require("mongoose"); // I guess this file is like a student class in java and we need to use to do database stuff with
const studentSchema = mongoose.Schema({
    user_id: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Student",
    },
    name: {
        type: String,
        required: [true, "Please add the student name"],
    },
    email: {
        type: String,
        required: [true, "Please add the student email"],
    },
    phone: {
        type: String,
        required: [true, "Please add the student phone"],
    },
},
    {
        timestamps: true, //puts a timestamp for when things were inserted or updated
    });
module.exports = mongoose.model("Student", studentSchema);