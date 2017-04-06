var Movie = require('../models/movie')
var _ = require('underscore')// underscore 提供js的函数方法 http://www.css88.com/doc/underscore/

exports.detail = function(req,res){
  var id = req.params.id;
  Movie.findById(id,function(err, movie){
    if(err){
      console.log(err);
    }
    res.render('detail',{
      title:'imooc'+movie.title,
      id:id,
      movie:movie
    })
  })
}
exports.new = function(req,res){
  res.render('admin',{
    title:'imooc 后台录入页',
    movie:{
      title: '美女与野兽',
      doctor: '比尔',
      country: '美国',
      language: '英语',
      year: 2017,
      summary: '贝儿（艾玛·沃森 Emma Watson 饰）和小镇上的其他女孩不同，是一个热爱阅读和幻想的姑娘，孔武有力英俊强壮的加斯顿（卢克·伊万斯 Luke Evans 饰）发誓要娶贝儿为妻，但贝儿却一眼看穿了他的自私和虚伪，拒不从命。某日，贝儿的父亲莫里斯（凯文·克莱恩 Kevin Kline 饰）迷路误打误撞之下来到了一座荒凉破败的城堡中，那里居住着样貌可怖半人半兽的野兽（丹·史蒂文斯 Dan Stevens 饰）。 ',
      flash: 'https://movie.douban.com/trailer/211279/#content',
      poster: 'https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p2417948644.webp'
    }
  })
}
exports.update = function(req,res){
  var id = req.params.id;
  if(id){
    Movie.findById(id,function(err, movie){
      if(err){
        console.log(err);
      }
      res.render('admin',{
        title:'imooc 后台更新页',
        movie: movie
      })
    })
  }
}
exports.save = function(req,res){
  var id = req.body.movie._id
  var movieObj = req.body.movie
  var _movie

  if(id!=='undefined'){
      Movie.findById(id,function(err, movie){
        if(err){
          console.log(err);
        }
        _movie = _.extend(movie, movieObj)
        _movie.save(function(err,movie){
          if(err){
            console.log(err);
          }
          res.redirect('/detail/'+movie._id)
        })
      })
  }else{

    _movie = new Movie({
      title: movieObj.title,
      doctor: movieObj.doctor,
      country: movieObj.country,
      language: movieObj.language,
      year: movieObj.year,
      summary: movieObj.summary,
      flash: movieObj.flash,
      poster: movieObj.poster
    })
    _movie.save(function(err,movie){
      if(err){
        console.log(err);
      }

      res.redirect('/detail/'+movie._id)
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
