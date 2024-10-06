var express = require('express');
var router = express.Router();
var Url = require('../models/urlModel');
var isAuthenticated = require('./isAuthenticated');


router.get('/addurl',isAuthenticated,(req,res) => {
    res.render('addurl',{errors:null})
})

router.post('/addurl',(req,res) => {
    var {title,fullurl} = req.body;
    var errors = [];
    var now = new Date();
    var hours = now.getHours();
    var min = now.getMinutes();
    var hours = ((hours<10) ? "0"+hours : hours)
    var minutes = ((min>=10) ? min : "0"+min);
    var addedtime = hours+":"+minutes
    var url = new Url({
        addedtime,
        title,
        fullurl,
        userId : req.session.userId
    })
    var validationErrors = url.validateSync();
    if(validationErrors){
        errors.push(...Object.values(validationErrors.errors).map(err => err.message))
    }

    if(errors && errors.length > 0){
        return res.render('addurl',{errors:errors})
    } else{
        Url.countDocuments({userId:req.session.userId})
            .then(count => {
                if(count>=5){
                    errors.push('Cant add more than 5 url')
                    res.render('addurl',{errors:errors})
                }else{
                    url.save();
                    res.redirect('/url/addurl')
                }
            })
            .catch(err => {
                console.log(err)
            })
    }   
})

router.get('/viewurl',isAuthenticated,(req,res) => {
    var {page = 1, limit = 1} = req.query;
    var options = {
        page : parseInt(page, 10),
        limit : parseInt(limit, 10)
    }
    Url.paginate({userId : req.session.userId},options)
        .then(result => {
            res.render('viewurl',{data:result.docs,pagination:result})
        })
})

router.get('/update/:id',isAuthenticated,(req,res) => {
    var urlId = req.params.id
    Url.findOne({_id:urlId})
        .then(data => {
            console.log("seeee"+data)
            res.render('update',{data:data})
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/update/:id',(req,res) => {
    var urlId = req.params.id;
    var {title,fullurl} = req.body;
    Url.findByIdAndUpdate(urlId,{title,fullurl})
        .then(() => {
            console.log('updated')
            res.redirect('/url/viewurl')
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/delete/:id',isAuthenticated,(req,res) => {
    var urlId = req.params.id;
    Url.findByIdAndDelete(urlId)
        .then(() => {
            res.redirect('/url/viewurl')
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/getSearchItem/:title',isAuthenticated,(req,res) => {
    var title = req.params.title;
    Url.find({title:title})
        .then(data => {
            res.json(data)
        })
    
})

module.exports = router;