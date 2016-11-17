$(function(){
	
	console.log(document.cookie)
	/*变量*/
	var timer = null;
	var timerI = null;
	/*通过js,设置界面的宽高等信息*/
//	var wrapH = window.innerHeight - $('.head').innerHeight();
//	var wraprightW = window.innerWidth - $('.wrapnav').outerWidth(); //包括边框的方法
//	console.log(wraprightW);
//	$('.wrap').css('height',wrapH);
//	$('.wrapright').css('width',wraprightW);
	
	/*头部用户信息部分*/
	//user的移入事件
	$('.users').on('mouseover',function(){
		clearTimeout(timer);
		$('.users').addClass('hover');
		$('.userinfo').css('display','block');
	})
	
	//user的移出事件
	$('.users').on('mouseout',function(){
		timer = setTimeout(function(){
			userOut();
		},100)
	})
	
	//userinfo的移入事件
	$('.userinfo').on('mouseover',function(){
		clearTimeout(timer);
	})
	
	//userinfo的移出事件
	$('.userinfo').on('mouseout',function(){
		timer = setTimeout(function(){
			userOut();
		},100)
	})
	
	//从用户操作移出的事件函数
	function userOut(){
		$('.users').removeClass('hover');
		$('.userinfo').css('display','none');
	}
	
	//添加按钮的弹出事件
	//移入事件
	$('#addbg').on('mouseover',function(){
		clearTimeout(timerI);
		$('#addbg').addClass('hover');
		$('#add .type').css('display','block');
	})
	
	//移出事件
	$('#addbg').on('mouseout',function(){
		timerI = setTimeout(function(){
			addOut();
		},100)
	})
	
	//type的移入事件
	$('#add .type').on('mouseover',function(){
		clearTimeout(timerI);
	})
	
	//type的移出事件
	$('#add .type').on('mouseout',function(){
		timerI = setTimeout(function(){
			addOut();
		},100)
	})
	
	//添加按钮的事件函数
	function addOut(){
		$('#addbg').removeClass('hover');
		$('#add .type').css('display','none');
	}
	
	
	//选中按钮
	$('.check').on('click',function(){
		$('.check').addClass('checked');
	})
	
	//移出事件
	$('.check').on('mouseout',function(){
		$('.check').addClass('checked');
	})
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
	
	
	var contentBox = document.querySelector('.contentlist .lists');
	//新建文件夹的点击事件
	$('#createfile').click(function(){
		var html = `<li class="box slt">
						<div class="fl ico folder"></div>
						<span class="fl text">{{练习}}</span>
						<div class="ico check"></div>
					</li>`;
		contentBox.innerHTML += html;
	})
})
