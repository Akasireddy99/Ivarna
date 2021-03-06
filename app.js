var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var enforce = require('express-sslify');
var models = require('./utilities/registrationModels');

var indexRouter = require('./routes/index');
var payRouter = require('./routes/pay');
var registrationsRouter = require('./routes/registrations');
var checkRouter = require('./routes/check');

var app = express();

// Enforce SSL 
app.use(enforce.HTTPS({ trustProtoHeader: true }));

// DB connection
mongoose.connect("mongodb://pass_handler:Ivarna2019@ds149215-a0.mlab.com:49215,ds149215-a1.mlab.com:49215/heroku_zn55qrq5?replicaSet=rs-ds149215", { useNewUrlParser: true }).then(function (value) {
	console.log("Connected to mLab successfully");
}).catch(function (reason) {
	console.log(reason);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/pay', payRouter);
app.use('/registrations', registrationsRouter);
app.use('/check', checkRouter);

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
	res.render('error');
});

module.exports = app;
