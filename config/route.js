var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
//获取控制器
var Index = require('../controller/index')
var User = require('../controller/user')
var Movie = require('../controller/movie')
//路由
module.exports = function(app){
  app.get('/',Index.index)

  app.post('/user/signup', User.signup)
  app.post('/user/signin', User.signIn)
  app.get('/logout', User.logout)
  app.get('/admin/userList', User.list)

  app.get('/detail/:id', Movie.detail)
  app.get('/admin/movie', Movie.new)
  app.get('/admin/list',Movie.list)
  app.get('/admin/update/:id', Movie.update)
  app.post('/admin/movie/new', upload.array(), Movie.save)
  app.delete('/admin/list',Movie.delete)

}
