//index.js
//获取应用实例
let { liveAppID: appID, tokenURL, wsServerURL, testEnvironment, logServerURL } = getApp().globalData;
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
    topicList: [{topic: '你的童年快乐吗，为什么？'}],
    currentTopic: 0,
    toUser: {},
    sec: '00',  //秒
    min: 0   //分
  },
  onLoad({ roomID = 'R5ce048c8e96725678032ce08', streamId, toUserId, talkToUserId, fromUserId}) {
    app.globalData.isTalking = true;
    let timestamp = new Date().getTime();
    this.setData({
      idName: app.globalData.user.userId,
      pushStreamId: 'xcxS' + timestamp,
      mixStreamId: 'xcxMixS' + timestamp,
      roomID,
      toUserId,
      fromUserId,
      talkToUserId,
      roomName: roomID,
      roomType: '1v1',
      streamId
    });
    this.getToUserInfo();
    this.getTopic();
    console.log(this.data)
  },
  /**
     * 生命周期函数--监听页面初次渲染完成
     */
  onReady() {
    // 进入房间，自动登录
    getLoginToken(app.globalData.user.userId, appID).then(token => {
      this.setData({
        token
      });
      console.log(this.data.token)
      this.data.component = this.selectComponent("#rtcRoom");
      this.data.component.config({
        appid: appID, // 必填，应用id，由即构提供
        idName: this.data.idName, // 必填，用户自定义id
        nickName: this.data.idName, // 必填，用户自定义昵称
        remoteLogLevel: 0, // 日志上传级别，建议取值不小于 logLevel
        logLevel: 0, // 日志级别，debug: 0, info: 1, warn: 2, error: 3, report: 99, disable: 100（数字越大，日志越少）
        server: wsServerURL,//,"wss://wssliveroom-demo.zego.im/ws", // 必填，服务器地址，由即构提供
        logUrl: logServerURL, // 选填，log 服务器地址，由即构提供
        audienceCreateRoom: false, // 观众不允许创建房间
        testEnvironment: !!testEnvironment
      });
      this.data.component.start(this.data.token);
      this.startCount();
      app.globalData.polling = false;
    });
  },
  onUnload: function () {
    clearInterval(this.count);
    app.globalData.polling = true;
    app.globalData.isTalking = false;
    this.data.component && this.data.component.stop();
  },
  getToUserInfo(){
    let _t = this;
    app.actions.getUserInfoApi(this.data.talkToUserId).then(json => {
      if(json.code == 0){
        _t.setData({
          toUserImgUrls: json.data.icon.split(','),
          toUser: json.data,
        })
      }
    })
  },
  nextTopic(){
    let that = this;
    if((this.data.currentTopic + 1) == this.data.topicList.length){
      this.setData({
        currentTopic: 0
      })
    }else{
      this.setData({
        currentTopic: this.data.currentTopic + 1
      })
    }
  },
  getTopic(){
    let that = this
    app.actions.getTopicList(app.globalData.user.userId, this.data.toUserId)
      .then(res => {
        if(res.code == 0){
          that.setData({
            topicList: res.data.topicDTOList
          })
        }
      });
  },
  muted(){
    this.data.component.toggleMuted();
  },
  finish(){
    this.data.component.stop();
    wx.redirectTo({
      url: '../common/common?toUserId=' + this.data.toUserId 
            + '&time=' + this.data.min + ':' + this.data.sec 
            + '&icon=' + this.data.toUserImgUrls[0]
            + '&nickName=' + this.data.toUser.nickName
            + '&chatId=' + this.data.streamId
            + '&fromUserId=' + this.data.fromUserId
    })
  },
  startCount(){
    let s = 0, str = '00', _t = this;
    this.count = setInterval(() => {
      s++
      _t.setData({
        sec: (str + s).substr(-2)
      })
      if(s == 60){
        s = 0;
        _t.setData({
          min: _t.data.min + 1
        });
      }
    }, 1000);
  },
  onShow() {
    //刷新全局变量
    appID = getApp().globalData.liveAppID;
    tokenURL = getApp().globalData.tokenURL;
    wsServerURL = getApp().globalData.wsServerURL;
    testEnvironment = getApp().globalData.testEnvironment;
  },
  ..._methods
})

