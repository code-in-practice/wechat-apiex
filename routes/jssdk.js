var express = require('express');
var router = express.Router();

var wechatCgiBinHelper = require('./wechatCgiBinHelper');

router.get('/', function (req, res, next) {
    res.render('jssdk', {});
});

router.get('/config', function (req, res, next) {
    var url = req.query.url;
    wechatCgiBinHelper.cgiBinToken(function (error, response, body) {
        var access_token = body.access_token;
        var expires_in = body.expires_in;
        wechatCgiBinHelper.cgiBinTicketJsApi(access_token, function (error, response, body) {
            var ticket = body.ticket;
            wechatCgiBinHelper.cgiBinTicketJsApiSign(ticket, url, function (config) {
                var config = config;
                res.send(config);
            })
        });
    });
});

module.exports = router;
