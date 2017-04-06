var User = require('../models/user')

exports.signup = function(req,res){
  var _user = req.body.user
  req.session.user = _user;
  User.findOne({"name":_user.name},function(err,user){
    if(err){
      console.log(err)
    }
    if(user){
      res.redirect('/')
    }else{
      var user = new User(_user)
      user.save(function(err, user){
        if(err){
          console.log(err);
        }
        console.log(user)
        res.redirect('/admin/userList')
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
        }
      })
    }else{
      res.redirect('/')
    }
  })
}
exports.layout = function(req,res){
  delete app.locals.user;
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
