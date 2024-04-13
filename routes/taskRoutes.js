const express = require("express");// mandatory imports
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router(); //important to call this constant router
router.use(validateToken);

const {getAllTasks, createTask, getTaskById, updateTaskById, deleteTaskById} = require("../controllers/tasksController");

router.route("/").get(getAllTasks).post(createTask);

router.route("/:id").put(updateTaskById).delete(deleteTaskById).get(getTaskById);

module.exports = router;
