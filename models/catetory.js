var DB = require('./db'),
	mongodb = require('mongodb');


function Catetory (movie){
	this.name = movie.catetory;
	this.movies = [movie];
}
module.exports = Catetory;
Catetory.save = function(movie,callback){
	DB.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('catetories',function(err,collection){
			if(err){
				DB.close();
				return callback(err);
			}
			collection.findOne({name:movie.catetory},function(err,catetory){
				if(catetory){		//如果已经有了这个类型对电影集合
					// 如果有了这一部电影,把原来电影数据删除再更新
					for(var i=0,len=catetory.movies.length;i<len;i++){
						if((catetory.movies[i]._id+'') == (movie._id+'')){
							catetory.movies.splice(i,1);
							break;
						}
					}
					// 如果没有这部电影，直接添加进去
					catetory.movies.push(movie); //这里把整个movie对象存入数组
					collection.update({name:movie.catetory},{$set:{movies:catetory.movies}},function(err,catetory){
						DB.close();
						callback(err,catetory);
					})
				}else{  // 没有这个电影的集合
					var _catetory = new Catetory(movie);
					collection.save(_catetory,function(err,catetory){
						DB.close();
						callback(err,catetory);
					})
				}
			})
		});
	});
}
Catetory.findAllByCatetory = function findAllByCatetory(catetory,callback){
	DB.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('catetories',function(err,collection){
			if(err){
				DB.close();
				return callback(err);
			}
			collection.findOne({name:catetory},function(err,catetory){
				DB.close();
				callback(err,catetory);
			})
		});
	});
}
Catetory.findAll = function findAll(callback){
	DB.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('catetories',function(err,collection){
			if(err){
				DB.close();
				return callback(err);
			}
			collection.find({}).toArray(function(err,catetories){
				DB.close();
				callback(err,catetories);
			})
		});
	});
}
Catetory.removeMovie = function removeMovie(oldCatetory,movieId,callback){
	DB.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('catetories',function(err,collection){
			if(err){
				DB.close();
				return callback(err);
			}
			collection.findOne({name:oldCatetory},function(err,catetory){
				// 如果有了这一部电影,把原来电影数据删除再更新
				for(var i=0,len=catetory.movies.length;i<len;i++){
					if((catetory.movies[i]._id+'') == (movieId+'')){
						catetory.movies.splice(i,1);
						break;
					}
				}
				collection.update({name:oldCatetory},{$set:{movies:catetory.movies}},function(err,catetory){
					DB.close();
					callback(err,catetory);
				})
			})
		});
	});
}
Catetory.saveCatetory = function saveCatetory(catetory,callback){
	DB.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('movie_catetories',function(err,collection){
			if(err){
				DB.close();
				return callback(err);
			}
			collection.findOne({name:catetory},function(err,doc){
				if(doc){
					DB.close();
					callback(err,null)
				}else{
					collection.save({name:catetory},function(err,catetory){
						if(err){
							console.log(err);return;
						}
						DB.close();
						callback(err,catetory);
					})
				}
			})
		});
	});
}
Catetory.findAllCatetory = function findAllCatetory(callback){
	DB.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('movie_catetories',function(err,collection){
			if(err){
				DB.close();
				return callback(err);
			}
			collection.find({}).toArray(function(err,catetories){
				if(err){
					return console.log(err);
				}
				DB.close();
				callback(err,catetories);
			})
		});
	});
}





