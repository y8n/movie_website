var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

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


console.log('Server listen on '+port);

// index page
app.get('/',function(req,res){
     res.render('index',{
        title:'首页-Welcome to My Website',
        movies:[{ 
            title:'机械战警',
            _id:1,
            poster:"/images/poster.png"
        },{
            title:'指环王',
            _id:2,
            poster:"/images/poster.png"
        },{
            title:'霍比特人1:意外之旅',
            _id:3,
            poster:"/images/poster.png"
        },{
            title:'指环王三 王者无敌',
            _id:4,
            poster:"/images/poster.png"
        },{
            title:'五军之战',
            _id:5,
            poster:"/images/poster.png"
        },{
            title:'X战警',
            _id:6,
            poster:"/images/poster.png"
        }]
    });
});

// detail page
app.get('/movie/:id',function(req,res){
   res.render('detail',{
        title:'电影详细信息',
        movie:{
            doctor:'Jerry Yang',
            country:'USA',
            title:'机械战警',
            year:2014,
            poster:'/images/poster.png',
            language:'英语',
            flash:'http://player.youku.com/player/sid/jixie.swf',
            summary:'机械战警讲的是什么我也没看过，应该是比较有意思的一部电影，以后有空字啊看吧，这只是一个伪造而已。'
        }
    });
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
        Movie.findById(id,function(err,movie){
            res.render('admin',{
                title:'后台更新页面',
                movie:movie
            })
        })
    }
})

// list page
app.get('/admin/list',function(req,res){
    res.render('list',{
        title:'Movie List',
        movies:[{
            doctor:'Jerry Yang',
            _id:1,
            country:'USA',
            title:'机械战警',
            year:2014,
            language:'英语',
            flash:'http://player.youku.com/player/sid/jixie.swf',
            summary:'机械战警讲的是什么我也没看过，应该是比较有意思的一部电影，以后有空字啊看吧，这只是一个伪造而已。'
        }]
    });
});
