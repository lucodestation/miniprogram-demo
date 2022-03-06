// pages/test/test.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list1: [
      { id: 1, label: 'apple' },
      { id: 2, label: 'banana' },
      { id: 3, label: 'orange' },
    ],
    list2: ['a', 'b', 'c'],
    status: 0,
    deleteButton: [
      {
        text: '删除',
        type: 'warn',
        extClass: 'delete-btn',
      },
    ],
    inputValue: ''
  },

  handleClickList1Item(event) {
    console.log(event.currentTarget.dataset)
  },

  handleDeleteListItem(event) {
    console.log(event)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
})
