/**
 * Created by qingpeng.tian on 2016/12/15.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/stu');
/*var db = mongoose.connection
db.on('error', console.error.bind(console, '连接错误：'))
db.once('open', function (callback) {
    console.log('连接成功')
})*/
var classSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    stuId: {
        type: Number,
        require: true
    }
});

var classModel = mongoose.model('students', classSchema);

module.exports = classModel;