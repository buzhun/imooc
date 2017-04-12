var Movie = require('../models/movie')
var Category = require('../models/category')

var _ = require('underscore')// underscore 提供js的函数方法 http://www.css88.com/doc/underscore/
var Comment = require('../models/comment')

exports.detail = function(req,res){
  var id = req.params.id;

  Movie.findById(id,function(err, movie){
    if(err){
      console.log(err);
    }
    Comment
      .find({movie:id})
      .populate('from','name')
      .populate('reply.from reply.to','name')
      .exec(function(err,comment){
        if(err){
          console.log(err);
        }
        res.render('detail',{
          title:'imooc'+movie.title,
          id:id,
          movie:movie,
          comment:comment
        })
    })
  })
}
exports.new = function(req,res){
  Category.find({},function(err, categories){
    if(err){
      console.log(err);
    }
    console.log('categories')
    console.log(categories)
    res.render('admin',{
      title:'imooc 后台录入页',
      movie:{},
      categories:categories
    })
  })
}
exports.update = function(req,res){
  var id = req.params.id;
  if(id){
    Movie.findById(id,function(err, movie){
      if(err){
        console.log(err);
      }
      Category.find({},function(err, categories){
        res.render('admin',{
          title: 'imooc 后台更新页',
          movie: movie,
          categories: categories
        })
      });
    })
  }
}
exports.save = function(req,res){
  var id = req.body.movie._id
  var movieObj = req.body.movie
  var _movie

  if(id){
      Movie.findById(id,function(err, movie){
        if(err){
          console.log(err);
        }
        _movie = _.extend(movie, movieObj)
        _movie.save(function(err,movie){
          if(err){
            console.log(err);
          }
          res.redirect('/movie/'+movie._id)
        })
      })
  }else{
    _movie = new Movie(movieObj)
    var categoryId = _movie.category;
    _movie.save(function(err,movie){
      if(err){
        console.log(err);
      }
      Category.findById(categoryId,function(err,category){
        category.movies.push(movie._id)
        category.save(function(err,category){
          res.redirect('/movie/'+movie._id)
        })
      })
    })
  }
}
exports.list = function(req,res){
  Movie.fetch(function(err, movies){
    if(err){
      console.log(err);
    }
    res.render('list',{
      title:'imooc 列表页',
      movies: movies
    })
  })
}
exports.delete = function(req,res){
  var id = req.query.id;
  if(id){
    Movie.remove({_id:id},function(err,movie){
      if(err){
        console.log(err);
      }else{
        res.json({success:1})
      }
    })
  }
}
