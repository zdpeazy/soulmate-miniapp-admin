const app = getApp()

Page({
  data: {
    fansList: [],
    currentPage: 1,
    pageSize: 20
  },

  onLoad: function (options) {
    let _t = this;
    app.editTabBar();
    _t.getFansList();
  },
  gotoChatView(e){
    console.log(e.currentTarget.dataset.userid)
    let _t = this;
    let oppositeUserId = e.currentTarget.dataset.userid;
    let sex = e.currentTarget.dataset.sex;
    wx.navigateTo({
      url: '../chatView/chatView?talkToUserId=' + oppositeUserId + '&talkToUserSex=' + sex
    });
  },
  getFansList(){
    let _t = this;
    app.actions.getMyFans(app.globalData.user.userId, this.data.currentPage, this.data.pageSize)
      .then(json => {
        if (json.code == 0) {
          _t.setData({
            fansList: _t.data.fansList.concat(json.data.likeMeUserIdList),
            currentPage: this.data.currentPage + 1
          })
        }
      });
  }
})