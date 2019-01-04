const express = require('express')
const expressLayouts =  require('express-ejs-layouts')
const mongoose = require('mongoose')
const passport = require('passport');
const flash = require('connect-flash')
const session =  require('express-session')
const app = express()

//Passport Config
require('./config/passport')(passport);

//DB Config
const db = require('./config/keys').MongoURI;

//Conenct to Mongo
mongoose.connect('mongodb://127.0.0.1:27017/Mong',{ useNewUrlParser: true})
    .then(() => console.log('MongDB Connected...'))
    .catch(err => console.log(err));

//ejs
app.use(expressLayouts)
app.set('view engine','ejs')

//bodyparser
app.use(express.urlencoded( { extended: false } ));

//Express session
app.use(session({
   secret: 'secret',
   resave: true,
   saveUninitialized: true
}))

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Content flash
app.use(flash());

//Global Vars
app.use((req,res,next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  next()
})

//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/user'));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server started on port ${port}`)
})
