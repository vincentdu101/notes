
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var http = require('http');
var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

var app = express();

// Configuration - All Environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'jade');
app.use(favicon(__dirname + "/public/images/polar_bear.ico"));
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true, 
                  saveUninitialized: true,
                  secret: "uwotm8"
                }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

if ('developement' == app.get('env')){
  app.use(errorHandler());
}

// Routes

app.get('/', routes.index);

app.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
