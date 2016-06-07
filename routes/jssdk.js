var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('jssdk', {});
});

router.get('/config', function (req, res, next) {
    var ticket = 'sM4AOVdWfPE4DxkXGEs8VLEm0ygun49gMArC8_GcA89WXZ23z4yjG1O9ulxtN4uSGPWSrtWVm1wvG2Fwp65LYQ';
    var url = req.query.url;
    var config = ticketSign(ticket, url);
    console.log(config);
    res.send(config);
});


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
var ticketSign = function (jsapi_ticket, url) {

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

    return ret;
};

module.exports = router;
