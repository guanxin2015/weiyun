/**
 * Created by 毅 on 2016/9/5.
 */

function Tree(data) {
    this.data = data;
}

Tree.prototype.get = function(id) {
    var info = null;
    for (var i=0; i<this.data.length; i++) {
        if (this.data[i]._id.toString() == id) {
            info = this.data[i];
            break;
        }
    }
    return info;
};

Tree.prototype.getParent = function(id) {
    var info = this.get(id);
    var parent = null;
    if (info && info.pid) {
        parent = this.get(info.pid);
    }
    return parent;
};

Tree.prototype.getParents = function(id) {
    var parents = [];
    var parent = this.getParent(id);

    if (parent) {
        parents.unshift(parent);
        parents = this.getParents(parent._id).concat( parents );
    }

    return parents;
};

Tree.prototype.getList = function(pid, type) {
    var data = [];
    
    if(pid === null){
    	pid = 'null';
    }
    
    for (var i=0; i<this.data.length; i++) {
//	console.log(String(this.data[i].pid) ,pid, String(this.data[i].pid) == pid)
  	//console.log(this.data[i].isRecycleBin, false, this.data[i].isRecycleBin == false)
        if ( String(this.data[i].pid) == pid && this.data[i].isRecycleBin == false ) {
			
            if (type === undefined) {
                data.push(this.data[i]);
            } else {
                type = Boolean(type);
                if ( this.data[i].type === type ) {
                    data.push(this.data[i]);
                }
            }
        }
    }
//  console.log(data);
    
    return data;
};

Tree.prototype.getLists = function(pid) {
    var data = [];
    
    if(pid === null){
    	pid = 'null';
    }
    
    for (var i=0; i<this.data.length; i++) {
    	
        if ( String(this.data[i].pid) == pid && this.data[i].isRecycleBin == false ) {
			data.push(this.data[i]);
            
        }
    }
//  console.log(data);
    return data;
};

Tree.prototype.getChildren = function(id, level) {
    var list = this.getList(id);
    var level = level || 0;
    var children = [];
    for (var i=0; i<list.length; i++) {
        list[i] = list[i].toObject();
        list[i].level = level;
        children.push( list[i] );
        children = children.concat( this.getChildren( list[i]._id.toString(), level+1 ) );
    }
    return children;
};

Tree.prototype.isChild = function(id, targetId, deepIn) {
    var children = deepIn ? this.getChildren(id) : this.getList(id);
    for (var i=0; i<children.length; i++) {
        if ( targetId.toString() == children[i]._id.toString() ) {
            return true;
        }
    }
    return false;
};

Tree.prototype.samenameDirInList = function(id, name) {
    var list = this.getList(id);
    for (var i=0; i<list.length; i++) {
        if ( list[i].type && list[i].name == name ) {
            return true;
        }
    }
    return false;
};

Tree.prototype.getRecycleBinList = function() {
    var data = [];
    for (var i=0; i<this.data.length; i++) {
        if ( this.data[i].isRecycleBin == true ) {
            data.push(this.data[i]);
        }
    }
    return data;
};

Tree.prototype.getImage = function(){
	var data = [];
	for(var i = 0 ; i < this.data.length; i++){
		if(this.data[i].mimetype && this.data[i].isRecycleBin == false && this.data[i].mimetype.indexOf('image') != -1){
			data.push(this.data[i]);
		}
	}
	return data;
}

Tree.prototype.getVideo = function(){
	var data = [];
	for(var i = 0 ; i < this.data.length; i++){
		if(this.data[i].mimetype && this.data[i].isRecycleBin == false && this.data[i].mimetype.indexOf('video') != -1){
			data.push(this.data[i]);
		}
	}
	return data;
}

Tree.prototype.getAudio = function(){
	var data = [];
	for(var i = 0 ; i < this.data.length; i++){
		if(this.data[i].mimetype && this.data[i].isRecycleBin == false && this.data[i].mimetype.indexOf('audio') != -1){
			data.push(this.data[i]);
		}
	}
	return data;
}

Tree.prototype.rename = function(id, newname) {
    var file = this.get(id);
    if (!file) {
        return false;
    }
    var children = this.getList(file.pid.toString());

    for (var i=0; i<children.length; i++) {
        if ( children[i].id != id && children[i].type == file.type && children[i].name == newname ) {
            return false;
        }
    }

    file.name = newname;

    return file;

};


module.exports = Tree;