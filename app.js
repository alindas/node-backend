const Koa = require('koa')
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const logger = require('koa-logger')
const bodyparser = require('koa-bodyparser')
const cors = require('koa2-cors')
const session = require('koa-session')

const index = require('./routes/index')

const app = new Koa()
// const sse = require('./utils/sse')
// require('./utils/sse')

// error handler
onerror(app)

// 跨域请求
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

// SSE 实时更新数据
// app.use(sse);

// session 中间件配置
app.keys = ['some secret hurr'];
const CONFIG = {
  key: 'koa:sess', // 默认值
  maxAge: 86400000, // 过期时间
  overwrite: true, // 默认
  httpOnly: true, // true——只有服务器端可以获取
  signed: false, // 签名，默认
  rolling: false, // 是否每次访问都重新设置过期时间
  renew: false, // 快过期时当有用户访问将过期时间重置
};
app.use(session(CONFIG, app));

// 接受post 请求体中的数据
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text'] // 启用类型
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async(ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 业务 router
app.use(index.routes(), index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
