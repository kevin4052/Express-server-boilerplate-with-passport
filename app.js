require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const path = require('path');
const createError = require('http-errors');
// require all the packages you install
const cors = require('cors');

const app = express();

// Middleware Setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// require database configuration
require('./configs/db.config');

// require CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: [process.env.FRONTEND_POINT],
    credentials: true
  })
);

// require session
require('./configs/session.config')(app);

// require passport
require('./configs/passport/passport.config.js')(app);

// routes middleware
app.use('/api/', require('./routes/index.routes'));
app.use('/api/', require('./routes/author.routes'));
app.use('/api/', require('./routes/book.routes'));
app.use('/api/', require('./routes/authentication.routes'));

// Catch missing routes and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Catch all error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ type: 'error', error: { message: error.message } });
});

module.exports = app;
