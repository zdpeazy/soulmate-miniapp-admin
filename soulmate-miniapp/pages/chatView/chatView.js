let { liveAppID: appID, tokenURL, wsServerURL, testEnvironment } = getApp().globalData;
let { getLoginToken } = require("../../common/server.js");
let { sharePage } = require("../../common/util.js");
//获取应用实例
const app = getApp();

Page({
  data: {
    toUserId: '',
    roomID: '',
    roomName: '',
    roomType: '',
    component: null,
    idName: '',
    pushStreamId: '',
    mixStreamId: '',
    pureAudio: false,
    muted: false,
    beauty: true,

    component: null,
    isMessageHide: true,
    messageList: [],
    inputMessage: '',
    scrollToView: '',
    mixStreamStart: false,
    playMixStreamStart: false
  },
  onLoad({ roomId = 'R5ce048c8e96725678032ce08', streamId = 'C5ce048c8e96725678032ce07', toUserId, roomType = 0 }) {
    let timestamp = new Date().getTime();
    this.setData({
      idName: 'xcxU' + timestamp,
      pushStreamId: 'C5ce048c8e96725678032ce07',
      mixStreamId: 'C5ce048c8e96725678032ce07',
      roomID: 'R5ce048c8e96725678032ce08',
      toUserId,
      roomName: roomId,
      roomType: roomType == 1 ? 'wrap' : '1v1'
    });
    console.log(this.data)
  },
  /**
     * 生命周期函数--监听页面初次渲染完成
     */
  onReady() {
    // 进入房间，自动登录
    getLoginToken(this.data.idName, appID).then(token => {
      this.setData({
        token,
      });
      this.data.component = this.selectComponent("#rtcRoom");
      this.data.component.config({
        appid: appID, // 必填，应用id，由即构提供
        idName: this.data.idName, // 必填，用户自定义id
        nickName: this.data.idName, // 必填，用户自定义昵称
        remoteLogLevel: 0, // 日志上传级别，建议取值不小于 logLevel
        logLevel: 0, // 日志级别，debug: 0, info: 1, warn: 2, error: 3, report: 99, disable: 100（数字越大，日志越少）
        server: wsServerURL,//,"wss://wssliveroom-demo.zego.im/ws", // 必填，服务器地址，由即构提供
        logUrl: "https://wsslogger-demo.zego.im/httplog", // 选填，log 服务器地址，由即构提供
        audienceCreateRoom: false, // 观众不允许创建房间
        testEnvironment: !!testEnvironment
      });
      this.data.component.start(this.data.token);
    });
  },
  onShow() {
    //刷新全局变量
    appID = getApp().globalData.liveAppID;
    tokenURL = getApp().globalData.tokenURL;
    wsServerURL = getApp().globalData.wsServerURL;
    testEnvironment = getApp().globalData.testEnvironment;
  },
  contact(){
    wx.navigateTo({
      url: '../contact/contact',
    })
  },
  lookDetail(){
    wx.navigateTo({
      url: '../personalCenter/personalCenter',
    })
  }
})
