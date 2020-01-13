'use strict';
// eslint-disable-next-line no-unused-vars
const room = 'default_room';
// eslint-disable-next-line no-unused-vars
module.exports = (options, app) => {
  return async (ctx, next) => {
    const { token } = ctx.socket.handshake.query;
    console.log(token);
    try {
      const payload = ctx.app.jwt.verify(token.split(' ')[1], ctx.app.config.jwt.secret);
      ctx.payload = payload; // 验证通过
      await next();
    } catch (e) {
      ctx.socket.emit('handelEvent', { code: 1, message: '登录状态发生变化，请重新登录！' });
      ctx.socket.broadcast.emit('outline', ctx.payload.data.username + '已下线！');
    }
  };
};
