var express = require('express')
var mw = require('./middleware/my-midle')
var bodyParser = require('body-parser')
var path = require('path');
var moment = require('moment')
var morgan = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session')
var MongoStore = require('connect-mongo')(session);

//开启监听
var app = express()
var port = process.env.PORT || 3030
app.listen(port)

//定义本地变量 －用于渲染层的时间转换方法
app.locals.moment = require('moment')

//连接数据库
var dbUrl = 'mongodb://localhost/my_database';
mongoose.connect(dbUrl);

//配置渲染层模版，转换静态文件目录
app.set('views','./views/pages')
app.set('view engine','jade')
app.use(express.static(path.join(__dirname, 'public')));

// 表单数据格式化
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//保存会话状态
app.use(session({
    secret: 'imooc',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      url:dbUrl,
      collection:'session'
    })
}));

//添加路由
var route = require('./config/route')(app)

//开发模式
if("development" === app.get('env')){
  app.set('showStackError',true)
  app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
  }))
  app.locals.pretty = true;
  mongoose.set('debug',true)
}

console.log('big leg started on port' + port)
