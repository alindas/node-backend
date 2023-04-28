### 基于 Koa 的轻量级后台

####使用
```
npm run start

```

####自定义
```
// app.js 权限中间件，默认允许所有客户端的 test 请求
app.use(cors({
  origin: function(ctx) {
    if (ctx.url === '/test') {
      return "*"; // 允许来自所有域名请求
    }
    return 'http://localhost:8080'; // 只允许 http://localhost: 8080 这个域名的请求
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'], // getResponseHeader()可以返回我们所需的值
  maxAge: 5, // 设置只本次验证的有效时间，即在该时间段内服务端可以不用进行验证
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'], // 设置所允许的HTTP请求方法
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'], // 该字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段
}))
```
业务请求编写参考： routers 的 index.js 文件
