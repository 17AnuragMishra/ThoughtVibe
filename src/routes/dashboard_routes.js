
/**
 * node modules
 **/
const express = require("express");
const router = express.Router();
/**
 * custom modules
**/
const { renderDashboard } = require("../controllers/dashboard_controllers");


// * GET Route: Render Dashboard Page
router.get("/", renderDashboard);


module.exports = router;
