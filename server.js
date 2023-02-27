if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth-routes');
const profileRouter = require('./routes/profile-routes');

const passport = require('passport');
const passportSetup = require('./passport-setup');

const session = require('express-session');

const bodyParser = require('body-parser');

//set view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//connect to mongodb
const mongoose = require('mongoose');
// const { session } = require('passport'); - from WDS video tutorial, ignore for now
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', error => console.log(error));
db.once('open', () => console.log('Connected to Mongoose'));

//use express session
//creating sess object to be used in app.use(session(sess))
let sess = {
  secret: process.env.secret, //secret from .env for encrypting user id
  resave: false, //for some 'touch' command
  saveUninitialized: true, //allows recurring visitors to be saved
  cookie: { maxAge: 24 * 60 * 60 * 1000 } //defining cookie lifespan (it's 24 hours here in milliseconds)
}
app.use(session(sess));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//body parser
app.use(bodyParser.urlencoded({ extended: true }));

//use routes, THE SECOND ROUTE HERE MUST BE USED AFTER EXPRESS SESSION OTHERWISE YOU GET THE EXPRESS MIDDLEWARE MISSING ERROR
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);

app.listen(process.env.PORT || 3000);