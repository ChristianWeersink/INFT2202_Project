const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    name: {
        type: String,
        required:[true, "Please enter the name of your task"],
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        default: "No Category",
    },
    label: {
        type: String,
    },
    dueDate: {
        type: Date,
    },
    status: {
        type: String,
        default: "Not Started",
    }
},
    {
        timestamps:true,
}
);
module.exports = mongoose.model("Task", taskSchema);