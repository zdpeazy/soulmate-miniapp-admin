//获取应用实例
const app = getApp()

Page({
  data: {
    timer: null,
    chatMatchCount: 0,
    nickName: '',
    icon: '',
    canrecord: false
  },

  onLoad(options) {
    let _t = this;
    app.editTabBar();
    app.login(() => {
      let userInfo = wx.getStorageSync("userInfo");
      _t.getLocation(() => {
        if (!userInfo) {
          wx.redirectTo({
            url: '../begin/begin',
          })
        } else {
          app.globalData.userInfo = userInfo;
          _t.getUserInfo();
        }
      });
    })
    
  },
  onReady(){
    this.authCheck();
  },
  getLocation(cb) {
    let _t = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        _t.uploadPostion(res.latitude, res.longitude, cb)
      },
      fail() {
        _t.setAuth();
      }
    })
  },
  setAuth() {
    let _t = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation'] || !res.authSetting['scope.userInfo']) {
          wx.showModal({
            showCancel: false,
            content: '请允许获取权限',
            success(res) {
              if (res.confirm) {
                wx.openSetting({
                  success() {
                    _t.getLocation(() => {
                      let userInfo = wx.getStorageSync("userInfo");
                      if (!userInfo) {
                        wx.redirectTo({
                          url: '../index/index',
                        })
                      } else {
                        app.globalData.userInfo = userInfo;
                        _t.getUserInfo();
                      }
                    });
                  }
                })
              }
            }
          })
        } else {
          _t.getLocation(() => {
            if (userInfo) {
              app.globalData.userInfo = userInfo;
            }
          });
        }
      }
    })
  },
  uploadPostion(lat, lon, cb) {
    let _t = this;
    app.actions.uploadPositionApi({
      userId: app.globalData.user.userId,
      lat,
      lon
    }).then(json => {
      if (json.code * 1 == 0) {
        cb && cb();
      }
    })
  },
  getUserInfo(){
    let _t = this;
    app.actions.getUserInfoApi(app.globalData.user.userId)
      .then(json => {
        if(json.code == 0){
          _t.setData({
            chatMatchCount: json.data.chatMatchCount,
            nickName: json.data.nickName,
            icon: json.data.icon
          })
        }
      })
  },
  searchFriend(){
    let _t = this;
    if (!_t.data.canrecord){
      _t.openRecordSetting();
      return;
    }
    app.actions.chartStart(app.globalData.user.userId, 'F').then((json) => {
      if (json.code * 1 != 0) {
        wx.showModal({
          showCancel: false,
          content: json.message
        })
      }
      wx.showLoading({
        title: '正在匹配中',
        mask: true
      })
      setTimeout(() => {
        _t.gotoChatView(json.data.toUserId);
      }, 3000)
    })
  },
  gotoChatView(oppositeUserId) {
    let _t = this;
    app.actions.chartStart(app.globalData.user.userId, 'F').then((json) => {
      if (json.code != 0) {
        wx.showModal({
          showCancel: false,
          content: json.message
        })
        return;
      }
      // roomId R5ce039b7e96725678032cdd8
      wx.navigateTo({
        url: '../chatView/chatView?roomID=' + json.data.roomId + '&streamId=' + json.data.streamid + '&toUserId=' + oppositeUserId
      });
    })
  },
  // 打开语音授权页面
  openRecordSetting() {
    let _t = this;
    wx.openSetting({
      success(res) {
        if (res.authSetting['scope.record']) {
          _t.setData({
            canrecord: true
          });
        }
      }
    })
  },
  // 语音授权
  authCheck() {
    let _t = this;
    wx.getSetting({
      success: ({ authSetting }) => {
        console.log(authSetting)
        //推流必须要有这两权限
        if (!authSetting['scope.record'] ) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              _t.setData({
                canrecord: true
              });
            },
            fail() {
              _t.setData({
                canrecord: false
              });
            }
          });


        } else if (!wx.createLivePlayerContext) {
          wx.showModal({
            title: '提示',
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后再试。',
            showCancel: false,
          });
          this.setData({
            canrecord: false
          });
        } else {
          this.setData({
            canrecord: true
          });
        }

      }
    });
  }
})