/*********** 登录页面开始  ***********/ 
//注册、登录控件的点击事件
//@param obj [object] 需要操作的元素
//@return undefined
function boxclick(obj){
	$(obj).on('click',function(){
		this.children[0].focus();
	})
}

//注册、登录控件的input事件
//@param obj [object] 需要操作的元素
//@return undefined
function boxinput(obj){
	$(obj).on('input',function(){
		this.parentNode.children[1].style.display = 'none';
	})
}

//首页内容运动函数
//@param obj [object] 发生运动的元素
//@param attrs [string] 运动的样式
//@param h [number] 可视区域的高度
//return undefined
function boxScroll(obj,attrs,h){
	var objs = document.getElementById(obj);
	T = objs.getBoundingClientRect().top;
	if(h > (T +10 ) ){
		var texts = objs.querySelector('.text');
		var imgs = objs.querySelector('.img');
		mTween(texts, {
			[attrs]:0     //此处注意变量的写法
		}, 500, 'linear');
		mTween(imgs, {
			top:0,
			opacity:1
		}, 500, 'linear');
	}
}

/*********** 登录页面结束  ***********/ 

/*********** disk页面开始  ***********/ 
//头部信息和添加按钮移入显示内容的函数
//@param a [object] 发生事件的页面显示的元素
//@param b [object] 改变class名的页面元素
//@param c [object] 被隐藏内容发生的事件
//@return undefined
function displayNems(a,b,c){
	var timer = null;
	//移入事件
	a.on('mouseover',function(e){
		clearTimeout(timer);
		b.addClass('hover');
	})
	
	//移出事件
	a.on('mouseout',function(e){
		timer = setTimeout(function(){
			b.removeClass('hover');
		},100)
	})
	
	//移入显示内容的事件
	c.on('mouseover',function(e){
		clearTimeout(timer);
	})
	
	//移出显示内容的事件
	c.on('mouseout',function(e){
		timer = setTimeout(function(){
			b.removeClass('hover');
		},100)
	})
}

//排序函数
//@param obj [变量] 发生变化的元素
//@return undefined
function arrayList(obj){
	setClass(obj);
	var Id = obj.getAttribute('id');
	var crumbsClass = 'crumbs' + ' ' + Id;
	var contentlistClass = 'contentlist'+' '+Id;
	$('#crumbs').attr('class',crumbsClass);
	$('#contentlist').attr('class',contentlistClass);
}

//给当前元素设置某个class名
//@param obj [变量] 发生变化的元素
//@return undefined
function setClass(obj){
	var childrens = obj.parentNode.children;
	for(var i = 0 ; i < childrens.length; i++){
		removeClassView(childrens[i],'bg');
	}
	createClassView(obj,'bg');
}

