'use strict'

const express = require('express');
const router = express.Router();

/**
 * custom module
 */

const { renderLogin, postLogin } = require('../controllers/login_controller');

//Get route: Render the login
router.get('/', renderLogin);

//POST route: handles form submission for user login
router.post('/', postLogin);

module.exports = router;