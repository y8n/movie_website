var DB = require('./db'),
	User = require('./user'),
	mongodb = require('mongodb');

function Comment(comment){
	this.from = comment.from;
	this.movieId = comment.movieId;
	this.to = comment.to;
	this.content = comment.content;
}

module.exports = Comment;

Comment.prototype.save = function save (callback){
	//存入mongodb中到文档
	var _comment = {
		from : mongodb.ObjectID(this.from),
		movieId : mongodb.ObjectID(this.movieId),
		to : this.to?mongodb.ObjectID(this.to):null,
		content : this.content
	}

	DB.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('comments',function(err,collection){
			if(err){
				DB.close();
				return callback(err);
			}
			collection.insert(_comment,function(err,doc){
				DB.close();
				callback(err,doc[0]);
			});
		});
	});
}
Comment.findAllByMoiveId = function findAllByMoiveId(id,callback){
	DB.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('comments',function(err,collection){
			if(err){
				DB.close();
				return callback(err);
			}
			collection.find({movieId:mongodb.ObjectID(id)}).toArray(function(err,comments){
				
				if(comments){
					var _comments = [];
					(function iterator(i){
						if(i == comments.length){
							DB.close();
							callback(err,_comments);
							return;
						};
						var comment = comments[i];
						var _comment = {
							_id:comment._id,
							content:comment.content
						}
						db.collection('users',function(err,collection){
							collection.findOne({_id:mongodb.ObjectID(comment.from)},function(err,from){
								_comment.from = from.username;
								collection.findOne({_id:mongodb.ObjectID(comment.to)},function(err,to){
									_comment.to = to?to.username:null;
									_comments.push(_comment);
									iterator(++i);
								})
							})
						})
					})(0);
				}else{
					DB.close();
					callback(err,null);
				}
			});
		});
	});
}
















