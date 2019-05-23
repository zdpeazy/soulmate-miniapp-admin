const app = getApp();

Page({
  data: {
    imgheight: '',
    imgwidth: 750,
    imgUrls: [
      'http://jenny.oss-cn-beijing.aliyuncs.com/U5c223f9b9bb4cc195800eac4/1.png',
      'http://jenny.oss-cn-beijing.aliyuncs.com/U5c223f9b9bb4cc195800eac4/1.png',
      'http://jenny.oss-cn-beijing.aliyuncs.com/U5c223f9b9bb4cc195800eac4/1.png'
    ],
    current: 0,
    animationData: {},
    animationData2: {},
    toUser: {}
  },
  onLoad: function (options) {
    this.setData({
      toUserId: options.toUserId,
    });
    this.stretch(350);
    this.getUserInfo();
  },
  getUserInfo(){
    app.actions.getUserInfoApi(this.data.toUserId).then(json => {
      if(json.code == 0){
        this.setData({
          imgUrls: json.data.icon.split(','),
          toUser: json.data,
          interest: json.data.interest.split('、')
        })
      }
    })
  },
  change(e) {
    this.setData({
      current: e.detail.current
    })
    this.stretch(350)

    this.shrink(300)
  },
  // 收缩
  stretch(h) {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.height(h).step()
    this.setData({
      animationData: animation.export(),
    })
  },
  // 展开
  shrink(h) {
    var animation2 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation2 = animation2
    animation2.height(h).step()
    this.setData({
      animationData2: animation2.export()
    })
  }
  
})