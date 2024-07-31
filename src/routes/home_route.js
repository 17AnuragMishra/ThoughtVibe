'use strict'

const express = require('express');
const router = express.Router();

/**
 * custom module
 */

const renderHome = require('../controllers/home_controller');

//Get route: Render the home page
router.get('/', renderHome);

module.exports = router;