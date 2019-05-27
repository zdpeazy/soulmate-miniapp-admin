var prex = 0;
const app = getApp()

Page({
  data: {
    person2: null,
    person1: null,
    x: 0,
    y: 0,
    hiddenimg: true,
    move: [],
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
          current: userList.length - 1
        })
      })
  },
  nextUser(){
    if(this.data.current <= 0){
      return wx.showToast({
        title: '没有更多了',
        icon: 'none'
      })
    }
    this.next(false);
  },
  next(like){
    let that = this, dis = -400, move = this.data.move;
    if(like){
      dis = 400;
    }
    let animation = wx.createAnimation({
      duration: 700,
      timingFunction: "ease",
      delay: 0,
      transformOrigin: "60%, 40%",
    });
    animation.translateX(dis).opacity(0).step();
    move[this.data.current] = animation.export(),
    this.setData({
      move,
      current: that.data.current - 1,
    });

    setTimeout(()=>{
      animation.scale(0).step();
      move[this.data.current + 1] = animation.export(),
      this.setData({
        move,
      });
    }, 300)

    // setTimeout(() => {
    //   that.setData({
    //     person1: that.data.person2,
    //     person2: that.data.userList[that.data.current + 1] || that.data.person2,
    //   })
    //   animation.translateX(0).step({duration: 0, transformOrigin: "60%, 40%", timingFunction: 'step-start'})
    //   that.setData({
    //     move: animation.export(),
    //   });
    //   setTimeout(()=>{
    //     animation.opacity(1).step({duration: 200, transformOrigin: "60%, 40%", timingFunction: 'step-start'})
    //     that.setData({
    //       move: animation.export(),
    //     });
    //   }, 300);
    // }, 900);
  },
  attention(){
    if(this.data.current <= 0){
      return wx.showToast({
        title: '没有更多了',
        icon: 'none'
      });
    }
    let _t = this;
    _t.next(true);
    app.actions.mAttention(app.globalData.user.userId, _t.data.userList[_t.data.current].userId)
      .then( json => {
        if (json.code * 1 != 0) {
          wx.showModal({
            showCancel: false,
            content: json.message
          })
          return;
        }
      })
  }
})
