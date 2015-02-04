var express = require('express');
var Index = require('../controllers/index');
var Movie = require('../controllers/movie');
var User = require('../controllers/user');

module.exports = function(app){


app.use(function(req,res,next){
    var user = req.session.user;
    if(user){
        res.locals.user = user;
    }
    next();
})
// Index
app.get('/', Index.index);

// Movie
app.get('/movie/:id',Movie.detail);
app.get('/admin/movie',Movie.new);
app.get('/admin/update/:id',Movie.update);
app.post('/admin/movie/new',Movie.save);
app.get('/admin/list',Movie.list);
app.post('/admin/list',Movie.del)

// User
app.get('/user/list',User.list);
app.post('/user/signup', User.signup);
app.post('/user/signin',User.signin);
app.get('/logout',User.logout);

}