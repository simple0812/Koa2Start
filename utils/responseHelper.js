module.exports = (function() {
  function Constructor(status, message, result, messageType) {
    this.code = status || '';
    this.message = message || '';
    this.messageType = messageType || '';
    this.data = result || '';
  }

  function getError(err, errCode, messageType) {
    var errMessage = err && err.message ? err.message : err;

    errCode = errCode || 1;
    messageType = messageType || '';
    err = err || '';

    return new Constructor(errCode + '', errMessage, messageType);
  }

  function getSuccess(doc) {
    return new Constructor('0', '', doc);
  }

  function getListSuccess(docs) {
    var data = {
      list: docs || []
    };

    return new Constructor('0', '', data);
  }

  function pageSuccess(docs, total, current, pageSize ) {
    docs = docs || [];
    current = current || 1;
    pageSize = pageSize || 10;
    var pageTotal = Math.ceil(total / pageSize);

    var data = {
      current,
      list: docs,
      pageSize,
      pageTotal,
      total
    };

    var json = new Constructor('0', '', data);
    
    return json;
  }

  return {
    getError,
    getSuccess,
    pageSuccess,
    getListSuccess
  };

})();