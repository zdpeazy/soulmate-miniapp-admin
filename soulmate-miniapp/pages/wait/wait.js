// pages/wait/wait.js
const app = getApp()
Page({
  data: {
    count: 30,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

  },
  startAni() {
    this.setData({
      animate: true
    })
  },
  onShow(){
    this.timer2 = setInterval(() => {
      let count = this.data.count - 1;
      if(count < 0) return;
      this.setData({
        count
      })
    }, 1000);
    this.timer = setTimeout(() => {
      if(app.globalData.polling && !app.globalData.isTalking && !app.globalData.isContacting){
        wx.showToast({
          title: '请稍后再试',
          icon: 'none',
        })
        wx.redirectTo({
          url: '../index/index'
        })
      }
    }, 30000)
    this.startAni();
  },
  onUnload(){
    clearInterval(this.timer2);
    clearTimeout(this.timer);
  }
})