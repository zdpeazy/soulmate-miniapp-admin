const app = getApp()

Page({
  data: {
    userList: [],
    currentUserId: '',
    current: 0
  },
  onLoad() {
    app.editTabBar();
    this.userList();
  },
  // 发现用户列表
  userList(){
    let _t = this;
    app.actions.getUserDiscover(app.globalData.user.userId)
      .then(json => {
        if (json.code * 1 != 0) {
          wx.showModal({
            showCancel: false,
            content: json.message
          })
          return;
        }
        let userList = json.data.userList;
        userList.map((item, index) => {
          let imgUrl = item.icon;
          item.headerUrl = imgUrl.split(',')[0];
        })

        _t.setData({
          userList: userList,
          currentUserId: userList[0].userId
        })
      })
  },
  swiperChange(e){
    console.log(e)
    this.setData({
      currentUserId: e.detail.currentItemId
    })
  },
  // 上下切换
  prevUser: function () {
    let _t = this;
    let current = _t.data.current;
    current = current > 0 ? current - 1 : _t.data.userList.length - 1;
    this.setData({
      current: current
    })
  },
  nextUser: function () {
    let _t = this;
    let current = _t.data.current;
    current = current < (_t.data.userList.length - 1) ? current + 1 : 0;
    _t.setData({
      current: current
    })
  },
  // 喜欢
  attention(){
    let _t = this;
    app.actions.mAttention(app.globalData.user.userId, _t.data.currentUserId)
      .then( json => {
        if (json.code * 1 != 0) {
          wx.showModal({
            showCancel: false,
            content: json.message
          })
          return;
        }

        wx.showToast({
          title: '关注成功',
          icon: 'success',
          duration: 1500
        })
      })
  }
})
