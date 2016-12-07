var WeiYun = {
		
	//接口列表
	API: {
		//面包屑导航
		crumbs: '/api/crumbs',
		//获取当前目录下的一级子文件夹/文件
		getList: '/api/getList',
		//获取回收站中的数据
		getRecycleBinList: '/api/getRecycleBinList',
		//移动
		move: '/api/move',
		//新建
		create: '/api/createFolder',
		//重命名
		rename: '/api/rename',
		//拖拽到
		drag: '/api/move',
		//移动到回收站
		moveToRecycleBin: '/api/moveToRecycleBin',
		//删除
		deletes: '/api/remove',
		//上传
		upload: '/api/upload'
	},
	
//	element: {
//		$contentlist : $('#contentlist'),
//		$crumbslists: $('#crumbslists'),
//		$container: $('#content'),
//		$contentbg: $('#contentbg')
//	},
	
	currentId:'',	//当前所在目录的id
	
	currentCount: 0,	//当前所在目录的文件夹/文件个数
	
	currentChenkedCount: 0,		//当前选中的个数
	
	recycleBinCount : 0,	//回收站里内容的个数
	
	
	
	/*面包屑导航部分*/
	crumbsList: function(){
		$.ajax({
			url:this.API.crumbs,
			data:{
				id:this.currentId
			},
			dataType: 'json',
			success: function(result){
				$('#crumbslists').html('');
				if(!result.data.length){
					$('#wy').removeClass('hover');
				}else{
					$('#wy').addClass('hover');
				};
				crumbsBox({
					result: result,
					appendParent : $('#crumbslists')
				})
			}
		})
	},
	
	/*获取当前目录下的所有文件/文件夹，并显示在主区域中*/
	renderMainList: function(){
		$.ajax({
			url: this.API.getList,
			data: {
				pid: WeiYun.currentId
			},
			dataType: 'json',
			success: function(result){
				if( result.code || !result.data.length){
					//如果出错或者没有数据
					WeiYun.currentCount = 0;
					$('#contentbg').show();
					$('#content').hide().html('');
					$('#rests').hide().html('');
				}else {
					WeiYun.currentCount = result.data.length;
					$('#contentbg').hide();
					$('#content').show().html('');
					$('#rests').show().html('');
					romance({
						result : result,
						objClass : $('#contentlist'),
						appendParentI : $('#content'),
						appendParentII: $('#rests')
					})
				}
			}
		})
	},
	
	/*新建文件夹*/
	createfile:function(obj){
		$.ajax({
            type: 'post',
            url : this.API.create,
            data: {
                pid: WeiYun.currentId,
                name: obj.val()
            },
            dataType: 'json',
            success: function(result) {
                if (result.code) {
                	$('#head-tips').show().html(result.message);
					setTimeout(function(){
						$('#head-tips').hide();
					},2000);
                    obj.focus();
                } else {
                    WeiYun.renderMainList();
                }
            }
        })
	},
	
	/*重命名*/
	renames: function(obj){
		$.ajax({
			url: this.API.rename,
			data: {
				id: obj.id,
				name: obj.name
			},
			dataType: 'json',
			success: function(result){
				if(result.code == 2){
					$('#head-tips').show().html(result.message);
					setTimeout(function(){
						$('#head-tips').hide();
					},2000);
					obj.$input.focus();
					return false;
				};
				WeiYun.renderMainList();
				WeiYun.currentChenkedCount--;
				checkHide(obj.checked);
			}
		})
	},
	
	/*拖拽到*/
	drags: function(checkedId,checkedName,targetId){
		$.ajax({
			type: 'POST',
			url: this.API.drag,
			data: {
				checkedId: checkedId.join(','),
//				checkedName: checkedName.join(','),
				targetId: targetId
			},
			dataType: 'json',
			success: function(result){
				switch(result.code){
					case 0:
						$('#head-tips').addClass('success').show().html(result.message);
						WeiYun.renderMainList();
						break;
					case 4:
						console.log(4);
						$('#head-tips').addClass('fail').show().html(result.message);
						break;
				}
				setTimeout(function(){
					$('#head-tips').hide();
				},2000);
				$('.dragbox').hide();
				console.log(result);
			}
		})
	},
	
	/*移动到回收站*/
	moveToRecycleBin: function(checkedId){
		$.ajax({
			url: this.API.moveToRecycleBin,
			data: {
				id: checkedId.join(',')
			},
			dataType: 'json',
			success: function(result){
				$('#head-tips').addClass('success').show().html(result.message);
				setTimeout(function(){
					$('#head-tips').hide();
				},2000);
				WeiYun.renderMainList();
				console.log(result);
			}
		});
	},
	
	/*删除*/
	remove: function(checkedId){
		$.ajax({
			url: this.API.deletes,
			data: {
				id: checkedId.join(',')
			},
			dataType: 'json',
			success: function(result){
				$('#head-tips').show().html(result.message);
				setTimeout(function(){
					$('#head-tips').hide();
				},2000);
				WeiYun.renderMainList();
				console.log(result);
			}
		});
	},
	
	/*上传*/
	uploading: function(){
		var xhr = new XMLHttpRequest();
		
		xhr.open('post', '/api/upload', true);
		
		xhr.onload = function(){
			WeiYun.renderMainList();
		}
		
		var fd = new FormData();
		fd.append('file',$('#filebg')[0].files[0]);
		fd.append('pid', WeiYun.currentId);
		console.log(fd);
		xhr.send(fd);
	}
	
}
