import config from '../../common/config.js';
var app = getApp();

Page({
  data: {
    avatar: '',
    sexName: '男',
    isMan: true,
    nickName: '',
    city: '',
    sex: [
      { name: '男', value: '男', checked: true},
      { name: '女', value: '女'}
    ]
  },
  onLoad(){
    let _t = this;
    _t.getUserInfo();
  },
  getUserInfo() {
    let _t = this;
    app.actions.getUserInfoApi(app.globalData.user.userId)
      .then(json => {
        if (json.code == 0) {
          let iconList = json.data.icon,
            sex = json.data.sex,
            sexName = '男';
          if (sex == 'F'){
            sexName = '女';
            _t.setData({
              isMan: false
            })
          }
          _t.setData({
            avatar: iconList.split(',')[0],
            nickName: json.data.nickName,
            sexName: sexName,
            city: json.data.city
          })
        }
      })
  },
  radioChange(e){
    this.setData({
      sexName: e.detail.value
    })
  },
  setNickName(e){
    this.setData({
      nickName: e.detail.value
    })
  },
  setCity(e){
    this.setData({
      city: e.detail.value
    })
  },
  uploadImg() {
    let _t = this;
    // if(_t.data.avatar) return;
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: config.apiUrl + '/user/icon/upload',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            userId: app.globalData.user.userId,
            file: tempFilePaths[0]
          },
          success: (res => {
            if (res.statusCode === 200) {
              let data = JSON.parse(res.data);
              if (data.code * 1 == 4902) {
                wx.showModal({
                  showCancel: false,
                  content: data.message
                })
              } else {
                wx.showToast({
                  title: '上传成功',
                  icon: 'success',
                  duration: 1500,
                  success() {
                    _t.getUserInfo();
                  }
                })
              }
            } else {
              console.error(res)
            }
          }),
          fail: (res => {
            console.error(res)
          })
        })
      }
    })
  },
  getWxUserInfo(res){
    let _t = this;
    if (!_t.data.nickName) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      })
      return;
    }
    if (!_t.data.city) {
      wx.showToast({
        title: '请输入城市',
        icon: 'none'
      })
      return;
    }
    if(res.detail.userInfo){
      app.globalData.userInfo = res.detail.userInfo;
      wx.setStorage({
        key: 'userInfo',
        data: res.detail.userInfo,
        success(res) {
          app.actions.editUserInfoApi({
            userId: app.globalData.user.userId,
            nickName: _t.data.nickName,
            sex: _t.data.sexName == '男' ? 'M' : 'F',
            city: _t.data.city
          }).then(json => {
            if (json.code == 0) {
              wx.showToast({
                title: '填写成功',
                icon: 'success',
                duration: 1500,
                success() {
                  wx.redirectTo({
                    url: '../index/index',
                  })
                }
              })
            }
          })
        }
      })
    }
  }
})