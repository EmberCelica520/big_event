// @ts-nocheck
$(function () {
  // 点击去注册页面
  $('.link_reg').on('click', function () {
    $('.login-box').hide()
    $('.register-box').show()
  })

  // 点击去登录页面
  $('.link_log').on('click', function () {
    $('.register-box').hide()
    $('.login-box').show()
  })

  // 通过from.verify自定义表单校验规则
  const form = layui.form
  const layer = layui.layer
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须为6到12位,且不能有空格'],

    // 两次密码的校验
    repwd: function (values) {
      var pwd = $('.register-box [name=password]').val()
      if (pwd !== values) {
        return '两次密码不一致'
      }
    }
  })

  // 监听注册表单的提交事件
  $('#form_reg').on('submit', function (e) {
    e.preventDefault()
    const data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
    $.post('/api/reguser', data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message)
      }
      layer.msg('注册成功')
    })
    $('.links').click()
  })

  // 监听登录表单的提交事件
  $('#form_login').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/api/login',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layui.msg('登录失败')
        }
        console.log('登录成功')
        // 将登录成功得到的 token 字符串，保存到 localStorage 中
        localStorage.setItem('token', res.token)
        // console.log(res.token)
        location.href = '/index.html'
      }
    })
  })
})
