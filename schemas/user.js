/**
 * Created by 毅 on 2016/9/5.
 */

var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    //用户名
    username: String,
    //密码
    password: String
});