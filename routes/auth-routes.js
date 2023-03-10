const express = require('express');
const authRouter = express.Router();
const passport = require('passport');

const userSchema = require('../models/user-model');

//Route for /auth/logout
authRouter.get('/logout', async (req, res) => {
  await req.logout(function(err) {
    if (err) { return next(err) }
  }) //is asynchronous
  res.redirect('/');
});

//Route for /auth/deleteUser
authRouter.get('/deleteUser', async (req, res) => {
  await userSchema.deleteOne(
    {
      googleId: req.user.googleId
    }
  )
  await req.logout(function(err) {
    if (err) { return next(err) }
  })
  res.redirect('/');
});

//Route for /auth/google
authRouter.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

//Route for /auth/google/redirect
//Used to access user data once they have logged in (use code on req to access)
authRouter.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  //res.send(req.user.username);
  res.redirect('/profile');
});

module.exports = authRouter;