module.exports = {
  isLoggedIn: (req, res, next) => {

  console.log("isLoggedIn ");
    if (req.isAuthenticated()) {
      return next();
    }
    if (req.xhr)
      return res.status(401).json({ message: "user not logged in", status: "failure" }).end();
    return res.redirect('/login');
  },
  forwardAuthenticated: (req, res, next) => {
  console.log("forwardAuthenticated ");

    if (!req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/projects');
  }
};

/* seperate route for
    * signup
    * login
    * logout
 */
