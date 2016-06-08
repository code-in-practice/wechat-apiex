/**
 * Created by zsj on 16-6-7.
 */
var wechatConfig = require('./wechatConfig');
var request = require('request');

exports.wechatJSAccessToken = function (code, callback) {
    var grant_type = wechatConfig.wechat.grantTypeAuthorizationCode;
    var appid = wechatConfig.wechat.appID;
    var secret = wechatConfig.wechat.appsecret;

    var url = wechatConfig.wechat.oauth2AccessTokenUrl;
    var queryStringObj = {
        grant_type: grant_type,
        appid: appid,
        secret: secret
    };

    request.get({url: url, qs: queryStringObj}, function (error, response, body) {
        callback(error, response, body);
    })
};
