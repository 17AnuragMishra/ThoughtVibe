'use strict';

/**
 * Node module
 */

require('dotenv').config();

const crypto = require('crypto');

/**
 * Custom module 
 */
const uploadToCloudinary = require('../config/cloudinary_config');
const Blog = require('../models/blog_model');
const User = require('../models/user_model');
const getReadingTime = require('../utils/get_reading_time_utils');

/**
 * @param {object} req
 * @param {object} res
 */
const renderCreateBlog = (req, res) => {
    res.render('./pages/create_blog', {
        sessionUser: req.session.user,
        route: req.originalUrl
    });
}

/**
 * @param {object} req
 * @param {object} res
 */

const postCreateBlog = async (req, res) => {
    try {
        // Retrieve data
        const { banner, title, content } = req.body;

        // Check if banner is a file
        const public_id = crypto.randomBytes(10).toString('hex');
        const bannerURL = await uploadToCloudinary(banner, public_id);

        // Find the user who is creating the blog
        const user = await User.findOne({ username: req.session.user.username })
        .select('_id blogs blogPublished');

        // Create the new blog
        const newBlog = await Blog.create({
            banner: {
                url: bannerURL,
                public_id
            },
            title,
            content,
            owner: user._id, // Correct reference to user ID
            readingTime: getReadingTime(content)
        });

        // Update user's blog details
        user.blogs.push(newBlog._id);
        user.blogPublished++; // Correct typo
        await user.save();

        // Respond with the created blog and updated user
        res.status(201).json({ newBlog, user });

        //redirect to the newly created blog page
        res.redirect(`blogs/${newBlog._id}`);

    } catch (error) {
        console.error('Error creating new blog:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports = {
    renderCreateBlog,
    postCreateBlog
}
