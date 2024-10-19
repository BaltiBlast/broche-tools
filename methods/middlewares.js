const middlewares = {
  isUserAuthenticated: (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.redirect("/signin");
    }
  },

  setUserDataGlobal(req, res, next) {
    if (req.session.user) {
      res.locals.user = req.session.user;
    } else {
      res.locals.user = null;
    }
    next();
  },
};

module.exports = middlewares;
