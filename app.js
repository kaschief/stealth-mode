require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const flash = require('connect-flash');
const app = express();

mongoose
    .connect(
        'mongodb://localhost/stealth-mode',
        { useNewUrlParser: true }
    )
    .then(x => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
    })
    .catch(err => {
        console.error('Error connecting to mongo', err);
    });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Require Session Middleware
app.use(
    session({
        secret: 'our-passport-local-strategy-app',
        resave: true,
        saveUninitialized: true
    })
);

app.use(session({ cookie: { maxAge: 60 * 60 * 1000 } }));

//Serialize Sessions
passport.serializeUser((user, cb) => {
    cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});

app.use(flash());

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email'
        },
        (email, password, next) => {
            User.findOne({ email }, (err, user) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return next(null, false, {
                        message: 'Sorry, the email address was incorrect'
                    });
                }
                if (!bcrypt.compareSync(password, user.password)) {
                    return next(null, false, { message: 'The password was incorrect' });
                }

                return next(null, user);
            });
        }
    )
);

// Initialize Sessions
app.use(passport.initialize());
app.use(passport.session());
// Express View engine setup

app.use(
    require('node-sass-middleware')({
        src: path.join(__dirname, 'public'),
        dest: path.join(__dirname, 'public'),
        sourceMap: true
    })
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Welcome to Klipr';

const index = require('./routes/index');
app.use('/', index);

module.exports = app;
