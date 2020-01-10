'use strict';

// eslint-disable-next-line no-unused-vars
module.exports = (options, app) => {
  return async (ctx, next) => {
    ctx.socket.emit('customEmit', '服务器已收到信息！');
    await next();
  };
};
