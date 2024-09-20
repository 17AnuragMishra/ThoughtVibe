
const express = require("express");
const router = express.Router();
/**
 * custom modules
 **/

const { renderHome } = require("../controllers/home_controllers");

// * GET Route: Render The Home Page
router.get(["/", "/page/:pageNumber"], renderHome);


module.exports = router;
