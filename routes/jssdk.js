var express = require('express');
var router = express.Router();
var wechatConfig = require('./wechatConfig');

var wechatCgiBinHelper = require('./wechatCgiBinHelper');

router.get('/', function (req, res, next) {
    var url =  req.protocol + '://' + wechatConfig.hw.maindomain + req.path;
    console.log("url: " + url);
    wechatCgiBinHelper.cgiBinToken(function (error, response, body) {
        var access_token = body.access_token;
        var expires_in = body.expires_in;
        wechatCgiBinHelper.cgiBinTicketJsApi(access_token, function (error, response, body) {
            var ticket = body.ticket;
            wechatCgiBinHelper.cgiBinTicketJsApiSign(ticket, url, function (config) {
                var jssdkConfig = config;
                res.render('jssdk', {jssdkConfig: jssdkConfig});
            })
        });
    });
    
});

router.get('/config', function (req, res, next) {
    var url = req.query.url;
    wechatCgiBinHelper.cgiBinToken(function (error, response, body) {
        var access_token = body.access_token;
        var expires_in = body.expires_in;
        wechatCgiBinHelper.cgiBinTicketJsApi(access_token, function (error, response, body) {
            var ticket = body.ticket;
            wechatCgiBinHelper.cgiBinTicketJsApiSign(ticket, url, function (config) {
                var jssdkConfig = config;
                res.send(config);
            })
        });
    });
});

router.get('/image', function (req, res) {
    var serverid = req.query.serverid;
    console.log('serverid: ' + serverid)
    var imageObj = {};
    imageObj.current = 'http://img3.douban.com/view/photo/photo/public/p2152117150.jpg';
    var urls = [];
    urls.push('http://img3.douban.com/view/photo/photo/public/p2152117150.jpg');
    urls.push('http://img3.douban.com/view/photo/photo/public/p2152117150.jpg');
    imageObj.urls = urls;
    console.log(imageObj);
    res.send(imageObj);
});

module.exports = router;
