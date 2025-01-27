/**
 *  node modules
 **/
const mongoose = require("mongoose");
const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const markdown = require("../config/markdown_it_config");

/**
 *  custom modules
 **/

const renderBlogDetail = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    // Handle case where provided blog id is not valid
    const isValidObjectId = mongoose.Types.ObjectId.isValid(blogId);

    if (!isValidObjectId) {
      return res.render("./pages/404");
    }
    // handle case where no blog found with provided blog id
    const blogExist = await Blog.exists({
      _id: new mongoose.Types.ObjectId(blogId),
    });

    if (!blogExist) {
      return res.render("./pages/404");
    }

    // Retrive blog detail and populate owner info
    const blog = await Blog.findById(blogId).populate({
      path: "owner",
      select: "name username profilePhoto",
    });

    // Retrive more blog from this user
    const ownerBlogs = await Blog.find({ owner: { _id: blog.owner._id } })
      .select("title reaction totalBookmark owner readingTime createdAt")
      .populate({
        path: "owner",
        select: "name username profilePhoto",
      })
      .where("_id")
      .nin(blogId)
      .sort({ createAt: "desc" })
      .limit(3);

      // Retrive session user reacted and reading list blog
      let user;
      if(req.session.user){
        user = await User.findOne({
          username: req.session.user.username,
        }).select("reactedBlogs readingList");
      }

    res.render("./pages/blogDetail", {
      sessionUser: req.session?.user,
      route: req.originalUrl,
      blog,
      user,
      ownerBlogs,
      markdown
    });
  } catch (error) {
    console.log("Error Rendering blog details: ", error.message);
    throw error;
  }
};
module.exports = renderBlogDetail;
