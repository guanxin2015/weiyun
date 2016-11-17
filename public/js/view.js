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
	a.on('mouseover',function(){
		clearTimeout(timer);
		b.addClass('hover');
	})
	
	//移出事件
	a.on('mouseout',function(){
		timer = setTimeout(function(){
			b.removeClass('hover');
		},100)
	})
	
	//移入显示内容的事件
	c.on('mouseover',function(){
		clearTimeout(timer);
	})
	
	//移出显示内容的事件
	c.on('mouseout',function(){
		timer = setTimeout(function(){
			b.removeClass('hover');
		},100)
	})
}

//排序函数
//@param obj [变量] 发生变化的元素
//@return undefined
function arrayList(obj){
	removeClass(obj);
	var Id = obj.getAttribute('id');
	var crumbsClass = 'crumbs' + ' ' + Id;
	var contentlistClass = 'contentlist'+' '+Id;
	$('#crumbs')[0].setAttribute('class',crumbsClass);
	$('#contentlist')[0].setAttribute('class',contentlistClass);
}

//给当前元素设置某个class名
//@param obj [变量] 发生变化的元素
//@return undefined
function removeClass(obj){
	var childrens = obj.parentNode.children;
	for(var i = 0 ; i < childrens.length; i++){
		removeClassView(childrens[i],'bg');
	}
	createClassView(obj,'bg');
}
