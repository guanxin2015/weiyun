$(function(){
	
	//初始化
	WeiYun.crumbsList();  //面包屑导航
    WeiYun.renderMainList();  //渲染主区域列表
    console.log(document.cookie);
/**********头部导航部分开始**********/
	
	/*缩略图和列表切换*/
	$('#view .box').on('click',function(){
		arrayList(this);
		WeiYun.renderMainList();
	})
	
	/*时间和字母排序*/
//	$('#sort .box').on('click',function(){
//		setClass(this);
//		$.ajax({
//			type:"get",
//			url:"",
//			async:true
//		});
//		WeiYun.renderMainList();
//	})
	
	//添加按钮显示弹框事件
	displayNems($('#filebg'),$('#add'),$('#add .type'));
	
	//新建文件夹
	$('#createfile').on('click',function(){
		createfile();
	})
	
	//弹出层取消选择键
	$('#cancel').on('click',function(){
		WeiYun.currentChenkedCount = 0;
		checkHide($('#content .check'));
	})
	
	//弹出层重命名
	$('#rename').on('click',function(){
		renameObj();
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
				checkShow($('#content .check'));
			}else {
				WeiYun.currentChenkedCount = 0;
				checkHide($('#content .check'));
			}
		}
	})
	
/*****列表界面开始*****/
	//框选效果
	$('#contentlist').on('mousedown',function(e){
		WeiYun.currentChenkedCount = 0;
		checkHide($('#content .check'));
//		rect : 给框选一个class名rect 然后再写框选
		
	})
	

})
