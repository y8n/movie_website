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
	$('#getDouban').click(function(){
		var douban = $('#douban');
		var id = douban.val();
		if(id){
			$.ajax({
				url:'https://api.douban.com/v2/movie/subject/'+id,
				cache:true,
				type:'get',
				dataType:'jsonp',
				crossDomain:true,
				jsonp:'callback',
				success:function(data){
					$('#inputTitle').val(data.title);
					$('#inputDoctor').val(data.directors[0].name);
					$('#inputCountry').val(data.countries[0].name);
					$('#selectCategory').val(data.genres[0]);
					$('#inputPoster').val(data.images.large);
					$('#inputYear').val(data.year);
					$('#inputSummary').val(data.summary);
				}
			});
		}else{
			alert('豆瓣电影ID不能为空')
		}
	})
	$('#selectCategory').change(function(){
		if($('#selectCategory').val() == '其他'){
			$('.form-group[style]').show();
		}else{
			$('.form-group[style]').hide();
		}
	})
	




















})