const asyncHandler = require("express-async-handler");
// @desc Get all students
// @route GET /api/students
const Student = require("../models/studentModel"); //mongoose student structure or something
const mongoose = require('mongoose');


//const { get } = require("../routes/studentRoute");

//@access public
const getStudents = asyncHandler(async (req, res) => {
    const students = await Student.find({ user_id: req.user.id });
    res.status(200.).json(students);
});

const createStudent = asyncHandler(async (req, res) => {
    console.log("The request body is ", req.body);
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const student = await Student.create({
        name,
        email,
        phone,
        user_id: req.user.id,
    });
    res.status(201).json(student);
});


//@desc Update a studnets
//@route PUT /api/students/:id
//@access private
const updateStudent = asyncHandler(async (req, res) => {
    const studentId = req.params.id;
    const isValidId = mongoose.Types.ObjectId.isValid(studentId);
    if (!isValidId) {
        res.status(400);
        throw new Error("Id is not valid");
    }
    const student = await Student.findById(studentId);
    if (!student) {
        res.status(404);
        throw new Error("Contact Not Found");
    }
    if (student.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User do not have permission to update other user's students!");
    }
    const updatedStudent = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200.).json(updatedStudent);
});
//@desc Delete a student
//@route DELETE /api/students/:id
//@access private
const deleteStudent = asyncHandler(async (req, res) => {
    const studentId = req.params.id;
    const isValidId = mongoose.Types.ObjectId.isValid(studentId);
    if (!isValidId) {
        res.status(400);
        throw new Error("Id is not valid");
    }
    const student = await Student.findById(studentId);
    if (!student) {
        res.status(404);
        throw new Error("Student Not Found");
    }
    if (student.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User do not have permission to delete other user's students!");
    }
    await Student.deleteOne({ _id: req.params.id });
    res.status(200.).json(student);
});



// Get method with id param
const getStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);
    const studentId = req.params.id;
    const isValidId = mongoose.Types.ObjectId.isValid(studentId);
    if (!isValidId) {
        res.status(400);
        throw new Error("Id is not valid");
    }
    if (!student) {
        res.status(404);
        throw new Error("Contact Not Found");
    }
    res.status(200).json(student);
});


module.exports = { createStudent, getStudents, updateStudent, deleteStudent, getStudent };