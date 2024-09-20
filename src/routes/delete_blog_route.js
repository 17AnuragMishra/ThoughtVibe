const express = require("express");
const { deleteBlog } = require("../controllers/delete_blog_controller");
const router = express.Router();
/**
 * custom modules
 **/


// * DELETE Route: DELETE Blog
router.delete("/:blogId/delete", deleteBlog);

module.exports = router;
