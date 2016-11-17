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
