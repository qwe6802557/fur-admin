'use strict';

module.exports = {
  response(code, message, data) {
    if (!data) {
      this.body = {
        code,
        message,
      };
      return;
    }
    this.body = {
      code,
      message,
      data,
    };
  },
};
