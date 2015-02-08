var DB = require('./db'),
	mongodb = require('mongodb');
function Movie (movie) {
	this.title = movie.title;
    this.doctor = movie.doctor;
    this.country = movie.country;
    this.year = movie.year;
    this.poster = movie.poster;
    this.flash = movie.flash;
    this.summary = movie.summary;
    this.language = movie.language;
    this.category = movie.category;
}

module.exports = Movie;

// 向数据库中插入数据
Movie.prototype.insert = function insert(callback){
	//存入mongodb中到文档
	var _movie = {
		title : this.title,
	    doctor : this.doctor,
	    country : this.country,
	    year : this.year,
	    poster : this.poster,
	    flash : this.flash,
	    summary : this.summary,
	    language : this.language,
	    category : this.category
	}

	DB.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('movies',function(err,collection){
			if(err){
				DB.close();
				return callback(err);
			}
			collection.insert(_movie,function(err,doc){
				DB.close();
				callback(err,doc[0]);
			});
		});
	});
}

// 根据id获取数据
Movie.findById = function findById(id,callback){
	DB.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('movies',function(err,collection){
			if(err){
				DB.close();
				return callback(err);
			}
			collection.findOne({_id:mongodb.ObjectID(id)},function(err,doc){
				DB.close();
				if(doc){
					callback(err,doc);
				}else{
					callback(err,null);
				}
			});
		});
	});
}
// 获取所有电影数据
Movie.findAll = function findAll(callback){
	DB.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('movies',function(err,collection){
			if(err){
				DB.close();
				return callback(err);
			}
			collection.find({}).toArray(function(err,doc){
				DB.close();
				if(doc){
					callback(err,doc);
				}else{
					callback(err,null);
				}
			});
		});
	});
}
// 根据电影ID更新数据
Movie.prototype.update = function update(id,callback){
	var _movie = {
		title : this.title,
	    doctor : this.doctor,
	    country : this.country,
	    year : this.year,
	    poster : this.poster,
	    flash : this.flash,
	    summary : this.summary,
	    language : this.language,
	    category : this.category
	}
	DB.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('movies',function(err,collection){
			if(err){
				DB.close();
				return callback(err);
			}
			collection.update({_id:mongodb.ObjectID(id)},{$set:_movie},function(err,doc){
				DB.close();
				if(doc){
					_movie._id = mongodb.ObjectID(id);
					callback(err,_movie);
				}else{
					callback(err,null);
				}
			});
		});
	});
}
// 根据电影id删除数据
Movie.deleteById = function deleteById(id,callback){
	DB.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('movies',function(err,collection){
			if(err){
				DB.close();
				return callback(err);
			}
			collection.remove({_id:mongodb.ObjectID(id)},function(err,doc){
				DB.close();
				if(doc){
					callback(err,doc);
				}else{
					callback(err,null);
				}
			});
		});
	});
}
// 搜索包含指定名字的电影
Movie.search = function search(name,callback){
	DB.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('movies',function(err,collection){
			if(err){
				DB.close();
				return callback(err);
			}
			var reg = new RegExp(name,'i');
			collection.find({title:reg}).toArray(function(err,movies){
				DB.close();
				if(movies){
					callback(err,movies);
				}else{
					callback(err,null);
				}
			});
		});
	});
}










