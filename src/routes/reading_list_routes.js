
const express = require("express");
const router = express.Router();
/**
 * custom modules
**/
const { renderReadingList } = require("../controllers/reading_list_controller");

// GET Route: Render Reading List
router.get(["/", "/page/:pageNumber"], renderReadingList);

module.exports = router;
