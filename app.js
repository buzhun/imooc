var express = require('express')
var Movie = require('./models/movie')
var User = require('./models/user')
var _ = require('underscore')
var mw = require('./middleware/my-midle')
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var bodyParser = require('body-parser')
var path = require('path');
var moment = require('moment')

var app = express()
var port = process.env.PORT || 3030
app.locals.moment = require('moment')

var mongoose = require('mongoose');

var session = require('express-session')
var MongoStore = require('connect-mongo')(session);


var dbUrl = "mongodb://localhost/my_database"
/*app.use(session({
    secret: 'foo',
    store: new MongoStore({
      url: dbUrl,
      collection: 'sessions'
    })
}));*/
mongoose.connect('mongodb://localhost/my_database');

app.set('views','./views/pages')
app.set('view engine','jade')
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port)

// 表单数据格式化
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



app.post('/user/signup',function(req, res){
  var _user = req.body.user
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
})

app.post('/user/signin',function(req, res){
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
          return res.redirect('/')
        }else{
          console.log('password is wrong')
        }
      })
    }else{
      res.redirect('/')
    }
  })
})
app.get('/admin/userList',function(req,res){
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
})



app.get('/',function(req, res){
  //console.log(req.session.user)

  /*var _user = req.session.user
  if(_user){
    app.locals.user = _user
  }*/
  Movie.fetch(function(err, movies){
    if(err){
      console.log(err);
    }
    res.render('index',{
      title:'活动平台推荐 首页',
      movies: movies
    })
  })
})

app.get('/detail/:id',function(req, res){
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
})
app.get('/admin/movie',function(req, res){
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
})
//admin update movie
app.get('/admin/update/:id',function(req,res){
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
})
// app.post('/admin/movie/new', upload.array(), function (req, res, next) {
//   console.log(req.body);
//   res.json(req.body);
// });
// admin post movie
app.post('/admin/movie/new', upload.array(), function(req,res){

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
//这里有问题
    _movie.save(function(err,movie){
      if(err){
        console.log(err);
      }

      res.redirect('/detail/'+movie._id)
    })
  }
})
app.get('/admin/list',function(req, res){
  Movie.fetch(function(err, movies){
    if(err){
      console.log(err);
    }
    res.render('list',{
      title:'imooc 列表页',
      movies: movies
    })
  })
})

app.delete('/admin/list',function(req, res){
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
})
console.log('big leg started on port' + port)
