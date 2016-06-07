/**
 * Created by zsj on 16-6-7.
 */
var wechatConfig = require('./wechatConfig');

exports.wechatJSAccessToken = function (code, callback) {
    var grant_type = wechatConfig.wechat.grantTypeAuthorizationCode;
    var appid = wechatConfig.wechat.appID;
    var secret = wechatConfig.wechat.appsecret;
    
    var options = {
        url: wechatConfig.wechat.oauth2AccessTokenUrl,
        grant_type: grant_type,
        appid: appid,
        secret: secret
    }

    request.get(options, function (error, response, body) {
        callback(error, response, body);
    })
};
