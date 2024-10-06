var express = require('express');
var router = express.Router();
var User = require('../models/userModel');
var Url = require('../models/urlModel');
var bcrypt = require('bcrypt');
var {validateEmail,validatePass} = require('./customValidation');
var isAuthenticated = require('./isAuthenticated');

router.get('/',isAuthenticated,(req,res) => {
  var email = req.session.email;
  res.render('home',{email:email})
})

router.get('/signup',(req,res) => {
  res.render('signup',{errors:[]})
})

router.post('/signup',(req,res) => {
  var {email,password,confirmpassword} = req.body;
  var errors = [];
  
  if(password !== confirmpassword){
    errors.push('Password do not match.Please make sure both fields are identical')
  }

  var user = new User({email,password})
  var validationErrors = user.validateSync();
  if(validationErrors){
    errors.push(...Object.values(validationErrors.errors).map(err => err.message));
  }

  if(errors && errors.length > 0){
    res.render('signup',{errors:errors})
  } else {
    User.findOne({email})
      .then(existingUser => {
        if(existingUser){
          errors.push('Email already taken')
          return res.render('signup',{errors:errors})
        } 
        return bcrypt.hash(password,10)
        

      })
      .then(hashedPassword => {
        console.log(hashedPassword)
        var newUser = new User({
          email,
          password : hashedPassword
        })
        return newUser.save()
      })
      .then(() => {
        res.render('login',{errors:[]})
      })
      .catch(err => {
        console.log(err)
      })
  }
})

router.get('/login',(req,res) => {
  res.render('login',{errors:[]})
})

router.post('/login',[validateEmail,validatePass],(req,res) => {
  var {email,password} = req.body;
  var foundUser;
  var errors = req.validationErrors || [];

  if(errors.length>0){
    console.log("helo")
    return res.render('login',{errors:errors})
  }
  User.findOne({email})
    .then(user => {
      if(!user){
        errors.push('Incorrect Email')
        return res.render('login',{errors : errors})
      } else{
        foundUser = user;
        return bcrypt.compare(password,user.password)
      }
    })
    .then(validPassword => {
      if(!validPassword){
        errors.push('Incorrect password');
        return res.render('login',{errors : errors})
      }
      req.session.userId = foundUser._id;
      req.session.email = foundUser.email;
      res.redirect('/');
    })
    .catch(err => {
      console.log(err)
    })

})

router.get('/logout',(req,res) => {
  req.session.destroy(err => {
    if(err){
      console.log(err)
    } else{
      res.redirect('/login')
    }
  })
})

router.get('/:shordid', (req, res) => {
  var short = req.params.shordid;  
  Url.findOne({ shorturl: short }) 
    .then(results => {
      if (results) {
        res.redirect(results.fullurl); 
      } else {
        res.status(404).send('URL not found');
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Server error');
    });
});


router.post('/search',(req,res) => {
  var {charac} = req.body;
  Url.find({$and : [{userId:req.session.userId},{title: {$regex : `^${charac}`, $options : 'i'}}]})
    .then(response => {
      res.json(response)
    })  
})



module.exports = router;
