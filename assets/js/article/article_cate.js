// @ts-nocheck
$(function () {
  initArticleCateList()

  const layer = layui.layer
  const form = layui.form

  // 获取文章分类的列表
  function initArticleCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          layer.msg('获取文章类别失败')
        }
        console.log(res)

        const htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  // 监听添加按钮的d点击事件
  var indexAdd = null
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      title: '添加文章类别',
      area: ['500px', '250px'],
      content: $('#dialog-add').html()
    })
  })

  // 通过事件代理,监听add-from表单提交事件
  $('body').on('submit', '#add-from', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('添加文章类别失败')
        }
        initArticleCateList()
        layer.msg('添加文章类别成功')
        layer.close(indexAdd)
      }
    })
  })

  // 通过事件代理,监听btn-edit表单点击事件
  var indexEdit = null
  $('tbody').on('click', '.btn-edit', function () {
    indexEdit = layer.open({
      type: 1,
      title: '修改文章类别',
      area: ['500px', '250px'],
      content: $('#dialog-edit').html()
    })

    var id = $(this).attr('data-id')
    // 发起请求获取对于分类的数据
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        form.val('edit-from', res.data)
      }
    })
  })

  // 通过事件代理,监听edit-from表单提交事件
  $('body').on('submit', '#edit-from', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新文章类别失败')
        }
        layer.msg('更新文章类别成功')
        layer.close(indexEdit)
        initArticleCateList()
      }
    })
  })

  // 通过事件代理,监听btn-delete表单点击事件
  $('tbody').on('click', '.btn-delete', function () {
    const id = $(this).attr('data-id')
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章类别失败')
          }
          layer.msg('删除文章类别成功')
          layer.close(index)
          initArticleCateList()
        }
      })
    })
  })
})
