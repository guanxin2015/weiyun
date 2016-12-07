/**
 * Created by 毅 on 2016/9/5.
 */

// express 模块
var express = require('express');
// 模板引擎模块
var swig = require('swig');
// 数据库模块
var mongoose = require('mongoose');
// post数据处理模块
var bodyParser = require('body-parser');
// cookie模块
var Cookies = require('cookies');
// 创建一个app
var app = express();


// 静态资源托管设置
app.use( '/public', express.static('public') );
app.use( '/data', express.static('data') );

// 创建一个模板引擎，并设置解析方法
app.engine('html', swig.renderFile);
// 设置模板文件存放目录
app.set('views', './views');
// 设置app使用的模板引擎
app.set('view engine', 'html');
// 这是模板引擎的配置参数，不缓存模板，每次访问都重新解析模板，开发中设置为false，上线设置为true
swig.setDefaults({cache: false});

//解析处理post提交过来的数据:urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//处理cookie
app.use(function(req, res, next) {
    req.cookies = new Cookies(req, res);

    //在req对象下增加一个自定义属性，用来保存当前登录的用户的信息
    req.userInfo = {};

    if (req.cookies.get('userInfo')) {
        try {
            var cookieUserInfo = JSON.parse(req.cookies.get('userInfo'));
            req.userInfo = cookieUserInfo;
        } catch(e){}
    }

    next();
})

//拆分模块

//api模块
app.use('/api', require('./modules/api'));
//主模块
app.use('/', require('./modules/main'));


//开启服务（监听）
// 数据库连接地址   
//var url = 'mongodb://127.0.0.1:27018/weiyun';
//localhost  用不了，是因为电脑系统的问题导致的
//27017是数据库的端口
var url = 'mongodb://127.0.0.1:27017/weiyun';
// 当app启动的时候，连接数据库
try {
	mongoose.connect(url);
	//7777是页面的端口，进入页面输入的端口是这个
	app.listen(7777, 'localhost');
	console.log('服务器已经开启成功');
}catch(e) {
	console.log(e)
}




