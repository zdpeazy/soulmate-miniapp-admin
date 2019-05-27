import _actions from './common/actions.js';
import config from './common/config.js';

App({
  onLaunch: function () {
    this.actions = new _actions();
    this.globalData = Object.assign(this.globalData, config);
    this.get
  },
  login(cb){
    let _t = this;
    wx.login({
      success: res => {
        if (res.code) {
          this.actions.getOpenId(res.code)
            .then(json => {
              if(json.code * 1 == 0){
                wx.setStorage({
                  key: 'user',
                  data: json.data
                });
                _t.globalData.user = json.data;
                _t.getChatStatus(json.data.userId);
                _t.timer = setInterval(res => {
                  if(!_t.globalData.polling) return;
                  _t.getChatStatus(json.data.userId);
                }, 7000)
                cb && cb();
              } else {
                wx.showToast({
                  title: '获取openid失败',
                  duration: 1500
                })
              }
            })
        }
      }
    })
  },
  // 拉去聊天信息
  getChatStatus(userId){
    let _t = this;
    _t.actions.mFetchChat(userId)
      .then(res => {
        console.log('polling',res)
        if(res.code == 0 && res.data){
          if(this.globalData.isTalking) return;
          let talkToUserId = res.data.fromUserId == this.globalData.user.userId ? res.data.toUserId : res.data.fromUserId;
          if(res.data.chatStatus == 2){
            if(_t.globalData.isContacting) return;
            _t.globalData.isContacting = true;
            wx.navigateTo({
              url: '../contact/contact?&talkToUserId=' + talkToUserId 
              + '&type=confirm&fromUserId=' + res.data.fromUserId
              + '&streamId=' + res.data.streamid 
              + '&toUserId=' + res.data.toUserId 
              + '&fromUserId=' + res.data.fromUserId
              + '&roomID=' + res.data.roomId
            });
          }else if(res.data.chatStatus == 3){  //已经在聊天
            wx.navigateTo({
              url: '../talking/talking?roomID=' + res.data.roomId 
              + '&streamId=' + res.data.streamid 
              + '&toUserId=' + res.data.toUserId 
              + '&talkToUserId=' + talkToUserId
              + '&fromUserId=' + res.data.fromUserId
            });
            _t.globalData.isTalking = true;
          }else if(res.data.chatStatus == 1){  //男的是发起方，需要确认
            if(res.data.fromUserId == _t.globalData.user.userId){ //我是发起方
              if(res.data.fromUserSex == "F"){ //我是女的
                _t.globalData.isContacting = true;
                // wx.navigateTo({
                //   url: '../contact/contact?&toUserId=' + toUserId + '&type=confirm&fromUserId=' + res.data.fromUserId,
                // });
              }else{ //我是男的

              }
            }else{ //我是被发起方
              if(_t.globalData.me.sex == "F"){ //我是女的，先确认我方不方便
                if(_t.globalData.isContacting) return;
                _t.globalData.isContacting = true;
                wx.navigateTo({
                  url: '../chatView/chatView?&talkToUserId=' + talkToUserId 
                  + '&type=confirm&fromUserId=' + res.data.fromUserId
                  + '&toUserId=' + res.data.toUserId,
                });
              }else{ //我是男的，去确认接听还是拒绝
                if(_t.globalData.isContacting) return;
                _t.globalData.isContacting = true;
                wx.navigateTo({
                  url: '../contact/contact?&talkToUserId=' + talkToUserId + '&type=wait&fromUserId=' + res.data.fromUserId,
                });
              }
            }
          }else if(res.data.chatStatus == 4924){
            
          }
        }
      })
  },
  editTabBar: function () {
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;
    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }
    var tabBar = this.globalData.tabBar;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == _pagePath) {
        tabBar.list[i].active = true;//根据页面地址设置当前页面状态
      }
    }
    _curPage.setData({
      tabBar: tabBar
    });
  },

  globalData: {
    me: null,
    polling: true,
    isContacting: false,
    isTalking: false,
    userInfo: null,
    user: null,
    tabBar: {
      color: "#666666",
      selectedColor: "#e17b76",
      borderStyle: "#eeeeee",
      list: [
        {
          iconPath: "/images/index.png",
          selectedIconPath: "/images/index-active.png",
          pagePath: "/pages/index/index",
          text: "首页",
          clas: "menu-item",
          selected: false,

        },
        {
          iconPath: "/images/discover.png",
          selectedIconPath: "/images/discover-active.png",
          pagePath: "/pages/discover/discover",
          text: "发现",
          clas: "menu-item",
          selected: false
        },

        {
          iconPath: "/images/chat.png",
          selectedIconPath: "/images/chat-active.png",
          pagePath: "/pages/chat/chat",
          text: "聊天",
          clas: "menu-item",
          selected: false
        },

        {
          iconPath: "/images/user.png",
          selectedIconPath: "/images/user-active.png",
          pagePath: "/pages/user/user",
          text: "我的",
          clas: "menu-item",
          selected: false
        }
      ],
      position: "bottom"
    }
  }
})
