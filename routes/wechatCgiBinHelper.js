/**
 * Created by zsj on 16-6-7.
 */
var wechatConfig = require('./wechatConfig');
var request = require('request');
var crypto = require('crypto');

/**
 * @synopsis 获取多媒体文件
 *
 * @param access_token
 * @param media_id
 * @param callback
 */
exports.cgiBinMediaGet = function (access_token, media_id, callback) {
    // 详细的文档 https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183&token=&lang=zh_CN
    var url = wechatConfig.wechat.urlCgiBinMediaGet;

    var options = {
        url: url,
        json: true,
        qs: {
            access_token: access_token,
            media_id: media_id
        }
    };

    request.get(options, function (error, response, body) {
        console.log('cgiBinMediaGet: ', body);
        callback(error, response, body);

        // 正常情况下，微信会返回下述JSON数据包给公众号：
        // {
        //      "errcode":0,
        //      "errmsg":"ok",
        //      "ticket":"bxLdikRXVbTPdHSM05e5u5sUoXNKd8-41ZO3MhKoyN5OfkWITDGgnr2fwJ0m9E8NYzWKVZvdVtaUgWvsdshFKA",
        // "expires_in":7200 }


        // 错误时微信会返回错误码等信息，JSON数据包示例如下（该示例为AppID无效错误）:
        // {"errcode":40029,"errmsg":"invalid code"}
    });
};

/**
 * @synopsis 获取jssdkConfig
 *
 * @param url
 * @param callback
 */
exports.cgiBinJsSdkConfig = function(url, callback){
    cgiBinToken(function (access_token) {
        cgiBinTicket(access_token, function (ticket) {
            cgiBinTicketSign(ticket, url, function (config) {
                var jssdkConfig = config;
                callback(jssdkConfig);
            })
        });
    });
};


/**
 * @synopsis 获取access_token
 * access_token是公众号的全局唯一接口调用凭据，公众号调用各接口时都需使用access_token。
 * 开发者需要进行妥善保存。access_token的存储至少要保留512个字符空间。
 * access_token的有效期目前为2个小时，需定时刷新，重复获取将导致上次获取的access_token失效。
 * @param callback
 */
var cgiBinToken = function (callback) {
    // 详细的文档 https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183&token=&lang=zh_CN
    var url = wechatConfig.wechat.urlCgiBinToken;

    var options = {
        url: url,
        json: true,
        qs: {
            grant_type: wechatConfig.wechat.grantTypeClientCredential,
            appid: wechatConfig.wechat.appID,
            secret: wechatConfig.wechat.secret
        }
    };

    fs.readFile('access_token.txt', 'utf8', function (err, txt) {
        if(err) {
            request.get(options, function (error, response, body) {
                console.log('cgiBinToken: ', body);
                var access_token = body.access_token;
                fs.writeFile('access_token.txt', JSON.stringify(access_token), function () {
                    callback(access_token);
                });

                // 正常情况下，微信会返回下述JSON数据包给公众号：
                // {"access_token":"ACCESS_TOKEN","expires_in":7200}

                // 错误时微信会返回错误码等信息，JSON数据包示例如下（该示例为AppID无效错误）:
                // {"errcode":40029,"errmsg":"invalid code"}
            });
        }else {
            callback(JSON.parse(txt));
        }
    });
};

/**
 * @synopsis 获得jsapi_ticket
 *
 * @param access_token
 * @param type
 * @param callback
 */
var cgiBinTicket = function (access_token, type, callback) {
    // 详细的文档 https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183&token=&lang=zh_CN
    var url = wechatConfig.wechat.urlCgiBinTicket;

    var options = {
        url: url,
        json: true,
        qs: {
            access_token: access_token,
            type: type || wechatConfig.wechat.ticketTypeJsApi
        }
    };

    request.get(options, function (error, response, body) {
        console.log('cgiBinTicketJsApi: ', body);
        callback(body.ticket);

        // 正常情况下，微信会返回下述JSON数据包给公众号：
        // {
        //      "errcode":0,
        //      "errmsg":"ok",
        //      "ticket":"bxLdikRXVbTPdHSM05e5u5sUoXNKd8-41ZO3MhKoyN5OfkWITDGgnr2fwJ0m9E8NYzWKVZvdVtaUgWvsdshFKA",
        // "expires_in":7200 }


        // 错误时微信会返回错误码等信息，JSON数据包示例如下（该示例为AppID无效错误）:
        // {"errcode":40029,"errmsg":"invalid code"}
    });
};


/********************************************jsapi相关*****************************************/
var createNonceStr = function () {
    return '9hbmz574vjhe61o';
    //return Math.random().toString(36).substr(2, 15);
};

var createTimestamp = function () {
    return 1465206932;
    return parseInt(new Date().getTime() / 1000) + '';
};

var raw = function (args) {
    var keys = Object.keys(args);
    keys = keys.sort()
    var newArgs = {};
    keys.forEach(function (key) {
        newArgs[key.toLowerCase()] = args[key];
    });

    var string = '';
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
};

/**
 * @synopsis 签名算法
 *
 * @param jsapi_ticket 用于签名的 jsapi_ticket
 * @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
 *
 * @returns
 */
var cgiBinTicketSign = function (ticket, url, callback) {
    var jsapi_ticket = ticket;
    var ret = {
        jsapi_ticket: jsapi_ticket,
        nonceStr: createNonceStr(),
        timestamp: createTimestamp(),
        url: url
    };
    var string = raw(ret);
    var shasum = crypto.createHash('sha1');
    shasum.update(string);

    ret.signature = shasum.digest('hex');
    ret.appId = wechatConfig.wechat.appID;

    console.log("cgiBinTicketJsApiSign: \n", ret);

    callback(ret);
};

