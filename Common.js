var RestResult = require('./RestResult');
var tokenUtils = require('./util/tokenUtils');
var myUtils = require('./util/myUtils');
var config = require('./config/config');
var UserEntity = require('./models/User').UserEntity;


var commonChecks = function (req, res, next) {

    res.error = function (errorCode, errorReason) {
        var restResult = new RestResult();
        restResult.errorCode = errorCode;
        restResult.errorReason = errorReason;
        res.send(restResult);
    };


    res.success = function (returnValue) {
        var restResult = new RestResult();
        restResult.errorCode = RestResult.NO_ERROR;
        restResult.returnValue = returnValue || {};
        res.send(restResult);
    };


    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress; //设置ip
    req.ip = ip;//将解析后的ip放入req中,一遍方便使用

    var needLogin = false;
    var requestUrl = req.url;

    myUtils.ArrayUtils.each(config.needLoginUrlRegs, function (urlReg) {//片段请求路径是否为安全路径
        if (urlReg.test(requestUrl)) {
            needLogin = true;
            return false;//返回false表示结束数组的遍历
        }
    });

    if (needLogin) {
        var token = req.headers.token;
        var result = myUtils.StringUtils.isNotEmpty(token)?tokenUtils.parseAccessToken(token):null;
        if (result) {
            var userId = req.body.loginUserId;
            UserEntity.findById(userId, '_id', function (err, user) {
                if (!user) {
                    res.error(RestResult.AUTH_ERROR_CODE, "用户不存在");
                } else {
                    //跟新最后活动时间和ip地址
                    UserEntity.update({_id: userId}, {$set: {lastActionTime: new Date()}, ip: ip}).exec();
                    //进入路由中间件
                    next();
                }
            })
        } else {
            res.error(RestResult.AUTH_ERROR_CODE, "无效的访问token");
        }
    } else {
        next();
    }
};

module.exports = commonChecks;
