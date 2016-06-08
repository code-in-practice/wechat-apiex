var express = require('express');
var router = express.Router();

var wechatConfig = require('./wechatConfig');
var wechatAuthHelper = require('./wechatAuthHelper');

router.get('/', function (req, res, next) {
    res.render('user', {});
});


router.get('/auth', function (req, res, next) {
    var wechatAuthUrlUserInfo = wechatConfig.wechatAuthUrl(wechatConfig.wechat.redirectUri, wechatConfig.wechat.scopeUserInfo);
    var wechatAuthUrlBase = wechatConfig.wechatAuthUrl(wechatConfig.wechat.redirectUri, wechatConfig.wechat.scopeBase);
    res.render('auth', {wechatAuthUrlUserInfo: wechatAuthUrlUserInfo, wechatAuthUrlBase:wechatAuthUrlBase});
});

router.get('/auth/callback', function (req, res, next) {
    var query = req.query;

    wechatAuthHelper.jsAccessToken(query.code, function (error, response, body) {
        if(body.errcode){
            res.render('user', {errMsg: body, userInfo: {}});
        }else {
            wechatAuthHelper.jsUserInfo(body.access_token, body.openid, 'zh_CN', function (error, response, body) {
                res.render('user', {errMsg: '', userInfo: body});
            })
        }
        
    });

});

module.exports = router;
