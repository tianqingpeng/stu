/**
 * Created by qingpeng.tian on 2016/12/16.
 */
var express = require('express');
var router = express.Router();
var classModel = require('./db');

router.get('/', function(req, res, next) {
    var response = res;
    classModel.find({}, function(err, results) {
        if(err) {
            console.log(err);
            return;
        } else {
            console.log(results[0].stuId);
            response.render('index', {
                result: results,
                title: "Express"
            });
        }
    })
});

router.get('/create', function(req, res, next) {
    res.render('create', {});
});
router.post('/create', function(req, res, next)  {
    var newEmp = {
        name: req.body.name,
        stuId: req.body.empId
    };
    classModel.create(newEmp, function(err) {
        if(err) {
            console.log(err);
            return;
        }
        res.redirect('/');
    });
});
router.get('/del', function(req, res, next) {
    var response = res;
    classModel.find({}, function(err, results, res) {
        if(err)  {
            console.log(err);
            return;
        }
        response.render('del', { result:results });
    })
})
router.post('/del', function(req, res, next){
    classModel.remove({_id: req.body.student}, function(err, result){
        if(err){
            console.log(err);
            return;
        }
        console.log(result);
        //res.send("<a href='/'>删除成功，点击返回首页</a>")
        res.redirect('/');
    })
})

router.get('/update', function(req, res, next){
    var response = res;
    classModel.find({}, function(err, results, res) {
        if(err) {
            console.log(err);
            return;
        }
        response.render('update', { result: results })
    })
})
router.post('/update', function(req, res, next){
    // res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
    console.log(req.body);
    var num = req.body.num,
        condiction = {_id: req.body._id[num]},
        query = {$set: {name: req.body.name[num], stuId: req.body.stuId[num]}}
    classModel.update(condiction, query, function(err, result){
        if(err) {
            console.log(err);
            res.send('<script>alert("请勾选待修改的学生")</script>');
        }
        //res.send("<a href='/'>修改成功，点击返回首页</a>");
        res.redirect('/');
    })
})

router.get('/seach', function(req, res, next) {
    var result = null;
    res.render('seach', { result: result });
})
router.post('/seach', function(req, res, next) {
    console.log(req.body);
    var response = res;
    var reachType = req.body.reach_type,
        keyWord = req.body.keyword
    if (reachType == 0) {
        classModel.find({name: keyWord}, function(err, results){
            if(err){
                console.log(err);
                return;
            }
            response.render('seach', { result: results })
        })
    } else {
        classModel.find({stuId: keyWord}, function(err, results){
            if(err) {
                console.log(err);
                return;
            }
            response.render('seach', { result: results});
        })
    }
})
module.exports = router;
