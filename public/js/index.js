$(function(){
	//吊顶中导航的点击事件
	$('.head li').click(function(){
		$('#fixednav .arrows').removeClass('over').hide();
		$('#fixednav .img').removeClass('over');
		$('#fixednav .arrows').eq($(this).index('.head li')).addClass('over').show();
		$('#fixednav .img').eq($(this).index('.head li')).addClass('over');
	})
	var $boxlist = $('.boxlis li');
	var $submits = $('.submits');
	//登录注册的切换
	//移入
	$boxlist.on('mouseover',function(){
		$boxlist.attr("class","");
		$(this).attr('class','hover');
	});
	
	//移出
	$boxlist.on('mouseout',function(){
		var thisClass = $submits.eq($(this).index('.boxlis li')).css('display');
		if(thisClass == "block"){
			$(this).attr('class','hover');
		}else{
			$boxlist.attr("class","hover");
			$(this).attr('class','');
		}
	})
	
	//点击
	$boxlist.on('click',function(){
		$boxlist.attr("class","");
		$submits.hide();
		$(this).attr('class','hover');
		$submits.eq($(this).index('.boxlis li')).show();
	})
	
	//注册控件的点击事件
	boxclick('.regiserbox div');
	//注册控件的input事件
	boxinput('.regiserbox input');
	
	//登录控件的点击事件
	boxclick('.loginbox div');
	//登录控件的input事件
	boxinput('.loginbox input');
	
	//首页轮播图
	var box = document.getElementById('play-back');
	var ul = box.querySelector('ul');
	var w = box.getBoundingClientRect().width;
	//	ul.style.width = w * ul.children.length +'px';
	var num = 0;
	var timer = null;
	//点击的时候切换图片
	//当图片是最后一张的时候，运动完瞬间回到第一张图片和位置
	timer = setInterval(fn,2000);
	function fn(){
		timefun();
	}
	
	//轮播图的运动函数
	function timefun(){
		num++;
		if(num == ul.children.length-1){
			mTween(ul, {
				left :-num *w
			} , 500, 'linear',function(){
				ul.style.left = 0;
				num = 0;
			});
			return;
		}
		mTween(ul, {
			left : -num *w
		}, 500, 'linear');
	}
	
	
//	//移入盒子，轮播图停止
	$('#play-back').on('mouseover',function(){
		clearInterval(timer);
	})
	
	//移出的时候轮播图开启
	$('#play-back').on('mouseout',function(){
		timer = setInterval(fn,2000);
	})
	
	//获取窗口的高度
	var windowh = window.innerHeight;
	//获取盒子到顶部的高度，
	
	var T = 0;
	//首页滚轮事件
	window.onscroll = function(){
		boxScroll('album-backup','left',windowh);
		boxScroll('contact-backup','right',windowh);
		boxScroll('file','left',windowh);
		boxScroll('cloudynotes','right',windowh);
		boxScroll('trash','left',windowh);
	}
	
	
	/*定位导航部分*/
//	//定位的初始top值
//	$('#fixednav').css('top',windowh*0.8);
//	
//	//获取 li的高度
//	var l = $('#fixednav li').height();
	//移入事件
	$('#fixednav li').on('mouseover',function(){
		$('#fixednav .text').eq($(this).index('#fixednav li')).css('opacity',1);
	})
	//移出事件
	$('#fixednav li').on('mouseout',function(){
		$('#fixednav .text').eq($(this).index('#fixednav li')).css('opacity',0);
	})
	
	//点击事件
	$('#fixednav li').on('click',function(){
		$('#fixednav .arrows').removeClass('over').hide();
		$('#fixednav .img').removeClass('over');
		$('#fixednav .arrows').eq($(this).index('#fixednav li')).addClass('over').show();
		$('#fixednav .img').eq($(this).index('#fixednav li')).addClass('over');
//		//获取当前元素的index值
//		var  n = $(this).index('#fixednav li');
//		var h = windowh*0.8 -  n* l;
//		$('#fixednav').css('top',h);
	})
	
	
	/***************************/
	//ajax 内容
//	//注册的内容
	//此处的ajax是验证的是用户名是否可用
	$('.regiserbox [name="username"]').on('blur',function(){
		$.ajax({
			url : '/api/user/checkUserName',
			data : {
				username : this.value
			},
			dataType : 'json',
			success : function(result){
				$('.regiserbox .message-username').html(result.message);
				if(result.code){
					$('.regiserbox .message-username').css('color','red');
				}else {
					$('.regiserbox .message-username').css('color','green');
				}
			}
		})
	})
	
	//此处的ajax是注册内容提交的请求
	$('.register').on('submit',function(){
		$.ajax({
			type:"POST",
			url:$(this).attr('action'),
			data : {
				username : this.username.value,
				password : this.password.value,
				repassword : this.password.value
			},
			dataType: 'json',
			
			//发送请求成功后返回的数据时页面需要做的事情
			success : function(result){
				$('.regiserbox .submittext').html(result.message);
				if(result.code){
					//未成功时显示的内容情况
					$('.regiserbox .submittext').css('color','red');
				}else {
					//成功时显示的内容情况
					$('.regiserbox .submittext').css('color','green');
				}
			}
		});
		
		return false;   //阻止提交跳转用的
	})
	
	
	//登录内容
	$('.login').on('submit',function(){
		$.ajax({
			type:"POST",
			url:$(this).attr('action'),
			data:{
				username : this.username.value,
				password : this.password.value
			},
			dataType:'json',
			success : function(result){
				$('.loginbox .submittext').html(result.message);
				if(result.code){
					$('.loginbox .submittext').css('color','red');
				}else {
					$('.loginbox .submittext').css('color','green');
					//延迟跳转页面
					setTimeout(function(){
						window.location.reload(); //？？？
					},1000);
					
				}
			}
		});
		return false; //要注意阻止默认的提交行为；
	})
	
})
