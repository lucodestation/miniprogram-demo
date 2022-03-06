Page({
  // 页面的初始数据
  data: {
    goodsImage: 'http://n.sinaimg.cn/default/450/w750h500/20220225/2b3e-8da8f623d8388e67b1fb3efd4db2e93b.png',
    qrcode: 'https://res.wx.qq.com/wxdoc/dist/assets/img/demo.ef5c5bef.jpg',
    title: '那些齿轮和指针铭记的不只是时间，还有一个个关于蔚蓝未知的探险故事，以及人类的执拗追求。',
    price: 2580,
    canvasWidth: 0,
    canvasHeight: 0,

    showActionsheet: false,
    groups: [
      { text: '男', value: 1 },
      { text: '女', value: 0 },
    ],
  },

  handleOpenActionSheet() {
    this.setData({
      showActionsheet: true,
    })
  },

  async handleDraw() {
    wx.showLoading({
      title: '图片生成中...',
    })
    const query = wx.createSelectorQuery()
    let canvas = ''
    let ctx = ''
    let left = 0
    let top = 0

    // 获取海报容器元素
    query.select('#posterContainer').boundingClientRect()
    // 获取图片元素
    query.selectAll('#posterContainer .canvas-image').fields({
      dataset: true,
      size: true, // width height
      rect: true, // top right bottom left
      computedStyle: ['borderRadius'],
    })
    // 获取文字元素
    query.selectAll('#posterContainer .canvas-text').fields({
      dataset: true,
      size: true, // width height
      rect: true, // top right bottom left
      computedStyle: ['fontSize', 'color', 'lineHeight', 'fontWeight', 'fontFamily', 'fontStyle'],
    })

    query.exec((execResult) => {
      console.log(execResult)
      top = execResult[0].top
      left = execResult[0].left
      this.setData({
        canvasWidth: execResult[0].width,
        canvasHeight: execResult[0].height,
      })
      wx.createSelectorQuery()
        .select('#myCanvas')
        .fields({ node: true, size: true }, async (result) => {
          const width = result.width
          const height = result.height

          canvas = result.node
          ctx = canvas.getContext('2d')

          const dpr = wx.getSystemInfoSync().pixelRatio
          canvas.width = width * dpr
          canvas.height = height * dpr
          ctx.scale(dpr, dpr)

          // 绘制背景
          this._drawFillRect({
            ctx,
            x: 0,
            y: 0,
            width: this.data.canvasWidth,
            height: this.data.canvasHeight,
            borderRadius: 0,
            backgroundColor: '#fff',
          })

          // 绘制图片
          for (const item of execResult[1]) {
            await this._drawRoundImage({
              canvas,
              ctx,
              url: item.dataset.canvasImage,
              x: item.left - left,
              y: item.top - top,
              width: item.width,
              height: item.height,
              borderRadius: parseInt(item.borderRadius),
            })
          }

          // 绘制文字
          for (const item of execResult[2]) {
            await this._drawText({
              ctx,
              text: item.dataset.canvasText,
              x: item.left - left,
              y: item.top - top + parseFloat(item.lineHeight) - 5,
              color: item.color,
              fontWeight: item.fontWeight,
              fongSize: item.fontSize,
              lineHeight: item.lineHeight,
              maxLine: item.dataset.line,
              maxWidth: item.width,
              fontFamily: item.fontFamily,
              fontStyle: item.fontStyle,
            })
          }

          console.log('绘制完成')

          wx.canvasToTempFilePath({
            canvas,
            success(filePathResult) {
              console.log(filePathResult.tempFilePath)
              wx.saveImageToPhotosAlbum({
                filePath: filePathResult.tempFilePath,
                success(res) {
                  wx.hideLoading()
                },
              })
            },
          })
        })
        .exec()
    })
  },

  _drawRoundImage({ canvas, ctx, url, x, y, width, height, borderRadius }) {
    console.log('_drawRoundImage', { canvas, ctx, url, x, y, width, height, borderRadius })
    return new Promise((resolve) => {
      const image = canvas.createImage()
      image.src = url
      image.onload = () => {
        ctx.save()
        ctx.beginPath()
        ctx.arc(x + borderRadius, y + borderRadius, borderRadius, Math.PI, Math.PI * 1.5)
        ctx.arc(x + width - borderRadius, y + borderRadius, borderRadius, Math.PI * 1.5, Math.PI * 2)
        ctx.arc(x + width - borderRadius, y + height - borderRadius, borderRadius, 0, Math.PI * 0.5)
        ctx.arc(x + borderRadius, y + height - borderRadius, borderRadius, Math.PI * 0.5, Math.PI)
        ctx.clip()
        ctx.drawImage(image, x, y, width, height)
        ctx.restore()
        resolve()
      }
    })
  },
  /**
   * 绘制填充圆角矩形
   * @param {Object} option
   * @param {Object} option.ctx
   * @param {Number} option.x 矩形左上角 x 坐标，单位 px
   * @param {Number} option.y 矩形左上角 y 坐标，单位 px
   * @param {Number} option.width 矩形宽度，单位 px
   * @param {Number} option.height 矩形高度，单位 px
   * @param {Number} option.borderRadius 圆角大小，单位 px
   * @param {Number} option.backgroundColor 矩形背景色
   */
  _drawFillRect(option) {
    console.log(option)
    return new Promise((resolve, reject) => {
      const ctx = option.ctx
      // console.log('绘制圆角矩形', option)
      const x = parseFloat(option.x)
      const y = parseFloat(option.y)
      const width = parseFloat(option.width)
      const height = parseFloat(option.height)
      const borderRadius = parseFloat(option.borderRadius) || 0
      const backgroundColor = option.backgroundColor || '#000'

      // let setShadow = undefined
      // if (option.setShadow) {
      //   setShadow = option.setShadow
      // }

      // 将 borderRadius 设置为短边的一半
      if (width < borderRadius * 2 || height < borderRadius * 2) {
        borderRadius = Math.min(width, height) / 2
      }

      ctx.save() // 保存当前的绘图上下文
      ctx.beginPath() // 开始创建一个路径，需要调用fill或者stroke才会使用路径进行填充或描边

      // 左上角
      /**
       * 画一条弧线
       * @param {Number} x 圆的 x 坐标 （宽减去圆角半径）
       * @param {Number} y 圆的 y 坐标 （高减去圆角半径）
       * @param {Number} r 圆的半径
       * @param {Number} sAngle 起始弧度（3 点钟方向），单位弧度
       * @param {Number} eAngle 终止弧度
       * @param {Boolean} counterclockwise 可选。指定弧度的方向是逆时针还是顺时针。默认是false，即顺时针
       */
      ctx.arc(x + borderRadius, y + borderRadius, borderRadius, Math.PI, 1.5 * Math.PI)

      // 上横线
      /**
       * x
       * y
       */
      // ctx.lineTo(x + Math.abs(width - borderRadius), y) // 增加一个新点，然后创建一条从上次指定点到目标点的线

      // 右上角
      ctx.arc(x + Math.abs(width - borderRadius), y + borderRadius, borderRadius, 1.5 * Math.PI, 2 * Math.PI)

      // 右竖线
      // ctx.lineTo(x + width, y + Math.abs(height - borderRadius))

      // 右下角
      ctx.arc(x + Math.abs(width - borderRadius), y + Math.abs(height - borderRadius), borderRadius, 0, 0.5 * Math.PI)

      // 下横线
      // ctx.lineTo(x + borderRadius, y + height)

      // 左下角
      ctx.arc(x + borderRadius, y + Math.abs(height - borderRadius), borderRadius, 0.5 * Math.PI, Math.PI)

      // 左竖线
      // ctx.lineTo(x, y + borderRadius)

      // 设置阴影样式
      // offsetX Number 阴影相对于形状在水平方向的偏移
      // offsetY Number 阴影相对于形状在竖直方向的偏移
      // blur Number 0~100 阴影的模糊级别，数值越大越模糊
      // color Color 阴影的颜色
      // if (setShadow) {
      //   ctx.setShadow(setShadow)
      // } else {
      //   ctx.setShadow(0, 0, 0, '#fff')
      // }

      ctx.fillStyle = backgroundColor // 设置填充色
      ctx.fill() // 对当前路径中的内容进行填充。默认的填充色为黑色

      // ctx.setStrokeStyle(backgroundColor) // 设置边框颜色
      // ctx.stroke() // 画出当前路径的边框。默认颜色色为黑色
      ctx.closePath() // 关闭一个路径

      resolve()
    })
  },
  /**
   * 绘制文字
   * @param {Object} option
   * @param {Object} option.ctx
   * @param {string} option.text 要绘制的文字
   * @param {Number} option.x 文字左上角 x 坐标，单位 px
   * @param {Number} option.y 文字左上角 y 坐标，单位 px（注意：文字的坐标是已文字的左下角为参考点的）
   * @param {String} option.color 字体颜色
   * @param {String} option.fontWeight 自重，仅支持关键字（normal、bold等）
   * @param {Number} option.fontSize 字体大小，单位 px
   * @param {Number} option.lineHeight 行高，单位 px
   * @param {Number} option.maxLine 最大行数
   * @param {Number} option.maxWidth 最大宽度
   * @param {String} option.fontFamily
   * @param {String} option.fontStyle
   */
  _drawText(option) {
    console.log('_drawText', option)
    return new Promise((resolve, reject) => {
      const ctx = option.ctx
      const text = option.text
      const x = option.x
      const y = option.y
      const color = option.color || '#000'
      const fontStyle = option.fontStyle || 'normal'
      const fontVariant = option.fontVariant || 'normal'
      const fontWeight = option.fontWeight || 'normal'
      const fontSize = parseFloat(option.fontSize) || 16
      const lineHeight = parseFloat(option.lineHeight) || 21
      const fontFamily = option.fontFamily || 'sans-serif'
      let maxWidth = undefined
      if (option.maxWidth) {
        maxWidth = parseFloat(option.maxWidth)
      }
      let maxLine = 1
      if (option.maxLine) {
        maxLine = parseInt(option.maxLine)
      }

      ctx.font = `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize}px ${fontFamily}`

      ctx.fillStyle = color
      if (!maxLine) {
        ctx.fillText(text, x, y)
      } else {
        let currentText = ''
        let currentLine = 1
        let currentLineHeight = 0

        for (let i = 0, length = text.length; i < length; i++) {
          currentText += text[i]
          if (ctx.measureText(currentText + text[i + 1]).width > maxWidth && currentLine < maxLine) {
            ctx.fillText(currentText, x, y + currentLineHeight)
            currentText = ''
            currentLine++
            currentLineHeight += lineHeight
          } else if (text[i + 1] !== undefined && ctx.measureText(currentText + text[i + 1]).width > maxWidth && currentLine >= maxLine) {
            ctx.fillText(currentText.substr(0, currentText.length - 1) + '...', x, y + currentLineHeight)
            currentText = ''
            break
          }
        }

        if (currentText) {
          ctx.fillText(currentText, x, y + currentLineHeight)
        }
      }

      resolve()
    })
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {},

  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {},
  // 生命周期函数--监听页面显示
  onShow: function () {},
  // 生命周期函数--监听页面隐藏
  onHide: function () {},
  // 生命周期函数--监听页面卸载
  onUnload: function () {},
  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {},
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {},
  // 用户点击右上角分享
  onShareAppMessage: function () {},
})
