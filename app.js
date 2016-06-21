var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');//加载morgan,主要功能是在控制台中，显示req请求的信息
var cookieParser = require('cookie-parser');//支持cookie
var bodyParser = require('body-parser');

var commonChecks = require('./Common');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');//引入自定义的user路由中间件
var statusRouter = require('./routes/status');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));//设置模板文件路径
app.set('view engine', 'ejs');//使用ejs模板引擎

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//app访问预处理中间件
app.use(commonChecks);

app.use('/',indexRouter);
app.use('/api/user', userRouter);//挂载user模块路由中间件
app.use('/api/status',statusRouter);//挂载微博模块路由中间件

// catch 404 and forward to error handler
app.use(function (req, res, next) {//404中间件
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {//异常中间件
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
