var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    mongodb = require('mongodb');

var port = process.env.PORT || 3000;
var app = express();


app.set('views','./views/pages');
app.set('view engine','jade');
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')))
app.listen(port);

var Db = mongodb.Db,
    Connection = mongodb.Connection,
    Server = mongodb.Server;

var host = "localhost",port = Connection.DEFAULT_PORT;
var db = new Db("mywebsite",new Server(host,port,{auto_reconnect:true,poolSize:20}),{w:1});

db.open(function(err,client){
    if(err){
        console.error(err);
        return;
    }
    console.log('connect mongodb success');
    app.db = {};
    app.db.movies = new mongodb.Collection(client,'movies');
});


console.log('Server listen on '+port);

// index page
app.get('/',function(req,res){
    var cursor = app.db.movies.find({}); 
    cursor.toArray(function(err,doc){
        if(err){
            console.error(err);
            return;
        }
        res.render('index',{
            title:'首页-Welcome to My Website',
            movies:doc
        })
    })
});

// detail page
app.get('/movie/:id',function(req,res){
    var id = req.params.id;
    if(id){
        var cursor = app.db.movies.find({_id:mongodb.ObjectID(id)}); 
        cursor.toArray(function(err,doc){
            if(err){
                console.error(err);
                return;
            }
            res.render('detail',{
                title:'电影详细信息',
                movie:doc[0]
            })
        })
    }
});

// admin page
app.get('/admin/movie',function(req,res){
    res.render('admin',{
        title:'后台录入页面',
        movie:{
            title:'',
            doctor:'',
            country:'',
            year:'',
            poster:'',
            flash:'',
            summary:'',
            language:''
        }

    });
});

// admin update
app.get('/admin/update/:id',function(req,res){
    var id = req.params.id;
    if(id){
        var cursor = app.db.movies.find({_id:mongodb.ObjectID(id)}); //传递参数进行相应参数的查询
        cursor.toArray(function(err,doc){
            if(err){
                console.error(err);
                return;
            }
            res.render('admin',{
                title:'后台更新电影',
                movie:doc[0]
            })
        })
    }
})

// admin post movie
app.post('/admin/movie/new',function(req,res){
    var movieObj = req.body;
    var id = movieObj._id;
    var _movie = {};

   if(id != 'undefined'){
        var cursor = app.db.movies.find({_id:mongodb.ObjectID(id)}); //传递参数进行相应参数的查询
        for(var i in movieObj){
            if(i != "_id"){
                _movie[i] = movieObj[i];
            }
        }
        app.db.movies.update({_id:mongodb.ObjectID(id)},{$set:_movie},function(err,doc){
            if(err){
                console.error(err);
                return;
            }
            console.log("Update success");
            res.redirect("/movie/"+id);
        });
    }else{
        _movie = {
            doctor:movieObj.doctor,
            title:movieObj.title,
            country:movieObj.country,
            language:movieObj.language,
            year:movieObj.year,
            poster:movieObj.poster,
            summary:movieObj.summary,
            flash:movieObj.flash
        }
        app.db.movies.insert(_movie,function(err,doc){
            if(err && err.code == 11000){
                console.log("This user is already exists.");
                return;
            }else if(err){
                console.log(err);
                return;
            }
            console.log("Insert success.New data's id is "+doc[0]._id);
            res.redirect('/movie/'+doc[0]._id);
        });    
    }

});

// list page
app.get('/admin/list',function(req,res){
    var cursor = app.db.movies.find({}); 
    cursor.toArray(function(err,doc){
        if(err){
            console.error(err);
            return;
        }
        res.render('list',{
            title:'Movie List',
            movies:doc
        });
    })
});

// list delete movie

app.post('/admin/list',function(req,res){
    var id = req.query.id;
    if(id){
        console.log("Remove success");
        app.db.movies.remove({_id:mongodb.ObjectID(id)},function(err,doc){
            if(err){
                console.error(err);
                return;
            }
            if(doc){
                console.log("Remove success");
                res.send({success:true,msg:"删除成功"})
            }else{
                console.log("No matched data");
                res.send({success:false,msg:"删除失败:电影不存在"})
            }
        });
    }
})








