var User = require('../models/user')

exports.signup = function(req,res){
  var _user = req.body.user
  req.session.user = _user;
  User.findOne({"name":_user.name},function(err,user){
    if(err){
      console.log(err)
    }
    if(user){
      res.redirect('/signin')
    }else{
      var user = new User(_user)
      user.save(function(err, user){
        if(err){
          console.log(err);
        }
        console.log(user)
        res.redirect('/signin')
        // res.redirect('/admin/userList')
      })
    }
  })
}
exports.signin = function(req,res){
  var _user = req.body.user
  User.findOne({"name":_user.name},function(err,user){
    if(err){
      console.log(err)
    }
    if(user){
      user.comparePassword(_user.password,function(err, isMatch){
        if(err){
          console.log(err)
        }
        if(isMatch){
          req.session.user = user;
          console.log('登录成功')
          return res.redirect('/')
        }else{
          console.log('password is wrong')
          return res.redirect('/signin')
        }
      })
    }else{
      res.redirect('/signup')
    }
  })
}
exports.showSignup = function(req,res){
  res.render('signup',{
    title:'注册页面'
  })
}
exports.showSignin = function(req,res){
  res.render('signin',{
    title:'登录页面'
  })
}
exports.logout = function(req,res){
  delete req.session.user;
  res.redirect('/')
}
exports.list = function(req,res){
  User.fetch(function(err, user){
    if(err){
      console.log(err);
    }
    console.log(user)
    res.render('userList',{
      title:'用户信息',
      user: user
    })
  })
}
exports.signinRequired = function(req,res,next){
  var user = req.session.user;
  if(!user){
    return res.redirect('/signin')
  }
  next()
}
exports.adminRequired = function(req,res,next){
  var user = req.session.user;
  console.log(user)
  if(user.role>10){
    next()
  }else{
    return res.redirect('/signin')
  }
}
