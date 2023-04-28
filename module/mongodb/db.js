const MongoClient = require('mongodb').MongoClient;
const { dbconfig } = require('./config');

class DB {

  // 实现单例共享数据
  static Init() {
    if (!DB.Instance) {
      DB.Instance = new DB();
    }
    return DB.Instance;
  }

  constructor() {
      this.client = null;
      this.connect();
    }
    // 数据库连接
  connect() {
    return new Promise((resolve, reject) => {
      // 是否为第一次连接
      if (this.client == null) {
        MongoClient.connect(dbconfig.url, dbconfig.options, (err, client) => {
          if (!err) {
            console.log('mongoDB connect success');
            const db = client.db(dbconfig.dbName);
            this.client = db;
            resolve(this.client);
          } else {
            console.log(err);
          }
        })
      } else {
        resolve(this.client);
      }
    })
  }

  // 查询数据库
  find(collection, options) {
    return new Promise((resolve, reject) => {
      this.connect()
        .then(res => {
          let result = res.collection(collection).find(...options);
          result.toArray((err, docs) => {
            if (!err) {
              resolve(docs);
            } else {
              reject(err);
            }
          })
        })
    })
  }

  /**
   * 按条件查询数据库
   * 1 op ->collection
   * 2 op ->条件
   * 3 op ->limit 数量
   * 4 op ->sort 排序规则
   * 5 op ->skip 分片
   * @returns 
   */
  findLimit(options) {
    return new Promise((resolve, reject) => {
      this.connect()
        .then(res => {
          let result = null;
          if (options[2] && !options[3] && !options[4]) {
            result = res.collection(options[0]).find(...options[1]).limit(options[2]);
          } else if (options[3]) {
            result = res.collection(options[0]).find(...options[1]).sort(options[3]).limit(options[2]);
          } else if (options[4]) {
            result = res.collection(options[0]).find(...options[1]).limit(options[2]).skip(options[4]);
          } else {
            result = res.collection(options[0]).find(...options[1]);
          }
          result.toArray((err, docs) => {
            if (!err) {
              resolve(docs);
            } else {
              reject(err);
            }
          })
        })
    })
  }

  // 聚合查询, 用于分页需求
  findAggregate(options) {
    return new Promise((resolve, reject) => {
      this.connect()
        .then(res => {
          let result = null;
          if (options[2] == 'count') {
            result = res.collection(options[0]).find(...options[1]).count();
          }
          resolve(result);
        })
    })
  }

  // 添加数据
  insertOne(collection, options) {
    return new Promise((resolve, reject) => {
      this.connect()
        .then(res => {
          let result = res.collection(collection).insertOne(...options);
          resolve(result);
        })
    })
  }

  // 删除单条数据
  deleteOne(collection, options) {
    return new Promise((resolve, reject) => {
      this.connect()
        .then(res => {
          let result = res.collection(collection).deleteOne(...options);
          resolve(result);
        })
    })
  }

  // 删除多条条数据
  deleteMany(collection, options) {
    return new Promise((resolve, reject) => {
      this.connect()
        .then(res => {
          let result = res.collection(collection).deleteMany(...options);
          resolve(result);
        })
    })
  }

  // 更新单条数据
  updateOne(collection, options) {
    return new Promise((resolve, reject) => {
      this.connect()
        .then(res => {
          let result = res.collection(collection).updateOne(...options);
          resolve(result);
        })
    })
  }

  // 更新并返回数据
  findOneAndUpdate(collection, options) {
    return new Promise((resolve, reject) => {
      this.connect()
        .then(res => {
          let result = res.collection(collection).findOneAndUpdate(...options);
          resolve(result);
        })
    })
  }
}

module.exports = DB