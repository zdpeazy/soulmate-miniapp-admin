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
          currentUserId: userList[0].userId,
          person1: userList[_t.data.current],
          person2: userList[_t.data.current + 1] || that.data.userList[that.data.current],
        })
      })
  },
  moveimg: function (e) {
    console.log(e)
    let that = this;
    if(e.detail.source == 'touch'){
      prex = e.detail.x;
    }
  },
  touchendimg: function (e) {
    let that = this;
    this.setData({
      x: 0,
      y: 0
    })
    if (prex < -150 || prex > 150) {
      if(that.data.current == that.data.userList.length){
        return wx.showToast({
          title: '没有更多了',
          icon: 'none'
        });
      }
      that.setData({
        current: that.data.current + 1,
        hiddenimg: false,
      }, () => {
        setTimeout(function () {
          that.setData({
            hiddenimg: true,
            person1: that.data.person2,
            person2: that.data.userList[that.data.current + 1] || that.data.person2,
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
    if((this.data.current+1) == this.data.userList.length){
      return wx.showToast({
        title: '没有更多了',
        icon: 'none'
      })
    }
    this.next(false);
  },
  next(like){
    let that = this, dis = -400, deg = 30;
    if(like){
      dis = 400;
      deg = -30;
    }
    let animation = wx.createAnimation({
      duration: 700,
      timingFunction: "ease",
      delay: 0,
      transformOrigin: "60%, 40%",
    });
    animation.translateX(dis).opacity(0).step();
    this.setData({
      move: animation.export(),
      current: that.data.current + 1
    })
    setTimeout(()=>{
      animation.translateX(0).opacity(1).step({duration: 100, transformOrigin: "60%, 40%", timingFunction: 'step-start'})
      setTimeout(()=>{
        that.setData({
          person1: that.data.person2,
          move: animation.export(),
          person2: that.data.userList[that.data.current + 1] || that.data.person2
        });
      }, 100)
    }, 900);
  },
  attention(){
    if((this.data.current + 1) == this.data.userList.length){
      return wx.showToast({
        title: '没有更多了',
        icon: 'none'
      });
    }
    let _t = this;
    app.actions.mAttention(app.globalData.user.userId, _t.data.userList[_t.data.current].userId)
      .then( json => {
        if (json.code * 1 != 0) {
          wx.showModal({
            showCancel: false,
            content: json.message
          })
          return;
        }
        _t.next(true);
      })
  }
})
