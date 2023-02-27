const express = require('express');
const authRouter = express.Router();
const passport = require('passport');

//Route for /auth/login
authRouter.get('/login', (req, res) => {
  res.render('login');
})

//Route for /auth/logout
authRouter.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  }); //is asynchronous
});

//Route for /auth/google
authRouter.get('/google', passport.authenticate('google', {
  scope: ['profile']
}));

//Route for /auth/google/redirect
//Used to access user data once they have logged in (use code on req to access)
authRouter.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  //res.send(req.user.username);
  res.redirect('/profile');
});

module.exports = authRouter;