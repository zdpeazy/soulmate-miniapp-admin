/**
 * name: actions.js
 * description:处理所有的请求
 */
import request from './request.js';

/**
 * 创建actions类，包含所有的业务请求接口
 */
class _actions {
  constructor() {
    this._defaultHeader = { 'Content-Type': 'application/x-www-form-urlencoded' }
    this._request = new request
    this._request.setErrorHandler(this.errorHander)
  }

  /**
   * 统一的异常处理方法
   */
  errorHander(res) {
    console.error(res)
  }

  /**
   * 获取openid
   */
  getOpenId(code = null) {
    let data = { wxCode: code }
    return this._request.postRequest('/user/regist', data).then(res => res.data)
  }
  /**
   * 获取用户信息
   */
  getUserInfoApi(userId = null) {
    let data = { userId: userId }
    return this._request.getRequest('/user/get', data).then(res => res.data)
  }
  /**
   * 上传地理位置
   */
  uploadPositionApi(data) {
    return this._request.postRequest('/user/position/upload', data).then(res => res.data)
  }
  /**
   * 上传用户头像
   */
  uploadImgApi(userId = null, iconIndex = 1, file = null) {
    let data = {
      userId,
      iconIndex,
      file
    }
    return this._request.postRequest('/user/icon/upload', data).then(res => res.data)
  }
  /**
   * 编辑资料
   */
  editUserInfoApi(data) {
    return this._request.postRequest('/user/edit', data).then(res => res.data)
  }
  /**
   * 匹配聊天
   */
  chartStart(fromUserId, fromUserSex) {
      let data = {
        fromUserId,
        fromUserSex
      }
    return this._request.postRequest('/chat/start', data).then(res => res.data)
  }
  /**
   * 获取聊天列表
   */
  getChatListApi(userId, pageNo = 0, pageSize = 100) {
    let data = {
      me: userId,
      pageNo,
      pageSize
    }
    return this._request.getRequest('/chat/list/index', data).then(res => res.data)
  }
  /**
   * 发现周围用户列表
   */
  getUserDiscover(userId, pageNo = 1, pageSize = 100) {
    let data = {
      me: userId,
      pageNo,
      pageSize
    }
    return this._request.getRequest('/user/discover', data).then(res => res.data)
  }
  /**
   * 喜欢
   */
  mAttention(userId, likeUserId) {
    let data = {
      userId: userId,
      likeUserId: likeUserId
    }
    return this._request.postRequest('/user/like', data).then(res => res.data)
  }
  /**
   * 
   */
  mFetchChat(userId) {
    let data = {
      userId: userId
    }
    return this._request.getRequest('/chat/status/fetch', data).then(res => res.data)
  }
}
  

export default _actions;


