// var http = require('http');

class SSE_Server {
  constructor() {
    this.port = 8888;
    this.domain = 'localhost';
    this.eventLoop = {};
    this.eventLock = {}; // 当开始处理某个用户事件队列时，停止其事件循环
    this.eventList = [{
      account: null,
      eventList: []
    }];
  }

  sse_server(req, res) {
    const slice = req.url.split('?');
    const requestType = slice[0];
    const account = slice[1].split('=')[1];
    // 检测是否为sse 请求
    if (requestType === '/sse/latestNotify') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream', // 需指定为流式文件
        'Cache-Control': 'no-cache', // 缓存策略
        'Connection': 'keep-alive', // 请求结束后的状态选择
        'Access-Control-Allow-Origin': 'http://localhost:8080' // 允许跨域请求
      });
      /**
       * 指定浏览器重新发起连接的时间间隔，时间间隔到期和网络错误等原因会导致连接出错
       */
      res.write('retry: 10000\n');
      res.write(`data: server connect with ${account} success\n\n`);
      console.log(`${account} 的sse连接成功`);
      // 事件循环，每秒检查是否有新数据需要更新
      this.eventLoop[account] = setInterval(() => {
        this.eventHandle(res, account);
      }, 1000);
      req.connection.addListener('close', () => {
        console.log(`${account} 的sse连接已关闭`);
        clearInterval(this.eventLoop[account]); // 当用户关闭连接时停止事件循环
      })
    }
  }

  eventHandle(res, account) {
    // 已在处理则返回
    if (this.eventLock[account]) {
      return;
    }
    this.eventLock[account] = true;
    // 存在需要更新数据的事件并且当前用户在线则发送
    for (let item of this.eventList) {
      if (item.account == account && item.eventList.length != 0) {
        item.eventList.forEach(item => {
          res.write(`event: ${account}-${item.event}\n`);
          res.write(`data: ${item.data}\n\n`);
        });
        item.eventList = [];
        console.log(`${account} 列表事件发送完毕`);
        break;
      }
    }
    res.write('\n'); // 维持连接状态
    this.eventLock[account] = false;
  }
}

const sse = new SSE_Server();
module.exports = sse