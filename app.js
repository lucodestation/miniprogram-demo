App({
  // 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
  onLaunch: function () {
    console.log('App onLaunch')

    // wx.login({
    //   success(result) {
    //     console.log(result)
    //     const { code } = result

    //     wx.request({
    //       url: 'http://localhost:3000/api/auth/code2Session',
    //       data: { code },
    //       success(response) {
    //         console.log(response.data)
    //         const { sessionKey } = response.data
    //         wx.setStorageSync('sessionKey', sessionKey)
    //       },
    //     })
    //   },
    // })
  },

  // 当小程序启动，或从后台进入前台显示，会触发 onShow
  onShow: function (options) {
    console.log('App onShow', options)
  },

  // 当小程序从前台进入后台，会触发 onHide
  onHide: function () {
    console.log('App onHide')
  },

  // 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
  onError: function (error) {
    console.log('App onError', error)
  },
})
