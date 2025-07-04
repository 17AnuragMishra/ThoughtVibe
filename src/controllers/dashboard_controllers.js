/**
 *  custom modules
 **/
const User = require("../models/userModel");

const renderDashboard = async (req, res) => {
  try {
    // get logged username
    const { username } = req.session.user;
    // get logged user data
    const loggedUser = await User.findOne({ username })
      .select("totalVisits totalReactions blogPublished blog")
      .populate({
        path: "blogs",
        select: "title createdAt updatedAt reaction totalVisit",
        options: { sort: { cretedAt: "desc" } },
      });
     
      
    res.render("./pages/dashboard", {
      sessionUser: req.session.user,
      loggedUser,
    });
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

module.exports = { renderDashboard };
