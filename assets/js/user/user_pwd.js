// @ts-nocheck
$(function () {
  const form = layui.form
  const layer = layui.layer
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必需在6-12位,且不能出现空格'],
    samePwd: function (value) {
      if (value === $('[name=oldPwd]').val()) {
        return '新旧密码不能相同'
      }
    },
    rePwd: function (value) {
      if (value !== $('[name=newPwd]').val()) {
        return '两次密码输入不一致'
      }
    }
  })

  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      suceess: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新失败')
        }
        layer.msg('更新成功')
        $('.layui-form')[0].reset()
      }
    })
  })
})
