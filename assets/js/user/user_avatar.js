// @ts-nocheck
$(function () {
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  $('.btnChooseImg').on('click', function () {
    $('#btnChooseImg').click()
  })

  // 监听表单change事件
  $('#btnChooseImg').on('change', function (e) {
    // 用户选择的文件
    const newfile = e.target.files[0]
    // 选择的文件，创建一个对应的 URL 地址
    const newImgFile = URL.createObjectURL(newfile)
    // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgFile) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  const layer = layui.layer
  // 监听确定按钮点击事件
  $('#btnUpload').on('click', function (e) {
    e.preventDefault()
    // 活动裁剪后的图片
    var dataURL = $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    // 发起ajax请求
    $.ajax({
      url: '/my/update/avatar',
      method: 'POST',
      data: {
        avatar: dataURL
      },
      success: function (res) {
        if (res.status !== 0) return layer.msg('上传失败')
        layer.msg('上传成功!!!')
        window.parent.getUserInfo()
      }
    })
  })
})
