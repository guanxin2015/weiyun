$(function(){
	
	
	//从cookie中获取到用户名
	//console.log(document.cookie);
	var userObj = JSON.parse(document.cookie.split('=')[1]);
//	//显示用户名事件
	$('.portrait').on('mouseover',function(){
//		console.log($('.userinfo .user'));
		$('.userinfo .user')[0].innerHTML = userObj.username;
	})
	
	/**********导航部分开始**********/
	
	
	$('#view .box').on('click',function(){
		arrayList(this);
	})
	$('#sort .box').on('click',function(){
		removeClass(this);
	})
	/**********导航部分结束**********/
	//头部按钮显示事件
	displayNems($('.portrait'),$('.username'),$('.userinfo'));
	
//	添加按钮显示事件
	displayNems($('#filebg'),$('#add'),$('#add .type'));
	
	
	//当前页面的文件个数
	var currentElements = [];
	
	//选中的文件的个数
	var currentChecked = [];
	
	
	var contentBox = document.querySelector('.contentlist .lists');
	
	
	/**************ajax的内容****************/
	//退出按钮的点击事件   用a标签做退出
	$('#off').click(function(){
		$.ajax({
			type:"get",
			url:"/user/logout",
			success:function(){
				window.location.href = '/';
			}
		});
	})
	
	//当前的pid
	var pid = '';
	
	
	getList();
	
	//新建文件夹
	$('#createfile').on('click',function(){
		$('#contentbg').css('display','none');
		$('#content').css('display','block');
//		var 
//		if($('#contentlist').)
		var name = prompt('请输入要新建的文件夹的名称');
		if (name == '') {
	        alert('请输入名称');
	    } else {
	        $.ajax({
	            type: 'post',
	            url : '/api/createFolder',
	            data: {
	                pid: pid,
	                name: name
	            },
	            dataType: 'json',
	            success: function(result) {
	                if (result.code) {
	                    alert(result.message);
	                } else {
	                    getList();
	                }
	            }
	        })
	    }
	})
	
	//获取所有的文件夹信息
	var crumbslists = document.getElementById('crumbslists');
	function getList(){
		$('#crumbslists').innerHTML = '';
		$('#content').innerHTML = '';
		//面包屑导航
		$.ajax({
			url: '/api/crumbs',
			data:{
				id: pid
			},
			dataType:'json',
			success:function(result){
				$('#crumbslists').html('');
				if(!result.data.length){
					$('#wy').removeClass('hover');
					return;
				}else{
					$('#wy').addClass('hover');
				}
				for(var i = 0; i < result.data.length; i++){
					var li = document.createElement('li');
					li.setAttribute('class','list');
					var span = document.createElement('span');
					span.className = 'ico';
					li.appendChild(span);
					var navName = document.createElement('span');
					navName.className = 'text hover';
					navName.innerHTML = result.data[i].name;
					navName.setAttribute('_id',result.data[i]._id);
					li.appendChild(navName);
					crumbslists.appendChild(li);
					navName.onclick = function(){
						pid = this.getAttribute('_id');
						gitList();
					}
					if(i == result.data.length-1 ) {
						navName.className = 'text';
						navName.onclick = null;
					}
				}
			}
		});
		
		//内容渲染部分
		$()
		$.ajax({
			url: '/api/getList',
			data: {
				pid: pid
			},
			dataType: 'json',
			success:function(result){
				if(!result.data.length){
					$('#contentbg').css('dispay','block');
					$('#content').css('display','none');
				}else{
					$('#contentbg').css('display','none');
					$('#content').css('display','block');
					var attClass = document.getElementById('contentlist').getAttribute('class');
					for(var i = 0 ; i < result.data.length; i++) {
						var $li = $('<li>').attr('_id',result.data[i]._id).attr('_name',result.data[i.name]).addClass('box').appendTo($('#content'));
						if(attClass.indexOf('slt') != -1){
							$li.addClass('slt');
							$li.html('<div class="fl ico folder"></div><span class="fl text">' + result.data[i].name + '</span><div class="ico check"></div>');
						}else {
							$li.addClass('lb');
							$li.html();
						}
					}
					
				}
			}
		})
		
		
	}

	
})
