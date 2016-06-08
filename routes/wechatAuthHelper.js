/**
 * Created by zsj on 16-6-7.
 */
var wechatConfig = require('./wechatConfig');
var request = require('request');

/**
 * 通过code换取网页授权access_token
 * @param code
 * @param callback
 */
exports.jsAccessToken = function (code, callback) {
    // 详细的文档 https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842&token=&lang=zh_CN
    var grant_type = wechatConfig.wechat.grantTypeAuthorizationCode;
    var appid = wechatConfig.wechat.appID;
    var secret = wechatConfig.wechat.appsecret;
    var url = wechatConfig.wechat.urlSnsOauth2AccessToken;

    var qs_obj = {
        grant_type: grant_type,
        appid: appid,
        secret: secret,
        code: code
    };

    request.get({url: url, qs: qs_obj}, function (error, response, body) {
        callback(error, response, body);

        // 正确时返回的JSON数据包如下：
        // {   "access_token":"ACCESS_TOKEN",
        //     "expires_in":7200,
        //     "refresh_token":"REFRESH_TOKEN",
        //     "openid":"OPENID",
        //     "scope":"SCOPE" }

        // 错误时微信会返回JSON数据包如下（示例为code无效错误）:
        // {"errcode":40029,"errmsg":"invalid code"}
    });
};

/**
 * 刷新access_token（如果需要）
 * @param refresh_token
 * @param callback
 */
exports.jsRefreshToken = function (refresh_token, callback) {
    var grant_type = wechatConfig.wechat.grantTypeRefreshToken;
    var appid = wechatConfig.wechat.appID;
    var url = wechatConfig.wechat.urlSnsOauth2RefreshToken;

    var qs_obj = {
        grant_type: grant_type,
        appid: appid,
        refresh_token: refresh_token
    };

    request.get({url: url, qs: qs_obj}, function (error, response, body) {
        callback(error, response, body);
        // 正确时返回的JSON数据包如下：
        // {   "access_token":"ACCESS_TOKEN",
        //     "expires_in":7200,
        //     "refresh_token":"REFRESH_TOKEN",
        //     "openid":"OPENID",
        //     "scope":"SCOPE" }

        // 错误时微信会返回JSON数据包如下（示例为code无效错误）:
        // {"errcode":40029,"errmsg":"invalid code"}
    });
};

/**
 * 拉取用户信息(需scope为 snsapi_userinfo)
 * 如果网页授权作用域为snsapi_userinfo，则此时开发者可以通过access_token和openid拉取用户信息了。
 * @param access_token
 * @param openid
 * @param lang
 * @param callback
 */
exports.jsUserInfo = function (access_token, openid, lang, callback) {
    var url = wechatConfig.wechat.urlSnsUserInfo;

    var qs_obj = {
        openid: openid,
        access_token: access_token,
        lang: lang || 'zh_CN'
    };

    request.get({url: url, qs: qs_obj}, function (error, response, body) {
        callback(error, response, body);

        // 正确的JSON返回结果：
        // { "errcode":0,"errmsg":"ok"}
        // 错误时的JSON返回示例：
        // { "errcode":40003,"errmsg":"invalid openid"}
    });
};

/**
 * 检验授权凭证（access_token）是否有效
 * @param access_token
 * @param openid
 * @param callback
 */
exports.jsAuth = function (access_token, openid, callback) {
    var url = wechatConfig.wechat.urlSnsAuth;

    var qs_obj = {
        openid: openid,
        access_token: access_token
    };

    request.get({url: url, qs: qs_obj}, function (error, response, body) {
        callback(error, response, body);

        // 正确的JSON返回结果：
        // { "errcode":0,"errmsg":"ok"}
        // 错误时的JSON返回示例：
        // { "errcode":40003,"errmsg":"invalid openid"}
    });
};
