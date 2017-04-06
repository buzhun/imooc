var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
//获取控制器
var Index = require('../app/controller/index')
var User = require('../app/controller/user')
var Movie = require('../app/controller/movie')
//路由
console.log(User.signup)
module.exports = function(app){
  app.use(function(req,res,next){
    var _user = req.session.user;
    app.locals.user = _user;
    next();
  })
  app.get('/',Index.index)
  app.post('/user/signup', User.signup)
  app.post('/user/signin', User.signin)
  app.get('/signup', User.showSignup)
  app.get('/signin', User.showSignin)
  app.get('/logout', User.logout)
  app.get('/admin/userList', User.signinRequired, User.list)

  app.get('/detail/:id', Movie.detail)
  app.get('/admin/movie', Movie.new)
  app.get('/admin/movie/list',User.signinRequired,Movie.list)
  app.get('/admin/update/:id', Movie.update)
  app.post('/admin/movie/new', User.signinRequired, upload.array(), Movie.save)
  app.delete('/admin/movie/list',User.signinRequired, Movie.delete)

  app.post('/comment', Comment.save)

}
