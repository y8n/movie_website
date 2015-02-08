var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    mongodb = require('mongodb'),
    MongoStore = require('connect-mongo')(session),
    setting = require('./setting');

// 路由配置
var index = require('./routes/index');
var movie = require('./routes/movie');
var user = require('./routes/user');
var comment = require('./routes/comment');
var category = require('./routes/category');

var routes = [index,movie,user,comment,category];

var port = process.env.PORT || 3000;
var app = express();

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.set('views','./views/pages');
app.set('view engine','jade');
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')))
app.locals.pretty = true //后台代码格式化输出
//配置session
app.use(session({
    secret:setting.cookieSecret,
    store:new MongoStore({
        db:setting.db
    }),
    resave:false,
    saveUninitialized:false
}));

//app.listen(port);
//console.log('Server listen on '+port);

var Db = mongodb.Db,
    Connection = mongodb.Connection,
    Server = mongodb.Server;

var host = "localhost";
var db = new Db("mywebsite",new Server(host,Connection.DEFAULT_PORT,{auto_reconnect:true,poolSize:20}),{w:1});

db.open(function(err,client){
    if(err){
        console.error(err);
        return;
    }
    console.log('connect mongodb success');
    app.listen(port);
    console.log('Server listen on '+port);
    db.close();
});

app.use(function(req,res,next){
    var user = req.session.user;
    if(user){
        res.locals.user = user;
    }
    next();
})

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




