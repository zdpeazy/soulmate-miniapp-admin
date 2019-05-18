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
    animationData2: {}
  },
  onLoad: function (options) {
    this.stretch(350)
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