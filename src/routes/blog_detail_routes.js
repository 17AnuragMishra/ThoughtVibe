const express = require("express");
const router = express.Router();
/**
 * custom modules
 **/
const renderBlogDetail = require("../controllers/blog_detail_controller.js");
const {
  updateReaction,
  removeReaction,
} = require("../controllers/reaction_controller.js");
const {
  updateReadingList,
  removeReadingList,
} = require("../controllers/reading_list_controller.js");
const { updateVisit } = require("../controllers/visit_controller.js");


// * GET Route: Render the blog details
router.get("/:blogId", renderBlogDetail);

// * PUT Route: Update blog reactions
router.put("/:blogId/reactions", updateReaction);

// * DELETE Route: Remove blog reactions
router.delete("/:blogId/reactions", removeReaction);

// * PUT Route: Update blog Reading List
router.put("/:blogId/readingList", updateReadingList);

// * DELETE Route: Remove from blog Reading List
router.delete("/:blogId/readingList", removeReadingList);

// * PUT Route: Update Blog Visit
router.put("/:blogId/visit", updateVisit);

module.exports = router;
