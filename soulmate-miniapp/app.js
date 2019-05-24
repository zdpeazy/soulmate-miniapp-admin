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
                }, 10000)
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
        if(res.code == 0 && res.data){
          if(this.globalData.isTalking || this.globalData.isContacting) return;
          let talkToUserId = res.data.fromUserId == this.globalData.user.userId ? res.data.toUserId : res.data.fromUserId;
          if(res.data.chatStatus == 2){  //男方先匹配，不需要确认,或者已经确认
            wx.navigateTo({
              url: '../talking/talking?roomID=' + res.data.roomId 
              + '&streamId=' + res.data.streamid 
              + '&toUserId=' + res.data.toUserId 
              + '&talkToUserId=' + talkToUserId
              + '&fromUserId=' + res.data.fromUserId
            });
            _t.globalData.isTalking = true;
          }else if(res.data.chatStatus == 1){  //女方先匹配，女的是发起方，需要确认
            if(res.data.fromUserId == _t.globalData.user.userId){ //我是发起方
              if(res.data.fromUserSex == "F"){ //我是女的
                _t.globalData.isContacting = true;
                wx.navigateTo({
                  url: '../contact/contact?&toUserId=' + toUserId + '&type=confirm&fromUserId=' + res.data.fromUserId,
                });
              }else{ //我是男的

              }
            }else{ //我是被发起方
              if(res.data.toUserSex == "F"){ //我是女的

              }else{ //我是男的
                _t.globalData.isContacting = true;
                wx.navigateTo({
                  url: '../contact/contact?&toUserId=' + toUserId + '&type=wait&fromUserId=' + res.data.fromUserId,
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
