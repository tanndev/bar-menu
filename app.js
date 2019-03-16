/*
 * Copyright (c) 2019 James Tanner
 */

const createError = require('http-errors');
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');

// Start the Express app.
const app = express();

// Set up view engine and static assets.
app.set('view engine', 'pug');
app.set('views', 'client/views');
app.use(favicon('client/static/favicon.ico'));
app.use(express.static('client/static'));

// Set up logger and data parsers.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Serve the homepage.
app.get('/', (req, res) => {
    res.render('home');
});

// Catch all remaining requests and generate a 404.
app.use(function (req, res, next) {
    next(createError(404));
});

// Handle errors
app.use((error, req, res, next) => {
    // TODO Implement a custom error page.

   // Send to the default handler for now.
   next(error);
});

// Listen.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
