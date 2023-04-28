const SSE = require('../utils/sse_server');


module.exports = function (account, event, data) {
  console.log(SSE.eventList);
  let isExist = false;
  for (let item of SSE.eventList) {
    if (item.account === account) {
      isExist = true;
      item.eventList.push({
        event,
        data
      });
      console.log(`event: ${event} 已载入${account}事件列表`);
      break;
    }
  }
  if (!isExist) {
    SSE.eventList.push({
      account,
      eventList: [{
        event,
        data
      }]
    });
    console.log(`${account}事件列表完成初始化，event: ${event} 已载入`);
  }
}