var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

mongoose.connect(configDB.url);

require('./config/passport')(passport);

app.use(morgan('dev')); 	// Log requests
app.use(cookieParser()); 	// Cookies required for authentication.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('Set view engine', 'ejs');	// Templating engine for JS (C# .tt kind)

app.use(session({
    secret: "myverysecretsecret",
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport);

app.listen(port);
console.log('Server running on port ' + port);