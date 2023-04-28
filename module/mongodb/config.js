const dbconfig = {
  url: 'mongodb://127.0.0.1:27017/', // 连接url
  dbName: 'lao-jin', // 数据库名称
  options: {
    useUnifiedTopology: true
  }
}






module.exports = {
  dbconfig, // mongoDB 配置
}