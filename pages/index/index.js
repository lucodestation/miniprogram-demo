Page({
  // 页面的初始数据
  data: {},

  // 获取微信用户绑定的手机号
  handleGetPhoneNumber(event) {
    console.log(event.detail)
    if (event.detail.errMsg !== 'getPhoneNumber:ok') return

    // 包括敏感数据在内的完整用户信息的加密数据
    const { encryptedData } = event.detail
    // 加密算法的初始向量
    const { iv } = event.detail
    // 敏感数据对应的云 ID，开通云开发的小程序才会返回，可通过云调用直接获取开放数据
    const { cloudID } = event.detail
    console.log({ encryptedData, iv, cloudID })

    const sessionKey = wx.getStorageSync('sessionKey')

    wx.request({
      url: 'http://localhost:3000/api/auth/phoneNumber',
      data: { sessionKey, encryptedData, iv },
      success(response) {
        console.log(response.data)
        wx.setStorageSync('userPhoneNumber', response.data.phoneNumber)
      },
    })

    // wx.checkSession({
    //   success: (res) => {
    //     console.log('已登录', res)
    //     const code = wx.getStorageSync('code')
    //     wx.request({
    //       url: 'http://localhost:3000/api/auth/code2Session',
    //       data: { encryptedData, iv, appId, appSecret, code },
    //       success(response) {
    //         console.log(response.data)
    //       },
    //     })
    //   },
    //   fail(err) {
    //     console.log('未登录', err)
    //     wx.login({
    //       success(result) {
    //         console.log(result)
    //         const { code } = result
    //         // 解密需要 5 个参数
    //         // encryptedData
    //         // iv
    //         // appId
    //         // appSecret
    //         // code

    //         wx.setStorageSync('code', code)

    //         wx.request({
    //           url: 'http://localhost:3000/api/auth/code2Session',
    //           data: { encryptedData, iv, appId, appSecret, code },
    //           success(response) {
    //             console.log(response.data)
    //           },
    //         })
    //       },
    //     })
    //   },
    // })
  },

  // 测试按钮
  handleGetUserInfo() {
    console.log('测试按钮')
    wx.getUserInfo({
      success(result) {
        console.log('getUserInfo', result)
      },
    })
  },

  handleGetUserProfile() {
    wx.getUserProfile({
      desc: 'desc',
      success(result) {
        console.log('getUserProfile', result)
        const { encryptedData, iv } = result

        const sessionKey = wx.getStorageSync('sessionKey')

        wx.request({
          url: 'http://localhost:3000/api/auth/profile',
          data: { sessionKey, encryptedData, iv },
          success(response) {
            console.log(response.data)
            wx.setStorageSync('userProfile', response.data)
          },
        })
      },
    })
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log('/pages/index/index onLoad')
  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {},

  // 生命周期函数--监听页面显示
  onShow: function () {
    console.log('/pages/index/index onShow')
  },

  // 生命周期函数--监听页面隐藏
  onHide: function () {
    console.log('/pages/index/index onHide')
  },

  // 生命周期函数--监听页面卸载
  onUnload: function () {},

  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {},

  // 页面上拉触底事件的处理函数
  onReachBottom: function () {},

  // 用户点击右上角分享
  onShareAppMessage: function () {},
})
