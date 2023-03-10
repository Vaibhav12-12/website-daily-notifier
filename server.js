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

const cookieSession = require('cookie-session');

const bodyParser = require('body-parser');

const nodeMailer = require('nodemailer');

var cron = require('node-cron');

const user = require('./models/user-model');

//set view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

//connect to mongodb
const mongoose = require('mongoose');
// const { session } = require('passport'); - from WDS video tutorial, ignore for now
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', error => console.log(error));
db.once('open', () => console.log('Connected to Mongoose'));

//use cookie session
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000, //cookie lifespan in milliseconds
  keys: [process.env.secret]
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//body parser
app.use(bodyParser.urlencoded({ extended: true }));

//use routes, THE SECOND ROUTE HERE MUST BE USED AFTER EXPRESS SESSION OTHERWISE YOU GET THE EXPRESS MIDDLEWARE MISSING ERROR
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);

//setup nodemailer transporter
const transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'b.vaibhav.0012@gmail.com',
    pass: process.env.nodeMailerPass
  }
});

//node-cron setup
cron.schedule('0 10 * * *', () => {
  //Getting users from collection named user which was imported from user-model
  user.find({} , (err, users) => {
    if(err) { console.log(err) };
    users.map(users => {
      //setup rest of nodemailer
      const mailOptions = {
        from: 'b.vaibhav.0012@gmail.com',
        to: users.email,
        subject: 'Daily Notifier',
        html: `<p>Daily Notifier wishes you a good morning ${users.username}! <br><br> ${users.quotes[Math.floor(Math.random() * users.quotes.length)] || 'You have no texts in the database!'}. <br><br> You can stop these daily mails by removing your profile on the website.</p>`
      };

      transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        })
    });
});

app.listen(process.env.PORT || 3000);