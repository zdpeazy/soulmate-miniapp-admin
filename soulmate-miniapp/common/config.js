// const config = {
//   env: 'dev',
//   apiUrl: 'https://api.soulmateyuyin.cn',
//   liveAppID: 1739272706,
//   rtcAppID: 1082937486, 
//   testEnvironment: 0,//如果是测试环境需要改成1，正式为0
//   tokenURL: "https://wssliveroom-demo.zego.im/token",
//   roomListURL: "https://liveroom1739272706-api.zego.im/demo/roomlist?appid=1739272706",//房间列表接口需要向后台申请才能使用
//   wsServerURL: "wss://wssliveroom-demo.zego.im/ws",//即构demo专用，开发者请填写即构邮件发送给你的
//   logServerURL: "https://wsslogger-demo.zego.im/httplog",//可不填，sdk有配置时，配置的地址会覆盖这个地址,
//   cgi_token: "", //即构测试用,开发者请忽略
//   // apiUrl: 'http://172.16.140.247'
// }
const config = {
  env: 'production',
  apiUrl: 'https://api.soulmateyuyin.cn',
  liveAppID: 988847216,
  rtcAppID: 1082937486, 
  testEnvironment: 0,
  tokenURL: "https://wssliveroom-demo.zego.im/token",
  roomListURL: "https://liveroom988847216-api.zego.im/demo/roomlist?appid=1739272706",
  wsServerURL: "wss://wssliveroom988847216-api.zego.im/ws",
  logServerURL: 'https://wsslogger988847216-api.zego.im/httplog',
  cgi_token: "", //即构测试用,开发者请忽略
  // apiUrl: 'http://172.16.140.247'
}

export default config