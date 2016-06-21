
var crypto = require('crypto');
var key = '0123456789abcd0123456789';
var iv = '12345678';

var encrypt = function (text) {
    var cipher = crypto.createCipheriv('des3', new Buffer(key), new Buffer(iv));
    var ciph = cipher.update(text, 'utf8', 'base64');
    ciph += cipher.final('base64');
    return ciph;
};

var decrypt = function (text) {
    var decipher = crypto.createDecipheriv('des3', new Buffer(key), new Buffer(iv));
    var planTxt = decipher.update(text, 'base64', 'utf8');
    planTxt += decipher.final('utf8');
    return planTxt;
};


exports.encryptText = encrypt;
exports.decrypt = decrypt;

/**
 * 生成验证码token,此处只用演示demo时,防止有些朋友不知道如何生成token而写的生成方法,实际开发中由客户端按照生成规则自行生成
 * 生成规则为des3加密
 * @param mobile
 * @param type  0:常规访问 1:注册 2:修改绑定手机 3:修改密码 4:忘记密码
 */
exports.genAccessToken = function (mobile, type) {
    var planTxt = 'Y-' + mobile + '-' + type + '-' + new Date().getTime();
    return encrypt(planTxt);
};

/**
 * 解析验证码了token
 * @param verificationCodeToken
 */
exports.parseAccessToken = function (verificationCodeToken) {
    var planTxt = decrypt(verificationCodeToken);
    var arr = planTxt.split("-");
    if (arr.length != 4 || arr[0] != 'Y') {
        return null;
    }
    var result = {};
    result.mobile = arr[1];
    result.type = arr[2];
    result.timestamp = arr[3];
    return result;
};










