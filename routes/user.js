var express = require('express');
var router = express.Router();

var wechatConfig = require('./wechatConfig');
var helper = require('./helper');

router.get('/', function (req, res, next) {
    var query = req.query;
    console.log(query);
    res.render('user', {});
});


router.get('/auth', function (req, res, next) {
    var wechatAuthUrlUserInfo = wechatConfig.wechatAuthUrl(wechatConfig.wechat.redirectUri, wechatConfig.wechat.scopeUserInfo);
    var wechatAuthUrlBase = wechatConfig.wechatAuthUrl(wechatConfig.wechat.redirectUri, wechatConfig.wechat.scopeBase);
    res.render('auth', {wechatAuthUrlUserInfo: wechatAuthUrlUserInfo, wechatAuthUrlBase:wechatAuthUrlBase});
});

router.get('/auth/callback', function (req, res, next) {
    var query = req.query;

    helper.wechatJSAccessToken(query.code, function (error, response, body) {
        console.log(error, response, body);
        res.render('user', {openid: body});
    });

});

module.exports = router;
