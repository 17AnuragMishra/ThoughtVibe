
const express = require("express");
const router = express.Router();
/**
 * custom modules
 **/
const { renderSettings, updateBasicInfo, updatePassword, deleteAccount } = require("../controllers/settings_controllers");

// * GET Route: Render the settings page.
router.get("/", renderSettings);
// * PUT Route: Update user basic info.
router.put("/basic-info", updateBasicInfo);
// * PUT Route: Update user passowrd.
router.put("/password", updatePassword);
// * DELETE Route: Delete User Account.
router.delete("/account", deleteAccount);

module.exports = router;
