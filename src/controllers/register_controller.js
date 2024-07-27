

'use strict';
/**
 * node module
 */

const bcrypt = require('bcrypt'); 



/**
 *  custom modules
 */

const User = require('../models/user_model');
const generateUsername = require('../utils/generate_username_utils');

/**
 * 
 * @param {object} req 
 * @param {object} res 
 */
const renderRegister = (req, res) => {
    res.render('./pages/register');
}

/**
 * 
 * @param {object} res - the response object 
 * @param {object} req  - Thre request object
 */

const postRegister = async (req, res) => {
    try {
        //user data handle

        const {name, email, password }  = req.body;

        //create username
        const username = generateUsername(name);
        
        //password hash
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user with provided data
        await User.create({ name, email, password: hashedPassword, username });

        //redirect user to login page upon success
        res.redirect('/login');

    
    }catch (error) {

    }
}

module.exports = {
    renderRegister
}