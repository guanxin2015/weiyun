$(function(){
	//初始化
	if(window.location.hash){
		hashChange();
	}else {
		WeiYun.crumbsList();  //面包屑导航
    	WeiYun.renderMainList();  //渲染主区域列表
	}
	
	/*当hash值发生变化的时候，页面也发生变化*/
	window.onhashchange = function(){
		hashChange();
	}
/**********头部导航部分开始**********/
	
	/*缩略图和列表切换*/
	$('#view .box').on('click',function(){
		arrayList(this);
		WeiYun.renderMainList();
	})
	
	//添加按钮显示弹框事件
	displayNems($('#addbg'),$('#add'),$('#add .type'));
	
	//新建文件夹
	$('#createfile').on('click',function(){
		createfile();
	})
	
	//弹出层取消选择键
	$('#cancel').on('click',function(){
		WeiYun.currentChenkedCount = 0;
		checkHide($('#contentArea .check'));
	})
	
	//弹出层重命名
	$('#renamebtn').on('click',renameObj);
	
	//移动到 
	$('#movebtn').on('click',moveBtn)
	
	//删除到回收站
	$('#delete').on('click',deleteBox);
	
	
	//上传操作
	$('#file').on('change',function(){
		if(!this.files.length){
			return;
		}
		if($(this).val()){
			console.log(this.files[0].name)
			$('.tipsbg').css('display','flex').attr('_id','uploading');
			$('.tipsbg #headtitle').html('上传文件');
			$('.tipsbg .top').show().html(uploadingTop(this));
			$('.tipsbg .foot').show();
			$('.tipsbg .content').addClass('uploading').html(uploadingHtml());
			tipsBoxNews();
		}
	})
	
	
	
	/*****回收站页面的操作*****/
	//从回收站中删除
	$('#obliterate').on('click',obliterateBtn);
	
	
	//从回收站中还原
	$('#restore').on('click',restoreBox);
	
	//全部清空操作
	$('.clearAll').on('click',function(){
		console.log('清空回收站');
		$('.tipsbg').css('display','flex').attr('_id','clearAll');
		$('.tipsbg #headtitle').html('清空回收站');
		$('.tipsbg .top').hide();
		$('.tipsbg .foot').hide();
		$('.tipsbg .tips-text').hide();
		$('.tipsbg .content').addClass('remove').html(clearAllHtml());
		tipsBoxNews();
	})
	
	/******弹出层按钮********/
	var boxNews = $('.tipsbox').get()[0];
	$('.tipsbox .head').on('mousedown',function(e){
		var L = e.clientX - boxNews.offsetLeft;
		var T = e.clientY - boxNews.offsetTop;
		document.onmousemove = function(e){
			var l = e.clientX - L;
			var t = e.clientY - T;
			if(l < 0 ) {
				l = 0;
			}
			if(l > window.innerWidth - boxNews.offsetWidth) {
				l = window.innerWidth - boxNews.offsetWidth;
			}
			if(t < 0){
				t = 0;
			}
			if(t > window.innerHeight - boxNews.offsetHeight){
				t = window.innerHeight - boxNews.offsetHeight;
			}
			$('.tipsbox').css({left: l,top: t});
		}
		
		document.onmouseup = function(){
			document.onmousemove = document.onmouseup = null;
		}
		return false;
	})
	$('#tipsoff').on('click',function(){
		$('.tipsbg').css('display','none');
		$('.tipsbg .content').attr('class','content');
		$('.tipsbg .content').attr('class','content').html('');
		$('.tipsbg .tips-text').hide();
	})
	
	$('.tipsbg .no').on('click',function(){
		var classNames = $('.tipsbg').attr('_id');
		$('.tipsbg').css('display','none');
		$('.tipsbg .content').attr('class','content').html('');
		$('.tipsbg .tips-text').hide();
	})
	
	$('.tipsbg .yes').on('click',function(){
		var classNames = $('.tipsbg').attr('_id');
		switch(classNames){
			case 'delete':
				moveToRecycleBin();
				break;
			
			case 'uploading':
				WeiYun.uploading();
				break;
			
			case 'clearAll':
				$('#contentlist .check').addClass('checked');
				obliterateBtn();
				break;
		}
		
		if(classNames == 'move'){
			if($(this).css('opacity') == '1'){
				moveBox($('.tipsbg .checked'));
			}else {
				return;
			}
		}
		$('.tipsbg').css('display','none');
		$('.tipsbg .content').attr('class','content');
		$('.tipsbg .tips-text').hide();
	});
	
	//音频、视频、图片弹出层
	$('.restsbg .off').on('click',function(){
		$('.restsbg').css('transform','scale(0)');
		
		if($('.restsbg').attr('class').indexOf('video') != -1 ){
			$('.restsbg .video')[0].pause();
		} else if($('.restsbg').attr('class').indexOf('audio') != -1){
			$('.restsbg .audio')[0].pause();
		}
	})
	
	
/**********左侧导航部分开始**********/
	//头像按钮显示弹框事件
	displayNems($('.portrait'),$('.username'),$('.userinfo'));
	
	//头像弹窗显示用户名事件
	$('.portrait').on('mouseover',function(){
		//从cookie中获取到用户名
		var userObj = JSON.parse(document.cookie.split('=')[1]);
		$('.userinfo .user')[0].innerHTML = userObj.username;
	})
	
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

	//左侧栏的点击事件
	$('.navcontent .list').on('click',function(e){
		window.location.hash = '#m='+ $(this).attr('id');
	})
	
	
	
/**********右侧内容开始**********/

/*****面包屑导航开始*****/
	//微云按钮的点击事件
	$('#wy').on('click',function(){
		WeiYun.currentId = '';
		WeiYun.crumbsList(); 
    	WeiYun.renderMainList();
	})

	//全选按钮
	$('#checkAll').on('click',function(e){
		if(e.target == $('#checkAll .ico')[0]){
			var checkIndex = e.target.getAttribute('class').indexOf('checked');
			if( checkIndex == -1 ){
				WeiYun.currentChenkedCount = WeiYun.currentCount;
				checkShow($('#contentArea .check'));
			}else {
				WeiYun.currentChenkedCount = 0;
				checkHide($('#contentArea .check'));
			}
		}
	})
	$('#checkAll').on('mousedown',function(){  //阻止冒泡
		return false;
	})
	
/*****列表界面开始*****/
	//框选效果
	$('#contentlist').on('mousedown',function(e){
		WeiYun.keyCode = e.which;
		if(WeiYun.keyCode === 1){
			console.log('jdjjdjdjdj');
			contentSelection(e);
		}
		
		return false;
	})
	
	document.oncontextmenu = function(e){
		return false;
	}
	
	document.onclick  = function(){
		$('.contextmenu-box').hide();
	}
	
	
	/*右键事件*/
	$('.contextmenu .text').on('click',function(){
		var name = this.getAttribute('class').split(' ')[1];
		console.log(name);
		switch(name) {
			case 'rename':
				renameObj();
				break;
			
			case 'remove': 
				deleteBox();
				break;
			
			case 'move':
				moveBtn();
				break;
		}
	})
	
})




