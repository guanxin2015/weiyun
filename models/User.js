/**
 * Created by 毅 on 2016/9/5.
 */

var mongoose = require('mongoose');
var userSchema = require('../schemas/user');

module.exports = mongoose.model('User', userSchema);