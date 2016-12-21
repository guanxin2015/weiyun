//查找当前元素class名的函数
//@param obj 当前元素
//return array 当前元素的class名集合
function seekClassView(obj){
	return  obj.getAttribute('class').split(' ');
}

//设置当前元素的class名
//@param obj[boject] 当前元素
//@param name [string] class名
function setClassView(obj,name){
	obj.setAttribute('class',name);
}

//给元素添加class名
//@param obj 需要改变class名的元素
//param name 需要写入的class名称
//return undefined
function createClassView(obj,name){
	var arr = seekClassView(obj);
	//console.log(seekClassView(obj))
	if(arr.length){
		if(arr.indexOf(name) == -1){
			arr.push(name);
			obj.className = arr.join(' ');
		}else{
			obj.className = arr.join(' ');
		}
	}else{
		arr.push(name);
		obj.className = arr.join(' ');
	}
	//console.log(seekClassView(obj))
}


//取消元素的class名
//@param obj 需要改变class名的元素
//@param name 需要删除的class名
function removeClassView(obj,name){
	var arr = seekClassView(obj);
	if(arr.indexOf(name) != -1){
		arr.splice(arr.indexOf(name),1);
	}
	//console.log(arr);
	obj.className = arr.join(' ');
}

//全选的状态函数
//@param status [布尔值] 当前的状态
//return undefined
function setCheckAll(status){
	checkAll.checked = status;
	checkAll.className = status ? 'checkAllII' : 'checkAllI';
}

//判断是否全选的函数
function ifSetCheckAll(){
	if(currentElements.length){
		if(currentElements.length == currentChecked.length){
			setCheckAll(true);
		}else{
			setCheckAll(false);
		}
	}
}

//查找选中项在数组中的位置
//@param obj [object] 传入需要查找的元素
//@return number 元素在数组中的下标
function checkedIndex(obj){
	for(var i = 0 ; i < currentChecked.length ; i++){
		if(currentChecked[i] == obj){
			return i;
		}
	}
}
//获取年月日的时间函数
function timeI(t){
	var time = new Date(t);
	var year = time.getFullYear();
	var month = (time.getMonth()+1) <10 ? '0'+ (time.getMonth()+1) : time.getMonth()+1;
	var dates = time.getDate() < 10 ? '0'+time.getDate() : time.getDate();
	return year + '-' + month +'-'+ dates;
}
//获取小时，分的时间函数
function timeII(t){
	var time = new Date(t);
	var hours = time.getHours() < 10? '0'+ time.getHours() : time.getHours();
	var minutes = time.getMinutes() <10 ? '0'+time.getMinutes() : time.getMinutes();
	return hours + ':' + minutes;
}


/*获取当前的元素的子集*/
function getChild(obj,pid){
	var data = [];
	if(obj.length){
		for(var i = 0; i< obj.length; i++){
			if(obj[i].getAttribute('_pid') == pid){
				data.push(obj[i]);
			}
		}
	}
	return data;
}

/*获取所有的子集*/
function getChildren(obj,id){
	var list = getChild(obj,id);
	var level = level || null;
	var children = [];
	if(list.length){
		for(var i = 0; i< list.length; i++){
			children.push(list[i]);
			children = children.concat(getChildren(obj,list[i].getAttribute('_id')))
		}
	}
	return children;
}

/*获取当前父级*/
function getParent(obj,pid) {
    var parent = null;
    for(var i=0; i< obj.length; i++){
    	if(obj[i].getAttribute('_id') == pid){
    		return parent = obj[i];
    	}
    }
}

/*获取所有父级*/
function getParents(obj,pid){
	var parents = [];
	var parent = getParent(obj,pid);
	if(parent){
		parents = parents.concat(getParents(obj,parent.getAttribute('_pid')));
		parents.push(parent);
	}
	return parents;
}
