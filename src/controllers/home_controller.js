'use strict';

/**
 * 
 * @param {object} req - 
 * @param {object} res - 
 */

const renderHome = async (req, res) => {
    try{
        res.render('./pages/home',{ 
            sessionUser: req.session.user
        });
    }
    catch (error) {
        console.error('Error rendering home page: ', error.message);
        throw error;
    }
}

module.exports = renderHome;