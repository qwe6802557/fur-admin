// eslint-disable-next-line no-unused-vars,strict
const room = 'default_room';
// eslint-disable-next-line no-unused-vars
module.exports = (options, app) => {
  return async (ctx, next) => {
    const { token } = ctx.socket.handshake.query;
    console.log(token);
    // eslint-disable-next-line no-unused-vars
    const rooms = [ room ];
    if (token) {
      try {
        const payload = ctx.app.jwt.verify(token.split(' ')[1], ctx.app.config.jwt.secret);
        const user_socket = { user_id: payload.data.id, socket_id: ctx.socket.id };
        ctx.payload = payload; // 验证通过
        ctx.socket.join(room);
        // 更新在线列表
        /* ctx.app.io.of('/') .adapter.clients(rooms,(err, clients) => {
          /!*ctx.app.io.of('/').to(room).emit('addMessages',payload.data.username+'来瓜咯！！');*!/
        })*/
        // 判断表中是否已经存在当前user连接过后的记录，若存在则更新，不存在则创建
        const result = await ctx.model.SocketUser.findOne({
          where: {
            user_id: payload.data.id,
          },
        });
        !!result && await ctx.model.SocketUser.update(user_socket, {
          where: {
            user_id: payload.data.id,
          },
        }) || await ctx.model.SocketUser.create({ user_id: payload.data.id, socket_id: ctx.socket.id });
        // 向自己和当前在线的人发送相应的消息
        ctx.socket.emit('customEmit', { code: 0, message: '连接服务器成功！' });
        ctx.socket.broadcast.emit('online', payload.data.username + '已上线！');// 若当前只有自己在线 则会发送给自己
        await next();
      } catch (e) {
        ctx.socket.emit('customEmit', { code: 1, message: '登录状态发生变化，请重新登录！' });
        console.log(e);
      }
    } else {
      ctx.socket.emit('customEmit', { code: 2, message: '登录信息无效，请重新登录！' });
    }
  };
};
