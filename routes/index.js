const router = require('koa-router')();
// const mongoDB = require('../module/mongodb/db');
// const md5 = require('md5');
// const Generator = require('id-generator');
// const MongoID = require('mongodb').ObjectID;

// const newData = require('../utils/sendNewData');



// const db = mongoDB.Init();
// const g = new Generator();

// test
router.get('/test', async (ctx, next) => {
  ctx.body = 'Hello Koa'
})

module.exports = router
