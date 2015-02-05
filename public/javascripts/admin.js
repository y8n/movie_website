$(function() {
	$('.del').click(function(e){
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-'+id);
		if(tr.length>0){
			var title = tr.children().eq(0).text();
			var flag = window.confirm("确认删除电影:"+title+"?");
			if(flag){
				$.ajax({
					type:"post",
					url:'/admin/list?id='+id
				})
				.done(function(results){
					if(results.success){
						tr.remove();
						alert("删除成功");
					}else{
						alert("删除失败");
					}
				})
			}
		}
	});
	$('#signinForm :button').eq(1).click(function(e){
		$.ajax({
			type:"post",
			url:'/user/signin',
			data:$('#signinForm').serialize(),
			success:function(data){
				if(data.success){
					$('#signinForm .alert').show().addClass('alert-success');
					$('#signinForm .alert .content').text(data.msg);
				}else{
					$('#signinForm .alert .content').text(data.msg);
					$('#signinForm .alert').show().addClass('alert-danger').fadeOut(3000).remove();
				}
			}
		})
	});



})