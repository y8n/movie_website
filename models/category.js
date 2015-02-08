var DB = require('./db'),
	mongodb = require('mongodb');


function Category (movie){
	this.name = movie.category;
	this.movies = [movie];
}
module.exports = Category;
// 将电影存入特定类别
Category.save = function(movie,callback){
	DB.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('categories',function(err,collection){
			if(err){
				DB.close();
				return callback(err);
			}
			collection.findOne({name:movie.category},function(err,category){
				if(category){		//如果已经有了这个类型对电影集合
					// 如果有了这一部电影,把原来电影数据删除再更新
					for(var i=0,len=category.movies.length;i<len;i++){
						if((category.movies[i]._id+'') == (movie._id+'')){
							category.movies.splice(i,1);
							break;
						}
					}
					// 如果没有这部电影，直接添加进去
					category.movies.push(movie); //这里把整个movie对象存入数组
					collection.update({name:movie.category},{$set:{movies:category.movies}},function(err,category){
						DB.close();
						callback(err,category);
					})
				}else{  // 没有这个电影的集合
					var _category = new Category(movie);
					collection.save(_category,function(err,category){
						DB.close();
						callback(err,category);
					})
				}
			})
		});
	});
}
// 获取指定ID的电影类型集合
Category.findById = function findById(id,callback){
	DB.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('categories',function(err,collection){
			if(err){
				DB.close();
				return callback(err);
			}
			collection.findOne({_id:mongodb.ObjectID(id)},function(err,category){
				DB.close();
				callback(err,category);
			})
		});
	});
}
// 获取所有电影类别
Category.findAll = function findAll(callback){
	DB.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('categories',function(err,collection){
			if(err){
				DB.close();
				return callback(err);
			}
			collection.find({}).toArray(function(err,categories){
				DB.close();
				callback(err,categories);
			})
		});
	});
}
// 从oldCategory中移除指定ID的电影
Category.removeMovie = function removeMovie(oldCategory,movieId,callback){
	DB.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('categories',function(err,collection){
			if(err){
				DB.close();
				return callback(err);
			}
			collection.findOne({name:oldCategory},function(err,category){
				// 如果有了这一部电影,把原来电影数据删除再更新
				for(var i=0,len=category.movies.length;i<len;i++){
					if((category.movies[i]._id+'') == (movieId+'')){
						category.movies.splice(i,1);
						break;
					}
				}
				collection.update({name:oldCategory},{$set:{movies:category.movies}},function(err,category){
					DB.close();
					callback(err,category);
				})
			})
		});
	});
}
// 添加新的电影类别
Category.saveCategory = function saveCategory(category,callback){
	DB.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('movie_categories',function(err,collection){
			if(err){
				DB.close();
				return callback(err);
			}
			collection.findOne({name:category},function(err,doc){
				if(doc){
					DB.close();
					callback(err,null)
				}else{
					collection.save({name:category},function(err,category){
						if(err){
							console.log(err);return;
						}
						DB.close();
						callback(err,category);
					})
				}
			})
		});
	});
}
// 获取所有现有的类别
Category.findAllCategory = function findAllCategory(callback){
	DB.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('movie_categories',function(err,collection){
			if(err){
				DB.close();
				return callback(err);
			}
			collection.find({}).toArray(function(err,categories){
				if(err){
					return console.log(err);
				}
				DB.close();
				callback(err,categories);
			})
		});
	});
}





