class ResponceBody {
  /**
   *
   * 处理列表数据的响应体
   * @param {Object} list - 列表数据对象
   * @param {number} [list.code=0] - 响应状态码，默认为0表示成功
   * @param {string} [list.message='SUCCESS'] - 响应消息，默认为'SUCCESS'
   * @param {Object} list.rows - 列表数据
   * @param {number} list.total - 总数
   * @param {Object} list.info - 其他响应信息
   * @returns {Object} 格式化后的响应体对象
   */
  listBody(list) {
    const { code = 0, message = "SUCCESS", rows, total, ...info } = list;
    return {
      code,
      message,
      rows,
      total,
      ...info,
    };
  }

  successBody(info, message = "SUCCESS") {
    return {
      code: 0,
      message,
      ...info,
    };
  }

  /**
   * 失败
   */
  errorBody(message = "ERROR", ...args) {
    return {
      code: 1,
      message,
      ...args,
    };
  }
}

module.exports = new ResponceBody();
