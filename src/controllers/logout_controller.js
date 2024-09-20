
const logoutController = async(req, res, next) => {
try {
    req.session.destroy()
    res.redirect("/")
} catch (error) {
   console.log("Logout Error: "+ error.message);
   throw error
    
}
};

module.exports = logoutController;
