const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const createError = require('http-errors');
require('dotenv').config()

const app = express();

// Passport Config
require('./config/passport')(passport);

// Config
const db = process.env.MONGO_URI || 'mongodb://localhost:27017/todoapp'
const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.log(err)
    process.exit(1)
  });

// set session store
const store = new MongoDBStore({
  uri: db,
  collection: 'sessions',
  clear_interval: 3600
});

// EJS
app.use(expressLayouts);

app.use(express.static('public'));
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    store: store
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Error' });
});

app.listen(port, host, console.log(`Server running on http://${host}:${port}`));
