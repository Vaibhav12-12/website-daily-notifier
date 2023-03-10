if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('./models/user-model');

//the serialize code runs after the user has logged in (after the GoogleStrategy callback has ran)
//serialize user aka store stuff in cookies so user doesn't need to log in everytime, done is using null instead of passing any errors right now
passport.serializeUser((user, done) => {
  //pass the user's mongodb auto id info into cookie
  //this will also encrypt the id because we have used app.use(cookieSession) key
  done(null, user.id); //using the user's mongodb auto id instead of google, user came from the done method implemented below
});

//deserialize user
passport.deserializeUser((id, done) => {
  //get the user's mongodb auto id from cookie
  User.findById(id).then((user) => {
    done(null, user); // from this you can check if the user is logged in
  });
});

passport.use(
  new GoogleStrategy({
    //options for google strategy
    callbackURL: '/auth/google/redirect',
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret
  }, (accessToken, refreshToken, profile, done) => {
    //check if user already exists
    console.log(profile);
    User.findOne({googleId: profile.id}).then((currentUser) => {
      if(currentUser) {
        //already have the user
        console.log('Already have user --> ' + currentUser);
        done(null, currentUser); //send user for cookie storage
      } else {
        //create new user if they don't exist
        new User({
          username: profile.displayName,
          googleId: profile.id,
          email: profile.emails[0].value
        }).save().then((newUser) => {
          console.log('New user created --> ' + newUser);
          done(null, newUser); //send user for cookie storage
        })
      }
    })
  })
)