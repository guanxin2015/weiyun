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
		for(var i = 0 ; i < obj.result.data.length; i++){
			var $li = $('<li>').attr('_id',obj.result.data[i]._id).attr('_name',obj.result.data[i].name).addClass('box').appendTo(obj.appendParent);
			if(attrClass.indexOf('slt') != -1){
				$li.addClass('slt');
				var $div = $('<div>').attr('class','fl ico folder').appendTo($li);
				var $span = $('<span>').attr('class','fl text').html(obj.result.data[i].name).appendTo($li);
				var $check = $('<div>').attr('class','ico check').appendTo($li);
				$check.on('mousedown',function(){
					return false;
				})
				$check.on('click',function(e){
					liCheck($(this));
					return false;
				})
			}else {
				$li.addClass('lb');
				$li.html(`
					<div class="top">
						<div class="fl ico check"></div>
						<div class="fl ico folder"></div>
						<span class="fl text">${ obj.result.data[i].name }</span>
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
			$li.on('click',function(){
				WeiYun.currentId = $(this).attr('_id');
				WeiYun.crumbsList();
				WeiYun.renderMainList();
			});
		}
		
		if(attrClass.indexOf('lb') != -1){
			lbCheck();
		}
	}
}

//单个盒子的选中取消事件函数
//@pamar ev [object] 事件对象
//@pamar obj [element] 当前选中的元素
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
	var checkList = $('#content .check');
	for(var i=0; i< checkList.length; i++){
		checkList[i].onclick = function(e){
			liCheck($(this));
			e.cancelBubble = true;
		}
		checkList[i].onmousedown = function(e){
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
			var $name = $('<span>').addClass('text').html(obj.result.data[i].name).attr('_id',obj.result.data[i]._id).appendTo($li);
			
			if(i == obj.result.data.length-1 ) {
				$name.attr('class','');
				$name.onclick = null;
			}
			
			$name.on('click',function(){
				WeiYun.currentId = $(this).attr('_id');
				WeiYun.crumbsList();
				WeiYun.renderMainList();
			});
		}
	}
}

//选中显示的通用内容 
//@pamar obj 当前选择的元素
function checkShow(obj){
	obj.addClass('checked');
	obj.parent().addClass('hover');
	$('#navigation').show();
	$('#checkednum').html(WeiYun.currentChenkedCount);
	//判断是否全选
	if(WeiYun.currentChenkedCount == WeiYun.currentCount && WeiYun.currentCount != 0){
		$('#checkAll .ico').addClass('checked');
	}
}

//取消隐藏的通用函数
//@pamar obj 当前选择的元素
function checkHide(obj){
	obj.removeClass('checked');
	obj.parent().removeClass('hover');
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
		$('#content').show();
	}
	$li = $('<li>').attr('_id',WeiYun.currentId).addClass('box').appendTo($('#content'));
	if($('#contentlist').attr('class').indexOf('slt') != -1){
		$li.addClass('slt');
		$li.html('<div class="fl ico folder"></div><input type="text" class="fl input" value="" /><div class="ico check"></div>');
	}else {
		$li.addClass('lb');
		$li.html('<div class="top">'+
				'<div class="fl ico check"></div>'+
				'<div class="fl ico folder"></div>'+
				'<input type="text" class="fl input" value="" />'+
				'<ul class="clearfix fr choice">'+
					'<li class="ico sharebg"></li>'+
					'<li class="ico downloadbg"></li>'+
					'<li class="ico movebg"></li>'+
					'<li class="ico deletebg"></li>'+
					'<li class="ico renamebg"></li>'+
				'</ul>'+
			'</div>'+
			'<div class="foot"></div>');
	}
	$('#content input').focus();
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
	if($('#content .checked').length ==1){
		var $input = $('<input type="text" class="fl input" />');
		var n = 0;
		if($('#contentlist').attr('class').indexOf('slt') !=-1){
			n = 1;
		}else {
			n =2;
		}
		var $text = $('#content .checked').parent()[0].children[n];
		$input.val($text.innerHTML);
		$('#content .checked').parent()[0].replaceChild($input[0],$text);
		$input.focus();
		
		//阻止冒泡
		$input.on('click',function(e){
			return false;
		})
		
		$input.on('blur',function(){
			if($(this).val() == '' || $(this).val() == $text.innerHTML){
				WeiYun.renderMainList();
				WeiYun.currentChenkedCount--;
				checkHide($('#content .checked'));
			}else {
				if($('#contentlist').attr('class').indexOf('slt') !=-1){
					id = $('#content .checked').parent().attr('_id');
				}else {
					id = $('#content .checked').parent().parent().attr('_id');
				}
				console.log(id);
				WeiYun.renames({
					id:id,
					name:$(this).val(),
					$input:$input,
					checked:$('#content .checked')
				});
			}
		})
	}else {
		$('#head-tips').show().html('只能对单个文件重命名');
		setTimeout(function(){
			$('#head-tips').hide();
		},2000)
	}
}
