function getLoginToken(userID, appid) {
  let { tokenURL, cgi_token, env } = getApp().globalData;
  return new Promise((res, rej) => {
    console.log(env)
    if(env != 'dev'){ 
      return res(wx.getStorageSync('user').zegoToken);
    }else{
      wx.request({
        url: tokenURL, //仅为示例，并非真实的接口地址
        data: {
          app_id: appid,
          id_name: userID,
          cgi_token
        },
        header: {
          'content-type': 'text/plain'
        },
        success(result) {
          console.log(">>>[liveroom-room] get login token success. token is: " + result.data);
          if (result.statusCode != 200) {
            return;
          }
          res(result.data);
        },
        fail(e) {
          console.log(">>>[liveroom-room] get login token fail, error is: ")
          console.log(e);
          rej(e)
        }
      });
    }
    
  });
}

module.exports = {
  getLoginToken
};