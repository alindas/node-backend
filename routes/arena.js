const router = require('koa-router')();
const Redis_DB = require('../module/redis/fake');
const md5 = require('md5');

router.get('/test/send', async (ctx, next) => {
  const key = new Date().valueOf();
  const value = md5(key);
  Redis_DB[key] = value;

  ctx.body = {
    key,
    value
  }
})

router.get('/test/validate', async (ctx, next) => {
  const token = ctx.query.token;
  const value = Redis_DB[token];
  if (typeof value === 'undefined') {
    ctx.response.status = 403; // 其一
    ctx.body = '校验失败'
  } else {
    delete Redis_DB[token];
    ctx.body = {
      value
    }
  }

})

module.exports = router
