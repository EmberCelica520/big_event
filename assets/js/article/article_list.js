// @ts-nocheck
$(function () {
  const form = layui.form
  const layer = layui.layer
  const laypage = layui.laypage
  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }
  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  // 定义一个参数对象q,请求数据时提交给服务器
  const q = {
    pagenum: 1, //页码值
    pagesize: 2, //每页显示多少条数据
    cate_id: '', //文章分类的 Id
    state: '' //文章的状态
  }

  initTable()
  initCate()

  // 获取文章列表数据
  // 蜜汁错误,下面的代码和下下面的代码一毛一样,下面的用不鸟
  // function initTable() {
  //   $.ajax({
  //     method: 'GET',
  //     url: '/my/article/list',
  //     data: q,
  //     success: function (res) {
  //       if (res.status !== 0) {
  //         return layer.msg('获取文章列表数据失败')
  //       }
  //       layer.msg('获取文章列表数据成功')
  //       // 使用模板引擎渲染数据
  //       const htmlStr = template('tpl-table', res.data)
  //       $('tbody').html(htmlStr)
  //     }
  //   })
  // }

  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        // 使用模板引擎渲染页面的数据
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        // 调用渲染分页的方法
        renderPage(res.total)
      }
    })
  }

  // 获取文章可选项的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章分类列表失败！')
        }
        layer.msg('获取文章分类列表成功！')
        const htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        form.render()
      }
    })
  }

  // 为筛选表单绑定submit事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    let cate_id = $('[name=cate_id]').val()
    let state = $('[name=state]').val()
    q.cate_id = cate_id
    q.state = state
    initTable()
  })

  // 定义渲染分页的方法
  function renderPage(total) {
    laypage.render({
      elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: q.pagesize, //每页显示的条数
      curr: q.pagenum, //默认选中的分页
      limits: [2, 3, 5, 10],
      layout: ['count', 'limit', 'prev', 'page', 'skip', 'next'],
      // 触发 jump 回调的方式有两种：
      // 1. 点击页码的时候，会触发 jump 回调
      // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
      jump: function (obj, first) {
        //obj包含了当前分页的所有参数，比如：
        // console.log(obj.curr) //得到当前页，以便向服务端请求对应页的数据。
        q.pagenum = obj.curr
        // console.log(obj.limit) //得到每页显示的条数
        q.pagesize = obj.limit
        // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
        // 如果 first 的值为 true，证明是方式2触发的
        // 否则就是方式1触发的
        // //首次不执行
        if (!first) {
          //do something
          initTable()
        }
      }
    })
  }
})
