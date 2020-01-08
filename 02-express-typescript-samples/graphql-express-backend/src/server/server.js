import {
  ensureLoggedIn
} from 'connect-ensure-login';

// file imports
import schema from '../graphql';
import APIs from './APIs';
import {
  passport,
  router as AuthRouter
} from './auth';

// module imports
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const graphqlHTTP = require('express-graphql');
const flash = require('connect-flash');

require('./mongoose');
require('../common/Models');

dotenv.load();


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(morgan('dev'));

// Handle auth failure error messages
app.use((req, res, next) => {
  if (req && req.query && req.query.error) {
    req.flash('error', req.query.error);
  }
  if (req && req.query && req.query.error_description) {
    req.flash('error_description', req.query.error_description);
  }
  next();
});

// Check logged in
app.use((req, res, next) => {
  res.locals.loggedIn = false;
  if ((req.session.passport && typeof req.session.passport.user !== 'undefined') || process.env.NODE_ENV === 'LOCAL') {
    res.locals.loggedIn = true;
  }
  next();
});

/* GET home page. */
app.get('/', (req, res) => {
  res.render('index');
});

app.use('/auth', AuthRouter);
app.use('/api', APIs);

// GraphqQL server route
app.use('/graphql', ((process.env.NODE_ENV === 'PROD') ? ensureLoggedIn('/login') : (req, res, next) => {
  next();
}), graphqlHTTP(() => ({
  schema,
  pretty: true,
  graphiql: true,
  formatError: error => ({ // better errors for development. `stack` used in `gqErrors` middleware
    message: error.message,
    stack: process.env.NODE_ENV !== 'PROD' ? error.stack.split('\n') : null
  }),
})));

module.exports = app;
