// eslint-disable-next-line no-unused-vars,strict
const room = 'default_room';
module.exports = app => {
  // eslint-disable-next-line no-unused-vars
  class Controller extends app.Controller {
    async connect() {
      const { ctx } = this;
      // eslint-disable-next-line no-unused-vars
      const { payload } = this.ctx;
      // eslint-disable-next-line no-unused-vars
      const nsp = app.io.of('/');
      // 向当前除了自己的在线的人发送上线消息
      ctx.socket.emit('online', 123);
      // eslint-disable-next-line no-unused-vars
      // 指定房间信息列表连接
      // eslint-disable-next-line no-unused-vars
      /* nsp.adaper.clients([ room ], (err, clients) => {
        console.log(clients);
      });*/
      /* nsp.to(room).emit('online', payload);*/
    }
  }
  return Controller;
};
