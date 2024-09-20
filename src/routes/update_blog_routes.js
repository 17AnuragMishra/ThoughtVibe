
const express = require("express");
const router = express.Router();
/**
 * custom modules
 **/
const {
  renderEditBlog,
  updateBlog,
} = require("../controllers/update_blog_controllers");



// * GET Route: Render the edit blog page
router.get("/:blogId/edit", renderEditBlog);

// * PUT Route: Update Blog
router.put("/:blogId/edit", updateBlog);



module.exports = router;
