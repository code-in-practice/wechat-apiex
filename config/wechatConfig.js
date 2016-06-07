module.exports = {
    wechatAppID: 'wx26e0fb0e11a15af4',
    wechatAppsecret: 'd4624c36b6795d1d99dcf0547af5443d',
    wechatRedirectUri: 'http://huanhuan.rockywu.me/user',
    wechatAuthUrlUserInfo: 'https://open.weixin.qq.com/connect/oauth2/authorize?'
                    + 'appid=' + this.wechatAppID
                    + '&redirect_uri=' + this.wechatRedirectUri
                    + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
    wechatAuthUrlBase: 'https://open.weixin.qq.com/connect/oauth2/authorize?'
                           + 'appid=' + this.wechatAppID
                           + '&redirect_uri=' + this.wechatRedirectUri
                           + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect',
    token: "rhtsjz"
}
