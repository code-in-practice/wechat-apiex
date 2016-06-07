var express = require('express');
var router = express.Router();

var wechatConfig = require('../config/wechatConfig');

router.get('/', function (req, res, next) {
    var query = req.query;
    console.log(query);
    res.render('user', {});
});

router.get('/auth', function (req, res, next) {
    res.render('auth', {wechatAuthUrlUserInfo: wechatConfig.wechatAuthUrlUserInfo, wechatAuthUrlBase:wechatConfig.wechatAuthUrlBase});
});

module.exports = router;
