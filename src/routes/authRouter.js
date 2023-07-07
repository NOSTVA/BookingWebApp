const express = require("express");
const router = express.Router();
const { isAuthenticated, isNotAuthenticated } = require("../controllers/auth");

const userController = require("../controllers/user");

router.post("/logout", isAuthenticated, userController.logout_user);
router.post("/register", isNotAuthenticated, userController.register_user);
router.post("/login", isNotAuthenticated, userController.login_user);

module.exports = router;
