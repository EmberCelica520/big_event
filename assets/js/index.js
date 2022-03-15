// @ts-nocheck
$(function () {
  // 调用getUserInfo获取用户信息
  getUserInfo()

  const layer = layui.layer
  // 退出功能
  $('#logout').on('click', function () {
    layer.confirm('是否退出登录', { icon: 3, title: '提示' }, function (index) {
      // 清除本地token
      localStorage.removeItem('token')
      // 跳转登录页面
      location.href = '/login.html'

      layer.close(index)
    })
  })
})

// 获取用户的基本信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败！')
      }
      // 调用renderAvatar渲染头像
      console.log(res)
      renderAvatar(res.data)
    }
  })
}

// 渲染用户头像
function renderAvatar(data) {
  var name = data.nickname || data.username
  $('#welcom').html('欢迎&nbsp;&nbsp;' + name)

  // 按需渲染头像
  if (data.user_pic !== null) {
    $('.layui-nav-img').attr('src', data.user_pic).show()
    $('.text-avatar').hide()
  } else {
    let first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
    $('.layui-nav-img').hide()
  }
}
