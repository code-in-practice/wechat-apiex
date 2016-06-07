var express = require('express');
var router = express.Router();

var crypto = require('crypto');
var xml2js = require('xml2js');
var ejs = require('ejs');
var wechatConfig = require('./wechatConfig');


var token = wechatConfig.wechat.token;

router.get('/', function (req, res) {
    res.send(echoMessage(req.query));
});

router.post('/', function (req, res) {
    if (checkSignature(req.query)) {
        getMessage(req, function (err, result) {
            if (err) {
                console.log("BadMessage " + err.name)
            }
            var message = formatMessage(result.xml);
            console.log(message);
            var content = 'hi';
            res.send(encryptXml(reply(content, message.ToUserName, message.FromUserName, message)))
        })
    } else {
        res.send('Hello World!');
    }
});



var echoMessage = function (query) {
    var echostr = query.echostr;

    if(checkSignature(query)){
        return echostr;
    }else {
        return 'Hello World!';
    }
};

var checkSignature = function (query) {
    var signature = query.signature;
    var timestamp = query.timestamp;
    var nonce = query.nonce;

    var tmpArray = [token, timestamp, nonce];
    tmpArray.sort();
    var tmpStr = tmpArray.join('');

    var shasum = crypto.createHash('sha1');
    shasum.update(tmpStr);

    return shasum.digest('hex') === signature;
};

/*!
 * 响应模版
 */
var tpl = ['<xml>',
           '<ToUserName><![CDATA[<%-toUsername%>]]></ToUserName>',
           '<FromUserName><![CDATA[<%-fromUsername%>]]></FromUserName>',
           '<CreateTime><%=createTime%></CreateTime>',
           '<% if (msgType === "device_event" && (Event === "subscribe_status" || Event === "unsubscribe_status")) { %>',
           '<% if (Event === "subscribe_status" || Event === "unsubscribe_status") { %>',
           '<MsgType><![CDATA[device_status]]></MsgType>',
           '<DeviceStatus><%=DeviceStatus%></DeviceStatus>',
           '<% } else { %>',
           '<MsgType><![CDATA[<%=msgType%>]]></MsgType>',
           '<Event><![CDATA[<%-Event%>]]></Event>',
           '<% } %>',
           '<% } else { %>',
           '<MsgType><![CDATA[<%=msgType%>]]></MsgType>',
           '<% } %>',
           '<% if (msgType === "news") { %>',
           '<ArticleCount><%=content.length%></ArticleCount>',
           '<Articles>',
           '<% content.forEach(function(item){ %>',
           '<item>',
           '<Title><![CDATA[<%-item.title%>]]></Title>',
           '<Description><![CDATA[<%-item.description%>]]></Description>',
           '<PicUrl><![CDATA[<%-item.picUrl || item.picurl || item.pic %>]]></PicUrl>',
           '<Url><![CDATA[<%-item.url%>]]></Url>',
           '</item>',
           '<% }); %>',
           '</Articles>',
           '<% } else if (msgType === "music") { %>',
           '<Music>',
           '<Title><![CDATA[<%-content.title%>]]></Title>',
           '<Description><![CDATA[<%-content.description%>]]></Description>',
           '<MusicUrl><![CDATA[<%-content.musicUrl || content.url %>]]></MusicUrl>',
           '<HQMusicUrl><![CDATA[<%-content.hqMusicUrl || content.hqUrl %>]]></HQMusicUrl>',
           '<% if (content.thumbMediaId) { %> ',
           '<ThumbMediaId><![CDATA[<%-content.thumbMediaId || content.mediaId %>]]></ThumbMediaId>',
           '<% } %>',
           '</Music>',
           '<% } else if (msgType === "voice") { %>',
           '<Voice>',
           '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
           '</Voice>',
           '<% } else if (msgType === "image") { %>',
           '<Image>',
           '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
           '</Image>',
           '<% } else if (msgType === "video") { %>',
           '<Video>',
           '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
           '<Title><![CDATA[<%-content.title%>]]></Title>',
           '<Description><![CDATA[<%-content.description%>]]></Description>',
           '</Video>',
           '<% } else if (msgType === "hardware") { %>',
           '<HardWare>',
           '<MessageView><![CDATA[<%-HardWare.MessageView%>]]></MessageView>',
           '<MessageAction><![CDATA[<%-HardWare.MessageAction%>]]></MessageAction>',
           '</HardWare>',
           '<FuncFlag>0</FuncFlag>',
           '<% } else if (msgType === "device_text" || msgType === "device_event") { %>',
           '<DeviceType><![CDATA[<%-DeviceType%>]]></DeviceType>',
           '<DeviceID><![CDATA[<%-DeviceID%>]]></DeviceID>',
           '<% if (msgType === "device_text") { %>',
           '<Content><![CDATA[<%-content%>]]></Content>',
           '<% } else if ((msgType === "device_event" && Event != "subscribe_status" && Event != "unsubscribe_status")) { %>',
           '<Content><![CDATA[<%-content%>]]></Content>',
           '<Event><![CDATA[<%-Event%>]]></Event>',
           '<% } %>',
           '<SessionID><%=SessionID%></SessionID>',
           '<% } else if (msgType === "transfer_customer_service") { %>',
           '<% if (content && content.kfAccount) { %>',
           '<TransInfo>',
           '<KfAccount><![CDATA[<%-content.kfAccount%>]]></KfAccount>',
           '</TransInfo>',
           '<% } %>',
           '<% } else { %>',
           '<Content><![CDATA[<%-content%>]]></Content>',
           '<% } %>',
           '</xml>'].join('');

