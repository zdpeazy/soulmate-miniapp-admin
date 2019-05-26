var prex = 0;
const app = getApp()

Page({
  data: {
    person2: null,
    person1: null,
    x: 0,
    y: 0,
    hiddenimg: true,
    move: null,
    userList: [],
    currentUserId: '',
    current: 0
  },
  onLoad: function () {
    app.editTabBar();
    this.userList();
  },
  userList(){
    let _t = this;
    app.actions.getUserDiscover('U5ce7a5e3e96725137feca91d')
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
          currentUserId: userList[0].userId,
          person1: userList[_t.data.current],
          person2: userList[_t.data.current + 1],
        })
      })
  },
  moveimg: function (e) {
    let that = this;
    prex = e.detail.x;
  },
  touchendimg: function (e) {
    let that = this;
    if (prex < -200 || prex > 200) {
      that.setData({
        current: that.data.current + 1,
        hiddenimg: false,
      }, () => {
        setTimeout(function () {
          that.setData({
            hiddenimg: true,
            person1: that.data.person2,
            person2: that.data.userList[that.data.current + 1]
          })
        }, 300)
      })

    } else {
      setTimeout(function () {
        that.setData({
          x: 0,
          y: 0
        })
      }, 300);
    }
  },
  nextUser(){
    if(this.data.current == this.data.userList.length){
      return wx.showToast({
        title: '没有更多了',
        icon: 'none'
      })
    }
    this.next(false);
  },
  next(like){
    let that = this, dis = -400;
    if(like){
      dis = 400;
    }
    let animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
      delay: 0,
      transformOrigin: "60%, 40%",
    });
    animation.rotate(30).translateX(-400).opacity(0).step();
    this.setData({
      move: animation.export(),
      current: that.data.current + 1
    })
    setTimeout(()=>{
      animation.rotate(0).translateX(0).opacity(1).step({duration: 0, transformOrigin: "60%, 40%", timingFunction: 'step-start'})
      that.setData({
        person1: that.data.person2,
        move: animation.export(),
        person2: that.data.userList[that.data.current + 1]
      })
    }, 1000);
  },
  attention(){
    if(this.data.current == this.data.userList.length){
      return;
    }
    let _t = this;
    app.actions.mAttention('U5ce7a5e3e96725137feca91d', _t.data.person1.userId)
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
        });
        _t.next(true);
      })
  }
})
