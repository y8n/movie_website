$(function() {
	// 删除电影
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
					url:'/admin/movie/list?id='+id
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
	// 从豆瓣中获取数据
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
	// 电影类型下拉菜单自定义类型
	$('#selectCategory').change(function(){
		if($('#selectCategory').val() == '其他'){
			$('.otherCategory').show();
		}else{
			$('.otherCategory').hide();
		}
	})
    //表单完整性验证
    var flag = true
        ,$title = $('#inputTitle')
        ,$doctor = $('#inputDoctor')
        ,$country = $('#inputCountry')
        ,$language =  $('#inputLanguage')
        ,$category = $('#selectCategory')
        ,$otherCategory= $('#otherCategory')
        ,$poster = $('#inputPoster')
        ,$flash = $('#inputFlash')
        ,$year = $('#inputYear')
        ,$summary = $('#inputSummary');

        function testForm(){
            if($title.val() === '' 
                || $doctor.val() === '' 
                || $country.val() === '' 
                || $language.val() === ''
                || $flash.val() === ''
                || $year.val() === ''
                || $summary.val() === ''
                || $poster.val() === '') return false;
            if($category.val() === '' 
                || ($category.val() === '其他' 
                && $otherCategory.val() === '')) return false;
            return true;
        }
        $('#add-movie').click(function(){
            var flag = testForm();
            $('.form-warning').hide();
            if(!flag){
                // 提示错误
                if($title.val() === '') $('.form-warning').eq(0).show();
                if($doctor.val() === '') $('.form-warning').eq(1).show();
                if($country.val() === '') $('.form-warning').eq(2).show();
                if($language.val()=== '') $('.form-warning').eq(3).show();
                if($flash.val()=== '') $('.form-warning').eq(7).show();
                if($year.val()=== '') $('.form-warning').eq(8).show();
                if($summary.val()=== '') $('.form-warning').eq(9).show();
                if($category.val() === '') $('.form-warning').eq(4).show();
                if($otherCategory.is(':visible') && $otherCategory.val() === '') $('.form-warning').eq(5).show();
                if($poster.val()=== '') $('.form-warning').eq(6).show();
                alert('信息输入不完整！')
            }else{
                $.ajax({
                    url:'/admin/movie/new',
                    type:'post',
                    data:$("#new_movie_form").serialize(),
                    dataType:'json',
                    success:function(data){
                        console.log(data)
                        if(data.success){
                            window.location = window.location.origin+data.pathname;
                            return;
                        }else{
                            alert('添加失败，请稍后重试！')
                        }
                    } 
                });
            }
        })
        


	




















})