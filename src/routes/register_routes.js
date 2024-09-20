
const express = require("express");
const router = express.Router();
/**
 * custom modules
 **/
const {
  renderRegister,
  userRegister,
} = require("../controllers/register_controllers");

// * GET Route: Render the registration form
router.get("/", renderRegister);

// * POST Rout: Register form submission for user register
router.post("/", userRegister);

module.exports = router;
