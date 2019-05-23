let { liveAppID: appID, tokenURL, wsServerURL, testEnvironment } = getApp().globalData;
let { getLoginToken } = require("../../common/server.js");
let { sharePage } = require("../../common/util.js");
//获取应用实例
const app = getApp();

let _methods = {
  onRoomEvent(ev) {
    console.log('onRoomEvent', ev);
  },
  showMessage() {
    this.setData({
      isMessageHide: !this.data.isMessageHide
    });
  },

  bindMessageInput(e) {
    this.data.inputMessage = e.detail.value;
  },

  onComment() {
    console.log('>>>[liveroom-room] begin to comment', this.data.inputMessage);

    let message = {
      id: this.data.idName + Date.parse(new Date()),
      name: this.data.idName,
      time: new Date().format("hh:mm:ss"),
      content: this.data.inputMessage,
    };

    this.data.messageList.push(message);
    console.log('>>>[liveroom-room] currentMessage', this.data.inputMessage);

    this.setData({
      messageList: this.data.messageList,
      inputMessage: "",
      scrollToView: message.id,
    });

    this.showMessage();

    this.data.component.sendRoomMsg(1, 1, message.content,
      function (seq, msgId, msg_category, msg_type, msg_content) {
        console.log('>>>[liveroom-room] onComment success');
      }, function (err, seq, msg_category, msg_type, msg_content) {
        console.log('>>>[liveroom-room] onComment, error: ');
        console.log(err);
      }
    );
  },

  canUseMixStream() {
    return true;
  },
  mixStream() {
    if (!this.canUseMixStream()) return;

    this.setData({
      mixStreamStart: !this.data.mixStreamStart,
    });

    if (this.data.mixStreamStart) {
      //start mix
      this.updateMixStream();
    } else {
      //stop mix
      this.stopMixStream();
    }
  },
  playMixStream() {
    if (!this.canUseMixStream()) return;

    //未开始混流，不能播放混流
    if (!this.data.playMixStreamStart && !this.data.mixStreamStart) {
      return;
    }
    this.setData({
      playMixStreamStart: !this.data.playMixStreamStart,
    });

    if (this.data.playMixStreamStart) {
      //start play mix
      this.startPlayingMixStream();
    } else {
      //stop play mix
      this.stopPlayingMixStream();
    }
  },


  updateMixStream() {
    let streamList = [{
      streamId: this.data.pushStreamId,
      top: 0,
      left: 0,
      bottom: 320,
      right: 240,
    }];

    this.data.component.updateMixStream({
      outputStreamId: this.data.mixStreamId,
      outputBitrate: 300 * 1000,
      outputFps: 15,
      outputWidth: 240,
      outputHeight: 320,
      streamList: streamList
    }, (mixStreamId, mixStreamInfo) => {
      console.log('mixStreamId: ' + mixStreamId);
      console.log('mixStreamInfo: ' + JSON.stringify(mixStreamInfo));
    }, (err, errorInfo) => {
      console.log('err: ' + JSON.stringify(err));
      console.log('errorInfo: ' + JSON.stringify(errorInfo));
    });
  },
  stopMixStream() {
    this.data.component.stopMixStream({
      outputStreamId: this.data.mixStreamId
    },
      () => {
        console.log('stopMixStream suc')
      },
      err => {
        console.log('stopMixStream err', err)
      })
  },
  startPlayingMixStream() {
    this.data.component.startPlayingMixStream(this.data.mixStreamId)
  },
  stopPlayingMixStream() {
    this.data.component.stopPlayingMixStream(this.data.mixStreamId);
  }
};

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
    playMixStreamStart: false,
    toUserImgUrls: [],
    toUser: {}
  },
  onLoad({ roomID = 'R5ce048c8e96725678032ce08', streamId, toUserId }) {
    let timestamp = new Date().getTime();
    this.setData({
      idName: 'xcxU' + timestamp,
      pushStreamId: 'xcxS' + timestamp,
      mixStreamId: 'xcxMixS' + timestamp,
      roomID,
      toUserId,
      roomName: roomID,
      roomType: '1v1',
      streamId
    });
    this.getToUserInfo();
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
  getToUserInfo(){
    app.actions.getUserInfoApi(this.data.toUserId).then(json => {
      if(json.code == 0){
        this.setData({
          toUserImgUrls: json.data.icon.split(','),
          toUser: json.data,
        })
      }
    })
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
      url: '../contact/contact?toUserId=' + this.data.toUserId,
    })
  },
  lookDetail(){
    wx.navigateTo({
      url: '../personalCenter/personalCenter?toUserId=' + this.data.toUserId,
    })
  },
  ..._methods
})
