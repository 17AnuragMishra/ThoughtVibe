"use strict";

const userAuth = (req, res, next) => {
  const { userAuthenticated } = req.session?.user || {};
  
//   Handle case where user is authenticated
  if (userAuthenticated) return next();
//   Redirect to login page if user is not authenticated
res.redirect("/login")
};
module.exports = userAuth;