/*渲染页面的函数*/
//@param obj [object] 
//@return undefined
function romance(obj){
	if(typeof obj == 'object'){
		var attrClass = obj.objClass.attr('class');
		var name = '';
		for(var i = 0 ; i < obj.result.data.length; i++){
			if(obj.result.data[i].name.indexOf('.') != -1){
				name = obj.result.data[i].name.split('.')[0];
			}else {
				name = obj.result.data[i].name;
			}
			
			var $li = $('<li>').attr('_id',obj.result.data[i]._id).attr('_name',name).addClass('box');
			if(attrClass.indexOf('slt') != -1){
				$li.addClass('slt');
				
				if(obj.result.data[i].type){
					$li.appendTo(obj.appendParentI);
					var $div = $('<div>').attr('class','fl ico folder').appendTo($li);
					var $span = $('<span>').attr('class','fl text').html(name).appendTo($li); 
				}else {
					
					$li.addClass('rests').appendTo(obj.appendParentII);
					var $div = $('<div class="ico top"></div>').appendTo($li);
					
					if(obj.result.data[i].mimetype.indexOf('image') != -1){
						var $img = $('<img>').addClass('img').attr('src','/'+obj.result.data[i].path).appendTo($div);
					}
					
					var $bottom = $('<div class="bottom"></div>').appendTo($li);
					var $spanI = $('<span>').attr('class','fl ico image-bg').appendTo($bottom);
					var $spanII = $('<span>').attr('class','fl text').html(name).appendTo($bottom);
				}
				
				var $check = $('<div>').attr('class','ico check').appendTo($li);
				
				$check.on('mousedown',function(){
					return false;
				})
				
				$check.on('mouseup',function(){
					return false;
				})
				
				$check.on('click',function(){
					liCheck($(this));
					return false;
				})
				
			}else {
				$li.addClass('lb');
				if(obj.result.data[i].type) {
					$li.appendTo(obj.appendParentI);
					className = 'folder';
					var div = '<div class="ico"></div>';
				} else {
					$li.appendTo(obj.appendParentII);
					className = 'image';
					var div = '<img src="/' +  obj.result.data[i].path+'">';
				}
				$li.html(`
					<div class="fl ico check"></div>
					<div class="top">
						<div class="fl ${className}">${ div }</div>
						<span class="fl text">${ name }</span>
						<time class="fr time">
							<span>${ timeI(obj.result.data[i].createTime) }</span>
							<span>${ timeII(obj.result.data[i].createTime) }</span>
						</time>
						<ul class="clearfix fr choice">
							<li class="ico sharebg"></li>
							<li class="ico downloadbg"></li>
							<li class="ico movebg"></li>
							<li class="ico deletebg"></li>
							<li class="ico renamebg"></li>
						</ul>
					</div>
					<div class="foot"></div>
				`)
			}
			
			
			$li.on('mousedown',function(e){
				this.off = true;
				var _this = this;
				document.onmousemove = function(e){
					obj.off = false;
					var len = $('#contentArea .checked').length;
					contentDrag(e,_this,len);
				}
				
				document.onmouseup = function(){
					console.log('拖拽结束')
					document.onmousemove = document.onmouseup = null;
					$('.dragbox').hide();
				}
				
				return false;
			})
			
			
			$li.on('mouseup',function(){
				if($(this).parent().attr('id') == 'content'){
					if(!this.off){
						/*执行移动操作*/
						var checkedId = [];
						var checkedName = []
						$('#contentArea .checked').parent().each(function(){
							if($(this).attr('_id')){
								checkedId.push($(this).attr('_id'));
							}
							if($(this).attr('_name')){
								checkedName.push($(this).attr('_name'));
							}
						})
						var targetId = $(this).attr('_id');
						WeiYun.drags(checkedId,checkedName,targetId);
					}
				} else {
					if(!this.off){
						$('#head-tips').addClass('fail').show().html('无法将选中文件移动到该目录下');
						setTimeout(function(){
							$('#head-tips').hide();
						},2000);
					}
					this.off = null;
				}
				document.onmousemove = null;
				$('.dragbox').hide();			
				return false;
			})
			
			
			$li.on('click',function(){
				if($(this).parent().attr('id') == 'content'){
					if(this.off){
						WeiYun.currentId = $(this).attr('_id');
						WeiYun.crumbsList();
						WeiYun.renderMainList();
					}
				}else {
					console.log('我不是文件夹');
				}
				
				this.onmousemove = null;
			});
		}
		
		if(attrClass.indexOf('lb') != -1){
			lbCheck();
		}
		
		
		WeiYun.currentChenkedCount = 0;
		hide();
	}
}

//单个盒子的选中取消事件函数
//@param ev [object] 事件对象
//@param obj [element] 当前选中的元素
//@return undefined
function liCheck(obj){
	if(obj.attr('class').indexOf('checked') == -1){
		WeiYun.currentChenkedCount++;
		checkShow(obj);
	}else {
		WeiYun.currentChenkedCount--;
		checkHide(obj);
	}
}

//当是列表的时候,单个盒子的选中事件
function lbCheck(){
	var checkList = $('#contentArea .check');
	for(var i=0; i< checkList.length; i++){
		checkList[i].onclick = function(e){
			liCheck($(this));
			e.cancelBubble = true;
		}
		checkList[i].onmousedown = function(e){
			e.cancelBubble = true;
		}
		checkList[i].onmouseup = function(e){
			e.cancelBubble = true;
		}
	}
	
}

//面包屑导航内容函数
function crumbsBox(obj){
	if(typeof obj == 'object'){
		for(var i = 0; i < obj.result.data.length; i++){
			var $li = $('<li>').addClass('list').appendTo(obj.appendParent);
			var $span = $('<span>').addClass('ico').appendTo($li);
			var $name = $('<span>').addClass('text').addClass('name').html(obj.result.data[i].name).attr('_id',obj.result.data[i]._id).appendTo($li);
			
			$name.on('mouseup',function(){ //阻止冒泡
				return false;
			})
			
			if(i == obj.result.data.length-1 ) {
				$name.removeClass('text');
				$name.onclick = null;
			}
			
			$name.on('click',function(){
				WeiYun.currentId = $(this).attr('_id');
				WeiYun.crumbsList();
				WeiYun.renderMainList();
			});
		}
		
		if(!$name){
			$('#wy').attr('class','fl list wy');
		} else {
			$('#wy').attr('class','fl list wy text');
		}
	}
}

//选中显示的通用内容 
//@param obj 当前选择的元素
function checkShow(obj){
	obj.addClass('checked');
	obj.parent().addClass('hover');
	show();
}

//取消隐藏的通用函数
//@param obj 当前选择的元素
function checkHide(obj){
	obj.removeClass('checked');
	obj.parent().removeClass('hover');
	hide();
}

