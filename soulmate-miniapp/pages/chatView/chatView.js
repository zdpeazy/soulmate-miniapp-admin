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
  onLoad({ toUserId='', talkToUserId='', talkToUserSex='' }) {
    this.setData({
      talkToUserId,
      talkToUserSex
    });
    this.getToUserInfo();
    console.log(this.data)
  },
  /**
     * 生命周期函数--监听页面初次渲染完成
     */
  onReady() {
   
  },
  onUnload: function () {
    // app.globalData.isTalking = false;
  },
  getToUserInfo(){
    app.actions.getUserInfoApi(this.data.talkToUserId).then(json => {
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
    if(app.globalData.me.sex == 'M'){
      wx.navigateTo({
        url: '../contact/contact?type=oneToOne&talkToUserId=' + this.data.talkToUserId + '&toUserSex=' + this.data.toUser.sex,
      });
    }else{
      this.goTalking();
    }
  },
  goTalking(){
    app.actions.chartStart(app.globalData.user.userId, app.globalData.me.sex, this.data.talkToUserId, this.data.talkToUserSex)
      .then(res => {
        console.log('12312312313123',res)
        if(res.code == 0){
          wx.navigateTo({
            url: '../talking/talking?roomID=' + res.data.roomId 
            + '&streamId=' + res.data.streamid 
            + '&toUserId=' + res.data.toUserId 
            + '&talkToUserId=' + this.data.talkToUserId
            + '&fromUserId=' + res.data.fromUserId
          });
        }
      });
  },
  lookDetail(){
    wx.navigateTo({
      url: '../personalCenter/personalCenter?toUserId=' + this.data.talkToUserId,
    })
  },
  ..._methods
})
