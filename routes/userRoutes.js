const express = require("express");
const { registerUser, loginUser, currentUser } = require("../controllers/userController");
const router = express.Router();
router.post("/register", registerUser);
const validateToken = require("../middleware/validateTokenHandler");

router.post("/login", loginUser);

router.get("/current", validateToken, currentUser); // because of next() in validateToken it will do validate token then go to the next one, being currentuser

module.exports = router;
