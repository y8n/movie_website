var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/about', function(req, res) {
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

module.exports = router;
