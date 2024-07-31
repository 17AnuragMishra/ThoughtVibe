'use strict'

/**
 * NOde Module
 * 
 */

const bcrypt = require('bcrypt');

/**
 * custom Module
 */

const User = require('../models/user_model');

/**
 * 
 * @param {Obejct} req - the request object 
 * @param {object} res - the response object.
 * @returns {Promise<void>} A promise respresenting the asynchronous operation 
 */


const renderLogin = (req, res) => {
    const { userAuthenticated } = req.session.user || {};

    if(userAuthenticated){
        return res.redirect('/');
    }

    res.render('./pages/login');
}

const postLogin = async (req, res) => {
    try {
        //extract email and password
        const { email, password } = req.body;

        //find user in the databases by email
        const currentUser = await User.findOne({email});

        //no user found cases
        if (!currentUser){
            return res.status(400).json({message: 'No user found'});
        }

        const passwordIsValid = await bcrypt.compare(password, currentUser.password);

        //case where password is incorrect

        if (!passwordIsValid) {
            return res.status(400).json({message: 'Invalid Password, Please enter the correct password!'});
        }

        //set authorised user season to true and redirect to home page
        req.session.user = {
            userAuthenticated: true,
            name: currentUser.name,
            username: currentUser.username,
            profilePhotoUrl: currentUser.profilePhoto?.url
        }

        return res.redirect('/');

    }
    catch (error) {
        console.log('postLogin: ', error.message);
        throw error;
    }
}

module.exports = {
    renderLogin,
    postLogin
}