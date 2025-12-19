const connectDB = require('./config/db');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

// Import route files
const indexRouter = require('./routes/index');
const checkoutRouter = require('./routes/checkout');
const crudRouter = require('./routes/crud');
const orderRouter = require('./routes/order'); 

// Create Express application instance
const app = express();

connectDB();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', 'layout'); // Default layout file
app.set('layout extractScripts', true); // Extract page-specific scripts
app.set('layout extractStyles', true); // Extract page-specific styles

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

//Route Mounting
app.use('/', indexRouter);
app.use('/checkout', checkoutRouter);
app.use('/crud', crudRouter);
app.use('/order', orderRouter); 

//Route Error Handler
app.use((req, res, next) => {
  res.status(404).render('error', {
    title: '404',
    metaDescription: 'Page not found',
    message: 'Page not found',
    error: { status: 404 }
  });
});

//General Error Handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render error page
  res.status(err.status || 500).render('error', {
  title: 'Error',
  metaDescription: 'Application error',
  message: err.message,
  error: req.app.get('env') === 'development' ? err : {}
});

  res.render('error', {
  title: 'Error'
});

});

module.exports = app;