// 编译过后的模版
var compiled = ejs.compile(tpl);

var wrapTpl = '<xml>' +
              '<Encrypt><![CDATA[<%-encrypt%>]]></Encrypt>' +
              '<MsgSignature><![CDATA[<%-signature%>]]></MsgSignature>' +
              '<TimeStamp><%-timestamp%></TimeStamp>' +
              '<Nonce><![CDATA[<%-nonce%>]]></Nonce>' +
              '</xml>';

var encryptWrap = ejs.compile(wrapTpl);


var load = function (stream, callback) {
    // support content-type 'text/xml' using 'express-xml-bodyparser', which set raw xml string
    // to 'req.rawBody'(while latest body-parser no longer set req.rawBody), see
    // https://github.com/macedigital/express-xml-bodyparser/blob/master/lib/types/xml.js#L79
    if(stream.rawBody) {
        callback(null, stream.rawBody);
        return;
    }

    var buffers = [];
    stream.on('data', function (trunk) {
        buffers.push(trunk);
    });
    stream.on('end', function () {
        callback(null, Buffer.concat(buffers));
    });
    stream.once('error', callback);
};


// 从微信的提交中提取XML文件
var getMessage = function (stream, callback) {
    load(stream, function (err, buf) {
        if(err) {
            return callback(err);
        };
        var xml = buf.toString('utf-8');
        xml2js.parseString(xml, {trim: true}, callback);
    });
};

// 将 xml2js解析出来的对象转换成直接可访问的对象
var formatMessage = function (result) {
    var message = {};
    if(typeof result === 'object') {
        for (var key in result) {
            if(!(result[key] instanceof Array) || result[key].length === 0){
                continue;
            }
            if(result[key].length === 1) {
                var val = result[key][0];
                if(typeof val === 'object'){
                    message[key] = formatMessage(val);
                }else {
                    message[key] = (val || '').trim();
                }
            }else {
                message[key] = [];
                result[key].forEach(function (item) {
                    message[key].push(formatMessage(item));
                });
            }
        }
    }
    return message;
};

// 将内容回复给微信的封装方法
var reply = function (content, fromUsername, toUsername, message) {
    var info = {};
    var type = 'text';
    info.content = content || '';
    info.createTime = new Date().getTime();
    if (message && (message.MsgType === 'device_text' || message.MsgType === 'device_event')) {
        info.DeviceType = message.DeviceType;
        info.DeviceID = message.DeviceID;
        info.SessionID = isNaN(message.SessionID) ? 0 : message.SessionID;
        info.createTime = Math.floor(info.createTime / 1000);
        if (message['Event'] === 'subscribe_status' || message['Event'] === 'unsubscribe_status') {
            delete info.content;
            info.DeviceStatus = isNaN(content) ? 0 : content;
        } else {
            if (!(content instanceof Buffer)) {
                content = String(content);
            }
            info.content = new Buffer(content).toString('base64');
        }
        type = message.MsgType;
        if (message.MsgType === 'device_event') {
            info['Event'] = message['Event'];
        }
    } else if (Array.isArray(content)) {
        type = 'news';
    } else if (typeof content === 'object') {
        if (content.hasOwnProperty('type')) {
            type = content.type;
            if (content.content) {
                info.content = content.content;
            }
            if (content.HardWare) {
                info.HardWare = content.HardWare;
            }
        } else {
            type = 'music';
        }
    }
    info.msgType = type;
    info.toUsername = toUsername;
    info.fromUsername = fromUsername;
    return compiled(info);
};

/**
 * 根据条件对返回的XML数据加密
 * @param xml
 */
function encryptXml(xml) {
    // if (!req.query.encrypt_type || req.query.encrypt_type === 'raw') {
    return xml;
    // } else {
    //     // 判断是否已有前置cryptor
    //     var cryptor = req.cryptor || handler.cryptor;
    //     var wrap = {};
    //     wrap.encrypt = cryptor.encrypt(xml);
    //     wrap.nonce = parseInt((Math.random() * 100000000000), 10);
    //     wrap.timestamp = new Date().getTime();
    //     wrap.signature = cryptor.getSignature(wrap.timestamp, wrap.nonce, wrap.encrypt);
    //     return encryptWrap(wrap);
    // }
}

module.exports = router;
