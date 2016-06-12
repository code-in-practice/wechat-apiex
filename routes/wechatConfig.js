exports.wechat = {
    appID: 'wx26e0fb0e11a15af4',
    secret: 'd4624c36b6795d1d99dcf0547af5443d',
    redirectUri: 'http://huanhuan.rockywu.me/user/auth/callback',
    scopeUserInfo: 'snsapi_userinfo',
    scopeBase: 'snsapi_base',
    token: "rhtsjz",
    grantTypeAuthorizationCode: 'authorization_code',
    grantTypeRefreshToken: 'refresh_token',
    grantTypeClientCredential: 'client_credential',
    urlSnsOauth2AccessToken: 'https://api.weixin.qq.com/sns/oauth2/access_token',
    urlSnsOauth2RefreshToken: 'https://api.weixin.qq.com/sns/oauth2/refresh_token',
    urlSnsAuth: 'https://api.weixin.qq.com/sns/auth',
    urlSnsUserInfo: 'https://api.weixin.qq.com/sns/userinfo',
    urlCgiBinToken: 'https://api.weixin.qq.com/cgi-bin/token',
    urlCgiBinTicket: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
    urlCgiBinMediaGet: 'https://file.api.weixin.qq.com/cgi-bin/media/get',
    urlCgiBinMessageTemplateSend: 'https://api.weixin.qq.com/cgi-bin/message/template/send',
    ticketTypeJsApi: 'jsapi'
};

exports.hw = {
    maindomain: 'huanhuan.rockywu.me'
}

exports.wechatAuthUrl = function (redirectUri, scope) {
    return 'https://open.weixin.qq.com/connect/oauth2/authorize?'
           + 'appid=' + 'wx26e0fb0e11a15af4'
           + '&redirect_uri=' + redirectUri
           + '&response_type=code'
           + '&scope=' + scope
           + '&state=STATE#wechat_redirect'
}


