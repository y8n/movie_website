var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    setting = require('./setting');

// 路由配置
var movie = require('./routes/movie');
var users = require('./routes/users');

var routes = [movie,users];

var port = process.env.PORT || 3000;
var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.set('views','./views/pages');
app.set('view engine','jade');
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')))
//配置session
app.use(session({
    secret:setting.cookieSecret,
    store:new MongoStore({
        db:setting.db
    })
}));

app.listen(port);
console.log('Server listen on '+port);

app.use(routes);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});




