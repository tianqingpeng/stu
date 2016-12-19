var express = require('express');
var router = express.Router();
var async = require('async');
var classModel = require('./db');

router.get('/', function (req,res) {
    res.render('index',{});
});
router.post('/', function (req,res){
   classModel.count({name: req.body.name,stuId: req.body.stuId}, function(err,counts) {
       errorInfo(err);
       if(counts == 1) {
           //console.log(counts);
           res.redirect('/home');
       } else {
           res.redirect('/');
       }
   });
});

router.get('/home', function (req,res,next) {
    //console.log(req.query.page);
    var page = req.query.page;
    if(page < 1) {
        page = 1;
    } else {
        page = req.query.page || 1;
    }
    pageQuery(page, 3, classModel, {}, {
        created_time: 'desc'
    }, function(error, $page){
        if(error){
            next(error);
        }else{
            res.render("home",{
                records: $page.results,          //据数总数
                pageCount: $page.pageCount,     //分页数
                page: $page.pageNumber           //当前页数
            });
        }
    });
});

router.get('/addStu', function (req,res,next) {
    res.render('addStu', {});
});
router.post('/addStu', function (req,res,next) {
    var name = req.body.name,
        stuId = req.body.stuId,
        newStu = [];
    if(name === "" || stuId === "") {
        console.log("名字和编号不能为空!");
        res.redirect('/home');
    } else if(!typeof (stuId)){
        console.log("编号为数字!");
        res.redirect('/home');
    } else {
        newStu.push({name: name, stuId: stuId});
        classModel.create(newStu, function(err,results) {
            errorInfo(err);
            res.redirect('/home');
        });
    }
});

router.get('/delStu', function (req,res,next) {
    classModel.find({},function(err,results) {
        errorInfo();
        res.render('delStu', {result: results});
    });
});
router.post('/delStu', function(req,res,next) {
    console.log(req.body.stu_id);
    classModel.remove({_id: req.body.stu_id}, function(err,results){
        errorInfo(err);
        res.redirect('/home');
    });
});

router.get('/editStu', function (req,res,next) {
    classModel.find({}, function (err,results) {
        errorInfo(err);
        res.render("editStu", {result: results});
    });
});
router.post('/editStu', function (req,res,next) {
    console.log(req.body.stu_id);
    var num = req.body.num;
        condition = {_id: req.body.stu_id[num]},
        query = {$set: {name: req.body.name[num], stuId: req.body.stuId[num]}};
    classModel.update(condition, query, function (err,results) {
        errorInfo();
        res.redirect('/home');
    });
});

router.get('/search', function (req,res,next) {
    res.render('search', {result: null});
});
router.post('/search', function (req,res,next) {
    var search_type = req.body.search_type,
        keyWord = req.body.keyword;
    if(search_type == 0){
        findInfo({name: keyWord}, res);
    } else {
        findInfo({stuId: keyWord},res);
    }
});

function errorInfo(err){
    if(err){
        console.log(err);
        return;
    }
}
function findInfo(condition,res){
    return classModel.find(condition, function (err, result) {
        if(err) {
            console.log(err);
            return;
        }
        res.render('search', {result: result});
    });
}

/**
 *
 * @param page   当前页
 * @param pageSize  每页显示的数据
 * @param Model     定义的模型
 * @param queryParams  查询的条件
 * @param sortParams   排序的条件
 * @param callback   回调操作
 */
function pageQuery(page, pageSize, Model, queryParams, sortParams, callback){
    var start = (page - 1) * pageSize;
    var $page = {
        pageNumber: page
    };
    async.parallel({
        count: function (done) {  // 查询数量
            Model.count(queryParams).exec(function (err, count) {
                done(err, count);
            });
        },
        records: function (done) {   // 查询一页的记录
            Model.find(queryParams).skip(start).limit(pageSize).sort(sortParams).exec(function (err, doc) {
                done(err, doc);
            });
        }
    }, function (err, results) {
        var count = results.count;
        $page.pageCount = Math.floor((count - 1) / pageSize + 1);
        $page.results = results.records;
        callback(err, $page);
    });
}

module.exports = router;
