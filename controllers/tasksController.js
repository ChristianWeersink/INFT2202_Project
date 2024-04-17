const asyncHandler = require("express-async-handler");
// @desc Get all students
// @route GET /api/students
const Task = require("../models/tasksModel"); //mongoose student structure or something
const User = require("../models/userModel")
const mongoose = require('mongoose');


// CREATE: Create a new task
const createTask = async (req, res) => {
    try {
        var { name, description, category, label, dueDate, owner, priority, status } = req.body;
        // Check for empty null values 
        if (!description) {
            description = "No Description";
        }
        if (!category) {
            category = "No Category";
        }
        if (!label) {
            label = "No label";
        }
        if(!dueDate){
            dueDate = '2024-12-24';
        }
        const newTask = new Task({ name, description, category, label, dueDate, owner, priority, status });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// READ: Get all tasks with pagination
const getAllTasks = async (req, res) => {
    try {
        // Retrieve the user ID from cookies
        const userCookie = JSON.parse(req.cookies.user);
        const userId = userCookie._id;

        // Pagination parameters
        const page = parseInt(req.query.page) || 1; // Default page is 1
        const pageSize = 5; // Number of tasks per page

        // Calculate skip value
        const skip = (page - 1) * pageSize;

        // Retrieve tasks belonging to the user with pagination
        const tasks = await Task.find({ owner: userId }).skip(skip).limit(pageSize);

        // Check if it's an AJAX request
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            // If it's an AJAX request, send JSON response
            console.log("its an ajax request");
            res.json({ tasks: tasks, currentPage: page });
        } else {
            // If it's a regular request, render the tasks page with the tasks array and pagination info
            console.log("regular request");
            res.render('tasks', { title: "Tasks", tasks: tasks, currentPage: page });
        }

    } catch (error) {
        // Handle errors
        res.render('sign-in', {message: "You need to be signed in to view this page."});
    }
};



// READ: Get a single task by ID
const getTaskById = async (req, res) => {
    try {
        // Retrieve the task by ID from the database
        console.log(req.params.id);
        const task = await Task.findById(req.params.id);


        // Check if task exists
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Send a success response with the task object
        res.status(200).json(task);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: error.message });
    }
};

// UPDATE: Update a task by ID
const updateTaskById = async (req, res) => {
    try {
        // Retrieve the task by ID from the database and update its fields
        if(!req.body.dueDate){
            req.body.dueDate = "No date";
        }
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Check if task exists
        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Send a success response with the updated task object
        res.status(200).json(updatedTask);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: error.message });
    }
};

// DELETE: Delete a task by ID
const deleteTaskById = async (req, res) => {
    try {
        const taskId = req.params.id;
        console.log(taskId);
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        await task.deleteOne(); // Use deleteOne method to remove the task
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTaskById,
    deleteTaskById
};
