const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    name: {
        type: String,
        required:[true, "Please enter the name of your task"],
    },
    description: {
        type: String,
        default: "No description",
    },
    category: {
        type: String,
        default: "No Category",
    },
    label: {
        type: String,
        default: "No label",
    },
    dueDate: {
        type: Date,
        default: "",
    },
    status: {
        type: String,
        default: "Not Started",
    },
    owner: {
        type: String,
        required: [true, "You need to be a user to create a task."]
    }
},
    {
        timestamps:true,
}
);
module.exports = mongoose.model("Task", taskSchema);