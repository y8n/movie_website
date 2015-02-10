$(function(){
	//导航栏切换
	var url = window.location.pathname;
	var $nav = $('ul.navbar-nav').eq(0);
	if(url === '/'){
		$nav.children().eq(0).addClass('active');
	}else if(url === '/admin/movie'){
		$nav.children().eq(1).addClass('active');
	}else if(url === '/admin/movie/list'){
		$nav.children().eq(2).addClass('active');
	}else if(url === '/user/list'){
		$nav.children().eq(3).addClass('active');
	}else if(url === '/admin/category/list'){
		$nav.children().eq(4).addClass('active');
	}
	//注册界面表单验证
	$('#signupbtn').click(function(){
		var target = $(this);
		var $form = $('#signupModal form');
		var	username = $('#signupName');
		var password = $('#signupPassword');
		var repassword = $('#signupRePassword');
		var $alert = $('.alert').hide();
		if(username.val() === '' || password.val() === '' || repassword.val() === ''){
			$alert.text('信息输入不完整!').show();
		}else if(password.val() !== repassword.val()){
			$alert.text('两次的密码不一致').show();
		}else{
			$.ajax({
				url:'/user/signup',
				type:'post',
				dataType:'json',
				data:$form.serialize(),
				success:function(data){
					if(data.success){
						$('#signupModal').hide();
						window.location = window.location.origin+data.pathname;
					}else{
						$alert.text('用户已经存在').show();
					}
				}
			});
		}

	})
});