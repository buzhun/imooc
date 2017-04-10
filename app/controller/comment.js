var Comment = require('../models/comment')
var _ = require('underscore')// underscore 提供js的函数方法 http://www.css88.com/doc/underscore/

exports.save = function(req,res){
  var _comment = req.body.comment
  var movieId = _comment.movie;
//如果是回复评论的评论，查看已有的评论
  if(_comment.cid){
    Comment.findById(_comment.cid,function(err,comment){
      if(err){
        console.log(err)
      }
      var reply = {
        from:_comment.from,
        to:_comment.tid,
        content:_comment.content
      }
      comment.reply.push(reply)
      comment.save(function(err, comment){
        if(err){
          console.log(err)
        }
        res.redirect('/movie/'+movieId)
      })
    })

  }else{
    var comment = new Comment(_comment)
    comment.save(function(err, comment){
      if(err){
        console.log(err)
      }
      res.redirect('/movie/'+movieId)
    })
  }
}
