var base = require('./Base');
var ObjectId = base.ObjectId;

var OneTimeSMSCodeSchema  =new base.Schema({
    mobile:String,//手机号
    code:String,//验证码
    type:Number,//0:常规访问 1:注册 2:修改绑定手机 3:修改密码 4:忘记密码
    sendSuccess:{type:Boolean,default:false},
    used:{type:Boolean,default:false},//是否已使用
    createTime:{type:Date,default:Date.now},
    expirationTime:Date,//超时时间
    // 为防止代码恶意发送验证码,而与客服端约定生成的具有一定规则的发送token,只有传入合法且数据库中不存在的token才会发送验证码
    //token生成的规则为:Y-手机号-类别(type)-时间戳(毫秒)
    token:String
});
OneTimeSMSCodeSchema.index({mobile:1,code:1,type:1,sendSuccess:1,used:1,expirationTime:1,token:1},{"background" : true});//设置索引
var OneTimeSMSCodeEntity = base.mongoose.model('OneTimeSMSCodeEntity',OneTimeSMSCodeSchema,'oneTimeSMSCode');
exports.OneTimeSMSCodeEntity  = OneTimeSMSCodeEntity;