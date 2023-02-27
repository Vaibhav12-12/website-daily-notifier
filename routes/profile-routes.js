const express = require('express');
const profileRouter = express.Router();

const userSchema = require('../models/user-model');

const authCheck = (req, res, next) => {
  if(!req.user) {
    //check if user is not logged in, this is a middleware
    res.redirect('/auth/login');
  } else {
    //if logged in
    next(); //go to next piece of middleware (in the below profileRouter)
  }
};

//route for /profile
profileRouter.get('/', authCheck, (req, res) => {
  res.render('profile', { user: req.user });
});

//route for posting to /profile
profileRouter.post('/', async (req, res) => {
  await userSchema.findOneAndUpdate(
    {
      googleId: req.user.googleId
    },
    {
      $addToSet: {
        quotes: req.body.content
      }
    }
  )
  res.redirect('profile');
});

module.exports = profileRouter;