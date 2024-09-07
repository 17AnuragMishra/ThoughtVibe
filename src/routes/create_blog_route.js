'use strict'

const express = require('express');
const router = express.Router();
require('dotenv').config();

/**
 * custom module
 */

const { renderCreateBlog, postCreateBlog} = require('../controllers/create_blog_controller.js');


//GET Route: Render the blog
router.get('/', renderCreateBlog);


//POST Route: Render the blog
router.post('/', postCreateBlog);

module.exports = router;