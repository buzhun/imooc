var Comment = require('../models/comment')
var _ = require('underscore')// underscore 提供js的函数方法 http://www.css88.com/doc/underscore/

exports.save = function(req,res){
  var _comment = req.body.comment
  var movieId = _comment.movie;
  var comment = new Comment(_comment)

  comment.save(function(err, comment){
    if(err){
      console.log(err)
    }
    res.redirect('./detail/'+movieId)
  })
}
