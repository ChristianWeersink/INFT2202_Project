const asyncHandler = require("express-async-handler");
// @desc Get all students
// @route GET /api/students
const Task = require("../models/tasksModel"); //mongoose student structure or something
const mongoose = require('mongoose');


// CREATE: Create a new task
const createTask = async (req, res) => {
    try {
        const { name, description, category, label, dueDate } = req.body;

        // Create a new task object based on the Task model
        const newTask = new Task({
            name,
            description,
            category,
            label,
            dueDate
        });

        // Save the new task to the database
        const savedTask = await newTask.save();

        // Send a success response with the saved task object
        res.status(201).json(savedTask);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: error.message });
    }
};

// READ: Get all tasks
const getAllTasks = async (req, res) => {
    try {
        // Retrieve all tasks from the database
        const tasks = await Task.find();

        // Send a success response with the tasks array
        res.status(200).json(tasks);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: error.message });
    }
};

// READ: Get a single task by ID
const getTaskById = async (req, res) => {
    try {
        // Retrieve the task by ID from the database
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
