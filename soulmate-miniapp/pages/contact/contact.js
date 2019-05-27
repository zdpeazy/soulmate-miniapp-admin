//index.js
//获取应用实例
const app = getApp()

Page({
  data:{
    type: '',
    fromUserId: '',
    toUserId: '',
    toUserSex: '',
    toUserImgUrls: [],
    toUser: {},
    roomID: '',
    roomName: '',
    streamId: '',
  },
  onLoad: function (options) {
    this.setData({
      type: options.type,
      fromUserId: options.fromUserId || '',
      talkToUserId: options.talkToUserId || '',
      toUserSex: options.toUserSex || '',
      roomID: options.roomID || '',
      streamId: options.streamId || '',
      toUserId: options.toUserId || ''
    })
    app.editTabBar();
    this.getToUserInfo();
    // setTimeout(() => {
    //   wx.redirectTo({
    //     url: '../talking/talking',
    //   })
    // }, 1000)
  },
  onReady(){
    app.globalData.polling = true;
    if(this.data.type == 'oneToOne'){
      app.actions.chartStart(app.globalData.user.userId, app.globalData.me.sex, this.data.talkToUserId, this.data.toUserSex)
        .then(res => {
        });
    }
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
  confirmChat(e){
    let _t = this;
    let agree = e.currentTarget.dataset.res;
    if(app.globalData.me.sex == 'M'){
      if(agree == 'Y'){
        wx.navigateTo({
          url: '../talking/talking?roomID=' + _t.data.roomID 
          + '&streamId=' + _t.data.streamid 
          + '&toUserId=' + _t.data.toUserId 
          + '&talkToUserId=' + _t.data.talkToUserId
          + '&fromUserId=' + _t.data.fromUserId
        });
      }else{
        wx.navigateBack({delta: 1})
      }
    }else{
      app.actions.fConfirm(this.data.fromUserId, app.globalData.user.userId, agree).then(res => {
        if(agree == 'Y'){
          let toUserId = res.data.fromUserId == app.globalData.user.userId ? res.data.toUserId : res.data.fromUserId;
          wx.redirectTo({
            url: '../talking/talking?roomID=' + res.data.roomID 
            + '&streamId=' + res.data.streamid 
            + '&toUserId=' + toUserId
            + '&talkToUserId=' + _t.data.talkToUserId
            + '&fromUserId=' + res.data.fromUserId,
          });
          app.globalData.isTalking = true;
        }else{
          app.globalData.isTalking = false;
          app.globalData.isContacting = false;
          app.globalData.polling = true;
          wx.navigateBack({delta: 1});
        }
      });
    }
    
  },
  click(){
    let _t = this;
    
  }
})