//框选选中
//@param obj 当前选择的项
function selectedList(obj){
	WeiYun.currentChenkedCount++;
	createClassView(obj,'hover');
	show();
}

//取消的项
//@param obj 当前选择的项
function cancelList(obj){
	WeiYun.currentChenkedCount--;
	removeClassView(obj,'hover');
	hide()
}
//显示内容
function show(){
	$('#navigation').show();
	$('#checkednum').html(WeiYun.currentChenkedCount);
	//判断是否全选
	if(WeiYun.currentChenkedCount == WeiYun.currentCount && WeiYun.currentCount != 0){
		$('#checkAll .ico').addClass('checked');
	}
}
//取消内容
function hide(){
	$('#checkednum').html(WeiYun.currentChenkedCount);
	if(WeiYun.currentChenkedCount != WeiYun.currentCount){
		$('#checkAll .ico').removeClass('checked');
	}
	if(WeiYun.currentChenkedCount == 0){
		$('#navigation').hide();
	}
}

//新建文件夹
function createfile(){
	if(WeiYun.currentCount == 0){
		$('#contentbg').hide();
		$('#contentArea').show();
	}
	$li = $('<li>').attr('_id',WeiYun.currentId).addClass('box').appendTo($('#content'));
	if($('#contentlist').attr('class').indexOf('slt') != -1){
		$li.addClass('slt');
		$li.html('<div class="fl ico folder"></div><input type="text" class="fl input" value="" /><div class="ico check"></div>');
	}else {
		$li.addClass('lb');
		$li.html(`<div class="fl ico check"></div>
				<div class="top">
				<div class="fl folder">
					<div class="ico"></div>
				</div>
				<input type="text" class="fl input" value="" />
					<ul class="clearfix fr choice">
						<li class="ico sharebg"></li>
						<li class="ico downloadbg"></li>
						<li class="ico movebg"></li>
						<li class="ico deletebg"></li>
						<li class="ico renamebg"></li>
					</ul>
				</div>
				<div class="foot"></div>`);
	}
	$('#content input').focus();
	$('#content input').on('mousedown',function(){
		return false;
	})
	$('#content input').on('blur',function(){
		if ($(this).val() == 0) {
        	WeiYun.renderMainList();
	   } else {
	       WeiYun.createfile($(this));
	    }
	})
}

//重命名的事件函数
function renameObj(){
	var $this = $('#contentArea .checked')
	if($this.length ==1){
		var $input = $('<input type="text" class="fl input" />');
		if($('#contentlist').attr('class').indexOf('slt') !=-1 && $('#content .checked').length != 0){
				var $text = $this.parent()[0].children[1];
				$this.parent()[0].replaceChild($input[0],$text);
			
		}else {
			var $text = $this.parent()[0].children[1].children[1];
			$this.parent()[0].children[1].replaceChild($input[0],$text);
		}
		$input.val($text.innerHTML);
		$input.focus();
		$input.on('mouseup',function(){
			return false;
		})
		$input.on('blur',function(){
			if($(this).val() == '' || $(this).val() == $text.innerHTML){
				WeiYun.renderMainList();
				WeiYun.currentChenkedCount--;
				checkHide($('#contentArea .checked'));
			}else {
				id = $('#contentArea .checked').parent().attr('_id');
				console.log(id);
				WeiYun.renames({
					id:id,
					name:$(this).val(),
					$input:$input,
					checked:$('#contentArea .checked')
				});
			}
		})
		
		//阻止冒泡
		$input.on('click',function(e){
			return false;
		})
		$input.on('mousedown',function(e){
			return false;
		})
	}else {
		$('#head-tips').show().html('只能对单个文件重命名');
		setTimeout(function(){
			$('#head-tips').hide();
		},2000)
	}
}

