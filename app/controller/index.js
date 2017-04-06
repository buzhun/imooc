var Movie = require('../models/movie')

exports.index = function(req,res){
  console.log('session.user:'+req.session.user)
  console.log(req.session.user)
  var _user = req.session.user
  if(_user){
    app.locals.user = _user
  }
  Movie.fetch(function(err, movies){
    if(err){
      console.log(err);
    }
    res.render('index',{
      title:'活动平台推荐 首页',
      movies: movies
    })
  })
}
