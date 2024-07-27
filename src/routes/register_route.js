
'use strict';

/**
 * node modules
 */

const router = require("express").Router();

/**
 * custom modules
 */

const { renderRegister } = require("../controllers/register_controller")

//GET route: Render the registration form
router.get('/', renderRegister);


//POST route: Handles from submission for user registration
router.post('/', renderRegister);

module.exports = router;