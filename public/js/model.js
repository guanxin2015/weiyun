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
		upload: '/api/upload',
		//获取图片
		getImage: '/api/getImage',
		//获取视频
		getVideo: '/api/getVideo',
		//获取音频
		getAudio: '/api/getAudio',
		//回收站内容还原
		recovery: '/api/recovery',
		//获取所有子集
		getChildren: '/api/getFile',
		//获取当前元素
		getMe: '/api/getMe'
	},
	
	currentId:'',	//当前所在目录的id
	
	currentCount: 0,	//当前所在目录的文件夹/文件个数
	
	currentChenkedCount: 0,		//当前选中的个数
	
	recycleBinCount : 0,	//回收站里内容的个数
	
	keyCode : null,
	
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
					WeiYun.currentCount = WeiYun.currentChenkedCount = 0;
					$('#contentbg').show().html(empty({
						bg : 'filebg',
						text : "暂无文件",
						p : '请点击右上角的"添加"按钮添加'
					}));
					resultI();
				}else {
					WeiYun.currentCount = result.data.length;
					resultII();
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
 					$('#head-tips').addClass('fail').show().html(result.message);
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
				name: obj.name,
				type: obj.type
			},
			dataType: 'json',
			success: function(result){
				console.log('重命名'+WeiYun.currentId);
				if(result.code == 2){
					$('#head-tips').addClass('fail').show().html(result.message);
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
	drags: function(checkedId,checkedName,checkedType,targetId){
		console.log(checkedId,checkedName,checkedType,targetId)
		$.ajax({
			type: 'POST',
			url: this.API.drag,
			data: {
				checkedId: checkedId.join(','),
				checkedName: checkedName.join(','),
				checkedType: checkedType.join(','),
				targetId: targetId
			},
			dataType: 'json',
			success: function(result){
				console.log(result);
				switch(result.code){
					case 0:
						$('#head-tips').addClass('success').show().html(result.message);
						WeiYun.renderMainList();
						break;
					case 4:
						$('#head-tips').addClass('fail').show().html(result.message);
						break;
						
					case 7:
						$('#head-tips').addClass('fail').show().html(result.message);
						break;
				}
				setTimeout(function(){
					$('#head-tips').hide();
				},2000);
				$('.dragbox').hide();
				console.log('拖拽到'+result);
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
				console.log(result);
				$('#head-tips').addClass('success').show().html(result.message);				
				setTimeout(function(){
					$('#head-tips').hide();
				},2000);
				
				WeiYun.renderMainList();
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
				console.log(result);
				$('#navigation').hide();
				$('#head-tips').addClass('success').show().html(result.message);
				setTimeout(function(){
					$('#head-tips').hide();
				},2000);
				WeiYun.renderRecycleBinList();
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
		fd.append('file',$('#file')[0].files[0]);
		fd.append('pid', WeiYun.currentId);
		xhr.send(fd);
	},
	
	/*回收站*/
	renderRecycleBinList: function(){
		$.ajax({
			url: this.API.getRecycleBinList,
			dataType: 'json',
			success: function(result){
				if( !result.data.length ){
					WeiYun.recycleBinCount = 0;
					$('#contentbg').show().html(empty({
						bg : "recyclebg",
						text : "回收站为空",
						p : '删除后的文件会显示在回收站中'
					}));
					resultI();
				} else {
					resultII();
					romance({
						result : result,
						objClass : $('#contentlist'),
						appendParentI : $('#content'),
						appendParentII: $('#rests')
					});
				}
				
			}
		})
	},
	
	/*回收站内容还原*/
	recoveryList: function(checkedId){
		console.log(checkedId)
		$.ajax({
			url: this.API.recovery,
			data: {
				id : checkedId.join(',')
			},
			dataType: 'json',
			success: function(result){
				$('#navigation').hide();
				$('#head-tips').addClass('success').show().html(result.message);
				setTimeout(function(){
					$('#head-tips').hide();
				},2000);
				WeiYun.renderRecycleBinList();
				console.log('还原成功');
			}
		})
	},
	
	/*获取图片*/
	applyImage: function(){
		$.ajax({
			url: this.API.getImage,
			dataType: 'json',
			success: function(result){
				console.log(result);
				if(!result.data.length){
					WeiYun.currentCount = WeiYun.currentChenkedCount = 0;
					$('#contentbg').show().html(empty({
						bg : 'filebg',
						text : "暂无文件",
						p : '请点击右上角的"添加"按钮添加'
					}));
					resultI();
				}else{
					WeiYun.currentCount = result.data.length;
					resultII();
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
	
	/*获取视频*/
	applyVideo: function(){
		$.ajax({
			url: this.API.getVideo,
			dataType: 'json',
			success: function(result){
				console.log(result);
				if(!result.data.length){
					WeiYun.currentCount = WeiYun.currentChenkedCount = 0;
					$('#contentbg').show().html(empty({
						bg : 'filebg',
						text : "暂无文件",
						p : '请点击右上角的"添加"按钮添加'
					}));
					resultI();
				}else{
					WeiYun.currentCount = result.data.length;
					resultII();
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
	
	/*获取音频*/
	applyAudio: function(){
		$.ajax({
			url: this.API.getAudio,
			dataType: 'json',
			success: function(result){
				console.log('音频'+result);
				if(!result.data.length){
					WeiYun.currentCount = WeiYun.currentChenkedCount = 0;
					$('#contentbg').show().html(empty({
						bg : 'filebg',
						text : "暂无文件",
						p : '请点击右上角的"添加"按钮添加'
					}));
					resultI();
				}else{
					WeiYun.currentCount = result.data.length;
					resultII();
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
	
	/*获取所有子集*/
	getChildren : function(){
		$.ajax({
			url:this.API.getChildren,
			data:{
				id: ''
			},
			dataType: 'json',
			success: function(result){
				moveHtml(result);
			}
		});
	},
	
	/*获取自身*/
	getMe: function(obj,id){
		$.ajax({
			url: this.API.getMe,
			data: {
				id:id
			},
			dataType: 'json',
			success: function(result){
				console.log(obj);
				obj.attr('src','/'+ result.data.path);
			}
		});
	}
	
	
}
