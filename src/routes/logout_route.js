
const express = require("express");
const router = express.Router();
/**
 * custom modules
 **/
const logoutController = require("../controllers/logout_controller");


// POST Route: Handle User Logout
router.post("/", logoutController);

module.exports = router;
