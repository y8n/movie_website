var DB = require('./db'),
	crypto = require('crypto'),
	mongodb = require('mongodb');

function User (user) {
	this.username = user.username;
	this.password = user.password;
}

module.exports = User;

// 向数据库中添加新的用户数据
User.prototype.insert = function insert(callback){
	var md5 = crypto.createHash('md5');
	var password = md5.update(this.password).digest('base64');
	//存入mongodb中到文档
	var _user = {
		username:this.username,
		password:password
	}

	DB.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('users',function(err,collection){
			if(err){
				DB.close();
				return callback(err);
			}
			collection.findOne({username:_user.username},function(err,doc){
				if(doc){
					DB.close();
					callback(err,{
						message:'user is already exists.'
					});
				}else{
					collection.insert(_user,function(err,doc){
						DB.close();
						callback(err,doc[0]);
					});
				}
			});
			
		});
	});
}

// 查找用户
User.findByName = function findByName(username,callback){
	DB.open(function(err,db){
		if(err){
			DB.close();
			return callback(err);
		}
		db.collection('users',function(err,collection){
			if(err){
				DB.close();
				return callback(err);
			}
			collection.findOne({username:username},function(err,user){
				DB.close();
				if(user){
					callback(err,user);
				}else{
					callback(err,null);
				}
			});
		});
	});
}

// 校验用户密码
User.prototype.comparePassword = function comparePassword(callback){
	var md5 = crypto.createHash('md5');
	var password = md5.update(this.password).digest('base64');

	var _user = {
		username:this.username,
		password:password
	}
	User.findByName(_user.username,function(err,user){
		if(err){
			console.error(err);
			return;
		}
		if(user && user.password === _user.password){
			callback(err,true);
		}else{
			callback(err,false);
		}
	});
}
// 获取所有用户信息
User.findAll = function findAll(callback){
	DB.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('users',function(err,collection){
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













