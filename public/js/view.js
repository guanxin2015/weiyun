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
	if(h > T +10 ){
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

/*hash影响页面的函数*/
function hashChange(){
	var pahash = window.location.hash.split('=')[1];
	var ID = ''
	$('.navcontent .list').removeClass('checked').each(function(){
		if($(this).attr('id') == pahash){
			$(this).addClass('checked');
			ID = $(this).attr('id');
		}
		
	});
	$('.wrapBox').attr('class','wrapBox ' + ID);
	
	switch(ID){
		case 'recycle':
			navChange($('#lb')[0],'lb');
			WeiYun.renderRecycleBinList();
			break;
			
		case 'all':
			WeiYun.renderMainList();
			break;
		
		case 'album':
			navChange($('#slt')[0],'slt');
			WeiYun.applyImage();
			break;
			
		case 'video' :
			navChange($('#lb')[0],'lb');
			WeiYun.applyVideo();
			break;
			
		case 'audio' :
			navChange($('#lb')[0],'lb');
			WeiYun.applyAudio();
			break;
	};
}


//左侧切换通用函数
function navChange(obj,crumbsClass){
	setClass(obj);
	$('#crumbs').attr('class','crumbs ' + crumbsClass);
	$('#contentlist').attr('class','contentlist ' + crumbsClass);
}
/*********************页面渲染部分******************************/
/*渲染页面的函数*/
//@param obj [object] 
//@return undefined
function romance(obj){
	if(typeof obj == 'object'){
		hashChange();
		var attrClass = obj.objClass.attr('class');
		var name = '';
		var className = '';
		var Oname = '';
		
		for(var i = 0 ; i < obj.result.data.length; i++){
			if(obj.result.data[i].name.indexOf('.') != -1){
				name = obj.result.data[i].name.split('.')[0];
			}else {
				name = obj.result.data[i].name;
			}
			
			Oname = name.length > 10 ? name.slice(0,10) + '...' : name;
			
			var $li = $('<li>').attr('_id',obj.result.data[i]._id).attr('_name',name).addClass('box');
			
			if(attrClass.indexOf('slt') != -1){
				
				$li.addClass('slt');
				if(obj.result.data[i].type){
					
					$li.appendTo(obj.appendParentI);
					var $div = $('<div>').attr('class','fl ico folder').appendTo($li);
					var $span = $('<span>').attr('class','fl text').html(Oname).appendTo($li); 
					
				}else {
					var type = obj.result.data[i].mimetype.split('/')[0];
					$li.attr('_type',type).addClass('rests').appendTo(obj.appendParentII);
					var $div = $('<div class="top"></div>').appendTo($li);
					
					if(type == 'image'){
						var $img = $('<img>').addClass('img').attr('src','/'+obj.result.data[i].path).appendTo($div);
					}else {
						var $ico = $('<div class="ico '+ type +'"></div>').appendTo($div);
					}
					var $bottom = $('<div class="bottom"></div>').appendTo($li);
					var $spanI = $('<span>').attr('class','fl ico '+type+'-bg').appendTo($bottom);
					var $spanII = $('<span>').attr('class','fl text').html(Oname).appendTo($bottom);
					
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
					var type = obj.result.data[i].mimetype.split('/')[0];
					if(type == 'image'){
						className = 'image';
						var div = '<img src="/' +  obj.result.data[i].path+'">';
					}else {
						className = type;
						var div = '<div class="ico"></div>';
					}
					
				}
				
				$li.html(`
					<div class="fl ico check"></div>
					<div class="top">
						<div class="fl ${className}">${ div }</div>
						<span class="fl text">${ Oname }</span>
						<time class="fr time">
							<span>${ timeI(obj.result.data[i].createTime) }</span>
							<span>${ timeII(obj.result.data[i].createTime) }</span>
						</time>
					</div>
					<ul class="clearfix fr choice">
						<li class="ico movebg"></li>
						<li class="ico deletebg"></li>
						<li class="ico renamebg"></li>
						<li class="ico restorebg "></li>
						<li class="ico obliteratebg"></li>
					</ul>
					<div class="foot"></div>
				`)
			}
			
			
			var hash = window.location.hash.split('=')[1];
			
			if( !hash || hash == 'all'){
				var startL = '';
				var startT = '';
				$li.on('mousedown',function(e){
					WeiYun.keyCode = e.which;
					if(WeiYun.keyCode === 1){
						this.off = true;
						var _this = this;
						startL = e.clientX;
						startT = e.clientY;
						
						document.onmousemove = function(e){
							_this.off = false;
							var len = $('#contentArea .checked').length;
							contentDrag(e,_this,len);
						}
						
						document.onmouseup = function(){
							console.log('li里面的document的onmouseup');
							document.onmousemove = document.onmouseup = null;
							$('.dragbox').hide();
						}
						
						return false;
					}
					
				})
				
				$li.on('mouseup',function(e){
					WeiYun.keyCode = e.which;
					if( WeiYun.keyCode === 1){
						var classHover = $(this).attr('hover');
					
						if(classHover && classHover == 'kx'){
							console.log('我是框选');
							return;
						}
	
						
						if($(this).parent().attr('id') == 'content'){
							var l = Math.abs(e.clientX - startL);
							var t = Math.abs(e.clientY - startT);
							if( l > 20 || t > 20){
								/*执行移动操作*/
								moveBox($(this));
							}
							
						} else {
					
							if(!this.off){
								$('#head-tips').addClass('fail').show().html('无法将选中文件移动到该目录下');
								setTimeout(function(){
									$('#head-tips').hide();
								},2000);
							}
						}
						
						document.onmousemove = null;
						$('.dragbox').hide();
					}
					
				})
				
				
				$li.on('click',function(){
					console.log('li的click')
					if($(this).parent().attr('id') == 'content'){
						if(this.off){
							WeiYun.currentId = $(this).attr('_id');
							WeiYun.crumbsList();
							WeiYun.renderMainList();
						}
					}else {
						if(this.off) {
							$('#contentArea .box').removeClass('hover');
							$('#contentArea .check').removeClass('checked')
							$(this).addClass('hover').children().last().addClass('checked');
							WeiYun.currentChenkedCount = $('#contentArea .checked').length;
							conHide();
							$('.restsbg').css('transform','scale(0)').attr('class','restsbg');
							if($('.restsbox').children().length != 1){
								$('.restsbox').children().last().remove()
							}
							
							var type = $(this).attr('_type');
							
							switch(type) {
								case 'video':
									var $video = $('<video class="video" width="600" controls></video>').appendTo($('.restsbox'));
									restsBg($video,$(this),'video');
									break;
									
								case 'audio':
									var $audio = $('<audio class="audio" controls ></audio>').appendTo($('.restsbox'));
									restsBg($audio,$(this),'audio');
									
									$audio.on('play',function(){
										$('.audiobg').css('animation','5s rotate linear infinite');
									})
									$audio.on('pause',function(){
										$('.audiobg').css('animation','');
									})
									break;
									
								case 'image':
									var $img = $('<img class="img" />').appendTo($('.restsbox'));
									restsBg($img,$(this),'image');
									break;
								
							}
						}
					}
					
					this.onmousemove = null;
				});
			} else{
				
				$li.on('click',function(){
					if(hash == 'album'){
						obj = $(this).children().last();
					} else {
						obj = $(this).children().first();
					}
					liCheck(obj);
					return false;
				});
				
				$li.on('mousedown',function(e){
					return false;
				});
				
				$li.on('mouseup',null);
				
			}
			
			/*li的右键事件*/
			$li.on('contextmenu',function(e){
				if(hash != 'recycle'){
					if($(this).attr('class').indexOf('hover') == -1){
						$('#contentArea .box').removeClass('hover');
						$('#contentArea .check').removeClass('checked')
						$(this).addClass('hover').children().last().addClass('checked');
						WeiYun.currentChenkedCount = $('#contentArea .checked').length;
						conHide();
					}
					
					$('.contextmenu-box').show().css({
						left: e.clientX + 10,
						top: e.clientY + 10
					})
					
					return false;
				}
			})
		}
		
		$('#contentArea').css('top',0);
		$('#contentlist .roll').css('top',0);
		scrollView($('#contentlist'),$('#contentArea'),$('#contentlist .roll-box'),$('#contentlist .roll'));
		
		if(attrClass.indexOf('lb') != -1){
			lbCheck();
			
			$('.choice').on('click',function(e){
				$(this).parent().addClass('hover');
				$(this).parent().children().first().addClass('checked');
				var className = e.target.getAttribute('class').split(' ')[1];
				
				switch(className) {
					case 'movebg':
						moveBtn();
						break;
					case 'deletebg':
						deleteBox();
						break;
						
					case 'renamebg':
						renameObj();
						break;
						
					case 'restorebg':
						restoreBox();
						break;
						
					case 'obliteratebg':
						obliterateBtn();
						break;
				}
				return false;
			});
		}
		
		WeiYun.currentChenkedCount = 0;
		conHide();
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
	} else {
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

//新建文件夹
function createfile(){
	if(WeiYun.currentCount == 0){
		$('#contentbg').hide();
		$('#contentArea').show();
	}
	
	$li = $('<li>').attr('_id',WeiYun.currentId).addClass('box').appendTo($('#content'))
	;
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
				</div>
				<ul class="clearfix fr choice">
					<li class="ico movebg"></li>
					<li class="ico deletebg"></li>
					<li class="ico renamebg"></li>
					<li class="ico restorebg "></li>
					<li class="ico obliteratebg"></li>
				</ul>
				<div class="foot"></div>`
		);
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
		$input.on('mousemove',function(){
			return false;
		})
		$input.on('blur',function(){
			
			if($(this).val() == ''){
				WeiYun.renderMainList();
				WeiYun.currentChenkedCount--;
				checkHide($('#contentArea .checked'));
			}else {
				id = $('#contentArea .checked').parent().attr('_id');
				type = $('#contentArea .checked').parent().attr('_type');
				WeiYun.renames({
					id:id,
					name:$(this).val(),
					type: type,
					$input:$input,
					checked:$('#contentArea .checked')
				});
			}
		})
		
		//阻止冒泡
		$input.on('click',function(){
			return false;
		})
		$input.on('mousedown',function(){
			return false;
		})
	}else {
		$('#head-tips').addClass('fail').show().html('只能对单个文件重命名');
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
		console.log('ddddd');
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
			
			for(var i = 0 ; i < $('#contentlist .box').length ; i++){
				
				var ele = lists[i].getBoundingClientRect();
				if($('#contentlist').attr('class').indexOf('slt') != -1){
					if(l+w >= ele.left && l <= ele.right && t+h >= ele.top && t <= ele.bottom){
						if(lists[i].getAttribute('class').indexOf('hover') == -1){
							createClassView(lists[i].children[2],'checked');
							selectedList(lists[i]);
							lists[i].setAttribute('_hover','kx');
						}
					}else{
						
						if(lists[i].getAttribute('class').indexOf('hover') != -1){
							removeClassView(lists[i].children[2],'checked');
							cancelList(lists[i]);
							lists[i].removeAttribute('_hover');
							
						}
					}
				}else {
					if(t+h >= ele.top && t <= ele.bottom){
						if(lists[i].getAttribute('class').indexOf('hover') == -1){
							createClassView(lists[i].children[0],'checked');
							selectedList(lists[i]);
							lists[i].setAttribute('_hover','kx');
						}
					}else {
						if(lists[i].getAttribute('class').indexOf('hover') != -1){
							removeClassView(lists[i].children[0],'checked');
							cancelList(lists[i]);
							lists[i].removeAttribute('_hover');
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

/*弹出层移动到头部内容渲染*/
function moveTop(){
	var name = $('#contentArea .hover').first().attr('_name');
	var len = $('#contentArea .hover').length;
	var html = '';
	html = `<div class="ico file"></div>
			<div class="text">
				<div class="fl name"> ${name} </div>
				<div class="fl describe">等<span> ${len} </span>个文件</div>
			</div>`;
			
	return html;
}

/*弹出层移动到内容渲染*/
function moveHtml(obj){
	var html = '';
	var list = `<li _id='null' _name="微云" id="tips-wy" class="list children">
					<span class="icon icon-bg fl"></span>
					<span class="icon icon-file fl"></span>
					<span class="fl">微云</span>
				</li>`;
				
	for(var i = 0 ; i < obj.data.length; i++){
		
		if(obj.data[i].type){
			
			if(obj.data[i].pid == null){
				
				list += `<li _id="${obj.data[i]._id}" _name="${obj.data[i].name}" _pid="${obj.data[i].pid}" class="list" style="padding-left:${(obj.data[i].level+1)*20 }px">
						<span class="icon icon-bg fl"></span>
						<span class="icon icon-file fl"></span>
						<span class="fl">${obj.data[i].name}</span>
					</li>`;
					
			} else {
				
				list += `<li _id="${obj.data[i]._id}" _name="${obj.data[i].name}" _pid="${obj.data[i].pid}" class="list" style="padding-left:${(obj.data[i].level+1)*20 }px;display:none">
						<span class="icon icon-bg fl"></span>
						<span class="icon icon-file fl"></span>
						<span class="fl">${obj.data[i].name}</span>
					</li>`;
			}
			
		}
	}
	
	html = `<div class="title">
				<div class="fl title-left">
					<span class="fl">移动到：</span>
					<span class="fl uploading-nav"></span>
				</div>
			</div>
			<div class="listsbox">
				<ul class="lists"> ${list} </ul>
				<div class="roll-box">
					<div class="roll"></div>
				</div>
			</div>`;
	

	$('.tipsbg .content').addClass('file').html(html);
	scrollView($('.tipsbg .listsbox'),$('.tipsbg .lists'),$('.tipsbg .roll-box'),$('.tipsbg .roll'));
	$('.tipsbg .list').on('click',tipsList);
}

/*弹出层列表的点击事件函数*/
function tipsList(){
	var id = $(this).attr('_id');
	var pid = $(this).attr('_pid');
	var children = getChildren($('.tipsbg .list'),id );
	var child = getChild($('.tipsbg .list'),id);
	var parents = getParents($('.tipsbg .list'),pid);
	parents.push(this);
	
	$('.tipsbg .list').removeClass('checked');
	$(this).addClass('checked');
	
	/*头部导航内容*/
	var html = '';
	for(var i=0 ; i<parents.length; i++){
		html += parents[i].getAttribute('_name')+'/';
	}
	$('.uploading-nav').html(html);
	
	/*显示隐藏子集元素*/
	if($(this).attr('class').indexOf('children') == -1){
		
		$(this).addClass('children');
		for(var i = 0; i < child.length; i++){
			child[i].style.display = 'block';
		}
		
	}else {
		
		$(this).removeClass('children');
		for(var i = 0; i < children.length; i++){
			children[i].style.display = 'none';
			if(children[i].getAttribute('class').indexOf('children') != -1){
				children[i].setAttribute('class','list');
			}
		}
		
	}
	
	
	/*判断是否移动到当前文件夹或子文件*/
	if($('#content .hover').attr('_id') == id){
		$('.tipsbg .tips-text').show().html('不能将文件移动到自身或其子文件夹');
		if(children.length){
			for(var i = 0 ; i <children.length; i++){
				children[i].onclick = function(){
					$('.tipsbg .tips-text').show().html('不能将文件移动到自身或其子文件夹');
					$('.tipsbg .yes').css('opacity',.7);
				}
			}
		}
		$('.tipsbg .yes').css('opacity',.7);
	}else {
		$('.tipsbg .tips-text').hide();
		$('.tipsbg .yes').css('opacity',1);
	}
	
	scrollView($('.tipsbg .listsbox'),$('.tipsbg .lists'),$('.tipsbg .roll-box'),$('.tipsbg .roll'));
}

/*移动到内容函数*/
function moveBox(obj){
	var checkedId = [];
	var checkedName = [];
	var checkedType = [];
	$('#contentArea .checked').parent().each(function(){
		if($(this).attr('_id')){
			checkedId.push($(this).attr('_id'));
		}
		if($(this).attr('_name')){
			checkedName.push($(this).attr('_name'));
		}
		if($(this).parent().attr('id') == 'rests'){
			checkedType.push($(this).attr('_type'));
		} else {
			checkedType.push(true);
		}
	})
	var targetId = obj.attr('_id');
	WeiYun.drags(checkedId,checkedName,checkedType,targetId);
}

/*移动到按钮执行的函数*/
function moveBtn(){
	WeiYun.getChildren();
	$('.tipsbg').css('display','flex').attr('_id','move');
	$('.tipsbg #headtitle').html('选择存储位置');
	$('.tipsbg .top').show().html(moveTop());
	$('.tipsbg .foot').hide();
	$('.tipsbg .yes').css('opacity',.7);
	tipsBoxNews();
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
	html = `<div class="clearfix">
				<div class="icon"></div>
				<div class="text">
					<p class="text-top">${con}</p>
					<p class="text-bottom">已删除的文件可以在回收站找到</p>
				</div>
			</div>`;
	return html;
}

/*删除内容函数*/
function deleteBox(){
	$('.tipsbg').css('display','flex').attr('_id','delete');
	$('.tipsbg #headtitle').html('删除文件');
	$('.tipsbg .top').hide();
	$('.tipsbg .foot').hide();
	$('.tipsbg .content').addClass('remove').html(deleteHtml());
	tipsBoxNews();
}

/*从回收站还原*/
function restoreBox(){
	var checkedId = [] ;
	$('#contentlist .checked').parent().each(function(){
		checkedId.push($(this).attr('_id'));
	})
	console.log(checkedId);
	WeiYun.recoveryList(checkedId);
}

/*清空回收站*/
function clearAllHtml(){
	var html = '';
	html = `<div>
				<div class="icon"></div>
				<div class="text">
					<p class="text-top">确定清空回收站吗?</p>
					<p class="text-bottom">清空后将无法找回已删除的文件</p>
				</div>
			</div>`;
	return html;
}

/*弹出层上传头部内容渲染*/
function uploadingTop(obj){
	var fileLength = obj.files.length;
	var type = obj.files[0].type.split('/')[0];
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
	WeiYun.moveToRecycleBin(checkedId);
}

/*删除操作*/
function obliterateBtn(){
	var checkedId = [];
	$('#contentlist .checked').parent().each(function(){
		if($(this).attr('_id')){
			checkedId.push($(this).attr('_id'));
		}
	})
	WeiYun.remove(checkedId);
	$('.tipsbg').css('display','none');
}


/*页面没有文件时显示的内容*/
function empty(obj){
	var html = '',
	html = `<div class="${ obj.bg }"></div>
			<h2 class="text">${ obj.text }</h2>
			<p class="tips">${ obj.p }</p>`;
	
	return html;
}

/*判断是否出现下拉框*/
function scrollView(box,lists,rollBox,roll){
	var listsboxH = parseInt(box.css('height') ); //盒子的高度不变
	var listsH = parseInt(lists.css('height'));  //列表的高度随时变化
	var hScale = listsboxH / listsH;  //盒子的高度比上列表的高度
	
	console.log(listsboxH,listsH);
	
	if(hScale < 0.1){  //判断最小的比例值
		hScale = 0.1    
	}
	
	if(hScale > 1){
		rollBox.hide();
		box[0].onmousewheel = null;
		box[0].addEventListener('DOMMouseScroll',null);
		return;
	}else {
		rollBox.show();
		roll.css({
			height:hScale *listsboxH
		});
		box[0].onmousewheel = funmove;
		box[0].addEventListener('DOMMouseScroll',funmove);
	}
	
	var maxTop = listsboxH - parseInt(roll.css('height'));
	console.log(hScale *listsboxH,roll.css('height'));
	roll.on('mousedown',function(e){
		var t = e.clientY - parseInt($(this).css('top'));
		
		document.onmousemove = function(e){
			var btnT = e.clientY - t;
			setTop(btnT);
		}
		document.onmouseup = function(){
			document.onmousemove = document.onmousemove = null;
		}
		return false;
	})
	
	function setTop(val){
		
		if(val < 0){
			val = 0;
		}else if(val > maxTop){
			val = maxTop;
		}
		
		roll.css('top',val);
		lists.css('top',(listsboxH-listsH)*(val/maxTop));
	}
	
	function funmove(e){
		
		var flag = true;
		var btnT = parseInt(roll.css('top'));
		
		if(e.wheelDelta){
			flag = e.wheelDelta > 0 ? true : false;
		} else {
			flag = e.detail < 0 ? true : false;
		}
		
		if(flag){
			btnT -= 10;
		} else {
			btnT += 10;
		}
		setTop(btnT);
		e.preventDefault();
		return false;
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
	$('#contentArea .checked').each(function(){
		console.log($('#contentArea .checked').length);
		console.log(this.getAttribute('_hover'));
		this.removeAttribute('_hover');
	})
	obj.removeClass('checked');
	obj.parent().removeClass('hover');
	conHide();
	
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
	conHide();
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
function conHide(){
	$('#checkednum').html(WeiYun.currentChenkedCount);
	
	if(WeiYun.currentChenkedCount != WeiYun.currentCount || WeiYun.currentChenkedCount == 0){
		$('#checkAll .ico').removeClass('checked');
	}
	
	if(WeiYun.currentChenkedCount == 0){
		$('#navigation').hide();
	}
}

/*视频/音频/图片弹出层通用*/
function restsBg(obj,target,type){
	$('.restsbg').css('transform','scale(1)').addClass(type);
	WeiYun.getMe(obj,target.attr('_id'));
}

/*ajax返回数据长度为0的通用函数*/
function resultI(){
	$('#contentlist').css('display','flex');
	$('#contentArea').hide();
	$('#content').html('');
	$('#rests').html('');
	conHide();
}

/*ajax返回数据有长度时的通用函数*/
function resultII(){
	$('#contentlist').css('display','block');
	$('#contentbg').hide();
	$('#contentArea').show();
	$('#content').html('');
	$('#rests').html('');
}

/*获取弹出层left\top的函数*/
function tipsBoxNews(){
	var tipsboxNews = $('.tipsbox').get()[0];
	$('.tipsbox').css({
		left: (window.innerWidth - tipsboxNews.offsetWidth)/2,
		top: (window.innerHeight - tipsboxNews.offsetHeight)/2
	})
}