/*框选事件*/
function contentSelection(ev){
	var H = $('.header')[0].offsetHeight;
	var W = $('.wrapcontent .nav')[0].offsetWidth;
	
	if($('#contentArea input').length !=0){
		$('#contentArea input').blur();
		return ;
	}
	
	if(ev.clientX > W && ev.clientY > H){
		WeiYun.currentChenkedCount = 0;
		checkHide($('#contentArea .check'));
		var $div = $('<div class="rect-box"></div').appendTo($('#contentlist'));
		var divX = ev.clientX;
		var divY = ev.clientY;
		var lists = $('#contentArea .box');
		document.onmousemove = function(e){
			var w = Math.abs(e.clientX - divX);
			var h = Math.abs(e.clientY - divY);
			var l = Math.min(divX,e.clientX);
			var t = Math.min(divY,e.clientY);

			$div.css({
				left: l - W,
				top: t - H,
				width: w,
				height: h
			})
			
			for(var i = 0 ; i < WeiYun.currentCount ; i++){
				var ele = lists[i].getBoundingClientRect();
				if($('#contentlist').attr('class').indexOf('slt') != -1){
					if(l+w >= ele.left && l <= ele.right && t+h >= ele.top && t <= ele.bottom){
						if(lists[i].getAttribute('class').indexOf('hover') == -1){
							createClassView(lists[i].children[2],'checked');
							selectedList(lists[i]);
						}
					}else{
						if(lists[i].getAttribute('class').indexOf('hover') != -1){
							removeClassView(lists[i].children[2],'checked');
							cancelList(lists[i])
						}
					}
				}else {
					if(t+h >= ele.top && t <= ele.bottom){
						if(lists[i].getAttribute('class').indexOf('hover') == -1){
							createClassView(lists[i].children[0],'checked');
							selectedList(lists[i]);
						}
					}else {
						if(lists[i].getAttribute('class').indexOf('hover') != -1){
							removeClassView(lists[i].children[0],'checked');
							cancelList(lists[i])
						}
					}
				}
			}
		}
		
		document.onmouseup = function(){
			document.onmousemove = document.onmouseup = null;
			$('.rect-box')[0].parentNode.removeChild($('.rect-box')[0]);
		}
	}
}

/*拖拽的函数*/
function contentDrag(ev,obj,len){
	var n = 0;
	if($('#contentlist').attr('class').indexOf('slt') != -1){
		n =2;
	}else {
		n = 0;
	}
	var thisCss = seekClassView(obj.children[n]);
	if(thisCss.indexOf('checked') == -1){
		for(var i = len-1 ; i >=0 ; i--){
			removeClassView($('#contentArea .checked')[i].parentNode,'hover');
			removeClassView($('#contentArea .checked')[i],'checked');
			WeiYun.currentChenkedCount--;
		}
		createClassView(obj.children[n],'checked');
		selectedList(obj);
		
	}
	console.log('拖拽中的mousemove事件');
	$('.dragbox').show().css({
		left:ev.clientX + 15,
		top: ev.clientY + 15
	}).html($('#contentArea .checked').length);
	
}

/*弹出层删除内容渲染*/
function deleteHtml(){
	var con = '';
	if($('#contentArea .checked').length == 1){
		con = '确定要删除该文件吗?';
	}else {
		con = '确定要删除这些文件吗？';
	}
	var html = '';
	html = `<div>
				<div class="icon"></div>
				<div class="text">
					<p class="text-top">${con}</p>
					
				</div>
			</div>`;
	return html;
}
//<p class="text-bottom">已删除的文件可以在回收站找到</p>
/*弹出层上传头部内容渲染*/
function uploadingTop(obj){
	var fileLength = obj.files.length;
	var type = obj.files[0].type.split('/')[0];
	console.log(type);
	if(fileLength == 1){
		state = 'none';
	} else {
		state = 'block';
	}
	var html = '';
	html = `<div class="ico ${type}"></div>
			<div class="text">
				<div class="fl name">${ obj.files[0].name }</div>
				<div class="fl describe" style="display:${ state }">等<span>${fileLength}</span>个文件</div>
			</div>`;
			
	return html;
}
/*弹出层上传内容渲染*/
function uploadingHtml(){
	var html = '';
	var texts = '微云';
	$('#crumbslists .name').each(function(){
		texts += '/'+ $(this).html();
	})
	html = `<div class="title">
				<div class="fl title-left">
					<span class="fl">上传到：</span>
					<span class="fl uploading-nav">${texts}</span>
				</div>
				<div class="fr title-right">修改</div>
			</div>`;
	
	return html;
}

/*移动到回收站*/
function moveToRecycleBin(){
	var checkedId = [];
	$('#contentArea .checked').parent().each(function(){
		if($(this).attr('_id')){
			checkedId.push($(this).attr('_id'));
		}
	})
	console.log(checkedId);
	WeiYun.remove(checkedId);
}

/*删除操作*/
//function removeBtn(){
//	var checkedId = [];
//	$('#contentArea .checked').parent().each(function(){
//		if($(this).attr('_id')){
//			checkedId.push($(this).attr('_id'));
//		}
//	})
//	console.log(checkedId);
//	WeiYun.remove(checkedId);
//	$('.tipsbg').css('display','none');
//}

/*上传的事件*/
function fileFun(n,obj){
	if(!n){
		return;
	}
	if(obj.val()){
		$('.tipsbg').css('display','flex').attr('_id','uploading');
		$('.tipsbg #headtitle').html('上传文件');
		$('.tipsbg .top').show().html(uploadingTop(obj[0]));
		$('.tipsbg .foot').show();
		$('.tipsbg .content').addClass('uploading').html(uploadingHtml());
	}
}