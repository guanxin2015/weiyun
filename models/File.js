/**
 * Created by 毅 on 2016/9/5.
 */

var mongoose = require('mongoose');
var fileSchema = require('../schemas/file');

var File = mongoose.model('File', fileSchema);

module.exports = File;