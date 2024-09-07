'use strict';


/**
 * custom modules
 */


const Blog = require('../models/blog_model');
const getPagination = require('../utils/get_pagination_utils');

/**
 * 
 * @param {object} req - 
 * @param {object} res - 
 */

const renderHome = async (req, res) => {

    //retrieve blog from the databases, selecting specified fields and populating 'owner' filed
    try{
        
        //total blogs created
        const totalBlogs = await Blog.countDocuments();

        //get the pagination object
        const Pagination = getPagination('/', req.params, 20, totalBlogs);
        
        console.log(Pagination);


        const latestBlogs = await Blog.find()
            .select('banner author createdAt readingTime title reaction totalBookmark')
            .populate({
                path: 'owner',
                select: 'name username profilePhoto'
            })
            .sort({ createdAt: 'desc' });

        
        res.render('./pages/home',{ 
            sessionUser: req.session.user,
            latestBlogs
        });
    }
    catch (error) {
        console.error('Error rendering home page: ', error.message);
        throw error;
    }
}

module.exports = renderHome;