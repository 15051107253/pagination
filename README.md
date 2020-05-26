## 一个原生javascript实现的分页器插件

##### 使用方法:

HTML中引入css与js文件

```HTML
<link rel="stylesheet" href="./mypage.css">
<script src="./mypage.js"></script>
```

新建一个div容器

```html
<div id="myPage"></div>
```

调用myPage实例

```javascript
// 第一个参数：容器 id,也可以是class，最好为 id，第二个参数：配置项
new myPage('#myPage',{
    total: 300,
    count: 11,
    pageSize: 10,   // 每页默认显示数量，默认为10
    pageNum: 1,   // 初始化页码，默认为1
    count: 7,   // 显示按钮个数（必须是大于等于5的奇数），默认为7
    inputJumpPage: false,   // 是否开启输入框跳转分页，默认fasle
    selectPageSize: false,  // 是否开启选择每页显示条数，默认fasle
    changePage: function(pageNum) {
        // 当前页 改变时的回调函数
        console.log('当前第' + pageNum + '页')
    },
    changePageSize: function(pageSize) {
        // 每页显示条数 改变时的回调函数
        console.log('当前每页显示' + pageSize + '条')
    }
})
```

