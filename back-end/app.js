// Loading Dependencies
var express = require('express');
var session = require('client-sessions');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var cors = require('cors');

// Middleware
var { authenticate } = require('./middleware/authentication');
const { uploadProfileImage } = require('./middleware/file.storage');
// Define routes here.
var index = require('./routes/index');
var userController = require('./routes/userController');
var profileController = require('./routes/profileController');
var surveyController = require('./routes/surveyController');


// Express App
var app = express();

// View Engine Setup
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// DEV Logging
app.use(logger('dev'));
// CORS Setup
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));
// Environment Setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// CLIENT-SESSIONS Setup
app.use(session({
    cookieName: 'session',
    resave: false,
    saveUninitialized: false,
    secret: 'cmpe226_team2',
    duration: 30 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000,    // Session extension time limit:  5 minutes :  300 seconds
}));

// Default Route
app.use('/', index);

// React Frontend Requests - < http://localhost:3001 >

// User Controller
// POST
app.post('/register', userController.registerUser);
app.post('/login', userController.loginUser);
app.post('/logout', authenticate, userController.logoutUser);
app.post('/authenticateUser', authenticate, userController.authenticateUser);
app.get('/fetchMySurveys', surveyController.fetchMySurveys);
app.get('/fetchSharedWithMe', surveyController.fetchSharedWithMe);
app.get('/fetchVolunteerSurvey', surveyController.fetchVolunteerSurvey);


// Profile Controller
// POST
app.post('/profile/save-profile-image', uploadProfileImage.any(), authenticate, profileController.uploadProfImage);
// GET
app.get('/profile-image', authenticate, profileController.fetchProfileImage);


// Catch 404 and Forward to Error Handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error Handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.log(err);

    // render the error page
    res.status(err.status || 500);
    res.json('error');
});

module.exports = app;