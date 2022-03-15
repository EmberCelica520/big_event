// @ts-nocheck
$(function () {
  const layer = layui.layer
  const form = layui.form

  initCate()
  // 初始化富文本编辑器
  initEditor()

  // 获取文章分类方法
  // 和下面的代码一模一样,上面的不能用,下面的可以,,,,迷之错误
  // function initCate() {
  //   $.ajax({
  //     method: 'GET',
  //     url: '/my/article/cates',
  //     succeess: function (res) {
  //       if (res.status !== 0) {
  //         return layer.msg('获取文字分类失败')
  //       }

  //       var htmlStr = template('tpl-cate', res)
  //       $('[name=cate_id]').html(htmlStr)

  //       // 调用form.render函数
  //       form.render()
  //     }
  //   })
  // }

  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败！')
        }
        // 调用模板引擎，渲染分类的下拉菜单
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 一定要记得调用 form.render() 方法
        form.render()
      }
    })
  }

  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  // 监听选择封面按钮点击事件
  $('#btnChooseImage').on('click', function () {
    $('#coverFile').click()
  })
  // 监听选择封面选择框change事件
  $('#coverFile').on('change', function (e) {
    const files = e.target.files
    if (files.length === 0) {
      return
    }

    // 拿到用户选择的文件
    const file = e.target.files[0]
    // 根据选择的文件，创建一个对应的 URL 地址
    const newImgURL = URL.createObjectURL(file)
    // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  // 定义文章发布状态
  let art_status = '已发布'
  // 监听存为草稿按钮点击事件
  $('#btnSave2').on('click', function () {
    art_status = '草稿'
  })
  // 监听表单提交事件
  $('#form-push').on('submit', function (e) {
    e.preventDefault()

    // 创建一个formDate对象
    const fd = new FormData($(this)[0])
    // 将文章的发布状态追加到fd中
    fd.append('state', art_status)

    //将裁剪后的图片，输出为文件
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 将对象文件存入fd中
        fd.append('cover_img', blob)

        publishArticle(fd)
      })
  })

  // 发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      url: '/my/article/add',
      method: 'POST',
      data: fd,
      // 注意：如果向服务器提交的是 FormData 格式的数据，
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('发布失败')
        }
        layer.msg('发布成功')
        location.href = '/article/article_list.html'
      }
    })
  }
})
