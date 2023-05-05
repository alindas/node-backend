const router = require('koa-router')();

router.get('/test/send', async (ctx, next) => {
  ctx.body = {
    key: new Date().valueOf(),
    value: '68ea4116427f2b0185533542014163fd'
  }
})

module.exports = router
