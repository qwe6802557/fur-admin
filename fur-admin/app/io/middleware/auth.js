// eslint-disable-next-line no-unused-vars,strict
const room = 'default_room';
module.exports = (options, app) => {
  return async (ctx, next) => {
    const { token } = ctx.socket.handshake.query;
    if (token) {
      try {
        const payload = ctx.app.jwt.verify(token.split(' ')[1], ctx.app.config.jwt.secret);
        ctx.payload = payload; // 验证通过
        ctx.socket.join(room);
        await ctx.socket.emit('customEmit', { code: 0, message: '连接服务器成功！' });
        await ctx.socket.broadcast.emit('online', payload.data.username + '已上线！');
        await next();
      } catch (e) {
        await ctx.socket.emit('customEmit', { code: 1, message: '登录状态发生变化，请重新登录！' });
        await ctx.socket.disconnect();
      }
    } else {
      ctx.socket.emit('customEmit', { code: 2, message: '登录信息无效，请重新登录！' });
      ctx.socket.disconnect();
    }
  };
};
