
const express = require("express");
const router = express.Router();
/**
 * custom modules
**/
const renderProfile = require("../controllers/profile_controllers");


// * GET Route: Render Create Blog Page
router.get(["/:username", "/:username/page/:pageNumber"], renderProfile);


module.exports = router;
