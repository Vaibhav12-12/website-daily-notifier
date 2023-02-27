const express = require('express');
const profileRouter = express.Router();

const authCheck = (req, res, next) => {
  if(!req.user) {
    //check if user is not logged in, this is a middleware
    res.redirect('/auth/login');
  } else {
    //if logged in
    next(); //go to next piece of middleware (in the below profileRouter)
  }
};

profileRouter.get('/', authCheck, (req, res) => {
  res.render('profile', { user: req.user });
});

module.exports = profileRouter;