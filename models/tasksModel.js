/*
    Final project
    Christina Jackson and Christian Weersink
    INFT 2202-07
    Task structure
*/
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
        default: new Date("2024-04-15"),
    },
    status: {
        type: String,
        default: "Not Started",
    },
    owner: {
        type: String,
        required: [true, "You need to be a user to create a task."]
    },
    priority: {
        type: Number,
        default: 0,
        validate: {
            validator: function(value) {
                return value >= 0 && value <= 3;
            },
            message: "Priority must be a number between 0 and 3."
        }
    }
},
    {
        timestamps:true,
}
);
module.exports = mongoose.model("Task", taskSchema);