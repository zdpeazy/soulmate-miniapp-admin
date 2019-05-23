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
    app.actions.chartStart(app.globalData.user.userId, 'F').then((json) => {
      if(json.code != 0){
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
      // _t.setData({
      //   ...json.data
      // })

      console.log(_t.data.roomId)
    })
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