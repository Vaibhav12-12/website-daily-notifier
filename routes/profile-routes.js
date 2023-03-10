const express = require('express');
const profileRouter = express.Router();

const userSchema = require('../models/user-model');

const authCheck = (req, res, next) => {
  if(!req.user) {
    //check if user is not logged in, this is a middleware
    res.redirect('/');
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

//route for deleting /profile/delete
profileRouter.post('/delete', async (req, res) => {
  await userSchema.findOneAndUpdate(
    {
      googleId: req.user.googleId
    },
    {
      $pull: {
        quotes: req.body.delete
      }
    }
  )
  res.redirect('/profile');
});

//route for deleting /profile/archiveDelete
profileRouter.post('/archiveDelete', async (req, res) => {
  await userSchema.findOneAndUpdate(
    {
      googleId: req.user.googleId
    },
    {
      $pull: {
        archives: req.body.delete
      }
    }
  )
  res.redirect('/profile');
});

//route for archiving /profile/archive
profileRouter.post('/archive', async (req, res) => {
  await userSchema.findOneAndUpdate(
    {
      googleId: req.user.googleId
    },
    {
      $addToSet: {
        archives: req.body.archive
      },
      $pull: { 
        quotes: req.body.archive
      }
    },
    {
      multi: true
    }
  )
  res.redirect('/profile');
});

//route for archiving /profile/unarchive
profileRouter.post('/unarchive', async (req, res) => {
  await userSchema.findOneAndUpdate(
    {
      googleId: req.user.googleId
    },
    {
      $addToSet: {
        quotes: req.body.archive
      },
      $pull: { 
        archives: req.body.archive
      }
    },
    {
      multi: true
    }
  )
  res.redirect('/profile');
});

module.exports = profileRouter;