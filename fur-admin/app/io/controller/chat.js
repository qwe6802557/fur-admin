// eslint-disable-next-line no-unused-vars,strict
const room = 'default_room';
// eslint-disable-next-line strict
module.exports = app => {
  class Controller extends app.Controller {
    // 聊天框消息接收操作
    async sendMessage() {
      const { content, friend_id, is_mine } = this.ctx.args[0];
      const nbsp = app.io.of('/');
      let result = {};
      const userData = this.ctx.payload.data;
      for (const i in userData) {
        // eslint-disable-next-line eqeqeq
        if (i != 'id' && i != 'username') {
          delete userData[i];
        }
      }
      userData.user_id = userData.id;
      userData.user_name = userData.username;
      delete userData.id;
      delete userData.username;
      try {
        result = await this.ctx.model.Message.create({
          user_id: userData.user_id,
          user_name: userData.user_name,
          content,
          friend_id,
          is_mine,
        });
        nbsp.emit('inChat', { code: 0, userMes: result.dataValues, message: '发送成功！' });
      } catch (e) {
        nbsp.emit('inChat', { code: 5, message: '发送失败！' });
        throw e;
      }
      /* this.ctx.socket.emit('inChat',{code:0,userMes:payload,message,dateTime:moment(Date.now()).format('YYYY-MM-DD HH:mm')});*/
    }
    // 页面获取聊天记录
    async getMessage() {
      const userData = this.ctx.payload.data;
      const { id } = userData;
      const friend_id = this.ctx.args[0];
      try {
        const result_mine = await this.ctx.model.Message.findAll({
          where: {
            user_id: id,
            friend_id,
          },
          raw: true,
        });
        const result_friends = await this.ctx.model.Message.findAll({
          where: {
            user_id: friend_id,
            friend_id: id,
          },
          raw: true,
        });
        const result = result_mine.concat(result_friends);
        // id排序
        result.forEach((item, index, arr) => {
          if ((index > 0) && (arr[index - 1].id > item.id)) {
            const temp = arr[index - 1];
            arr[index - 1] = item;
            arr[index] = temp;
          }
        });
        this.ctx.socket.emit('getMessage', result);
      } catch (e) {
        this.ctx.socket.emit('getMessage', e);
      }
    }
    // 获取好友列表
    async getList() {
      const { data } = this.ctx.payload;
      const { id } = data;
      try {
        const result = await this.ctx.model.FriendList.findAll({
          where: {
            user_id: id,
          },
        });
        this.ctx.socket.emit('getList', result);
      } catch (e) {
        this.ctx.socket.emit('getList', e);
      }
    }
    // 获取除本人以外的添加列表
    async getUserList() {
      const { ctx } = this;
      const { data } = ctx.payload;
      const { id } = data;

      try {
        const result = await ctx.model.User.findAll({
          raw: true,
        });
        result.filter(item => {
          // eslint-disable-next-line eqeqeq
          return item.id != id;
        });
        ctx.socket.emit('getUserList', result);
      } catch (e) {
        ctx.socket.emit('getUserList', e);
      }
    }
    // 添加好友请求
    async addSubmit() {
      const { ctx } = this;
      const { payload, socket } = ctx;
      const data = ctx.args[0];
      const nsp = app.io.of('/');
      const { id } = payload.data;
      const addArr = [];
      const socketArr = [];
      let haveArr = [];
      let eachFlag = 0;
      let socketFlag = 0;
      console.log(app.io.of('/'));

      data.forEach(item => {
        const addObj = {};
        addObj.user_id = id;
        addObj.friend_id = item.id;
        addObj.friend_name = item.username;
        addArr.push(addObj);
      });
      try {
        addArr.map(async item => {
          const result = await ctx.model.MessageAdd.findOne({
            where: {
              user_id: item.user_id,
              friend_id: item.friend_id,
              is_allowed: '0',
            },
            raw: true,
          });
          result && haveArr.push(result);
          !result && item.friend_id !== item.user_id && await ctx.model.AddMessage.create(item);
          eachFlag++;
          if (eachFlag !== addArr.length) {
            return;
          }
          if (haveArr.length !== 0) {
            haveArr = haveArr.map(item => {
              return item.friend_name;
            });
            socket.emit('addSubmit', { code: 1, message: '添加成功！您已经对' + haveArr.join(',') + '发送过好友请求,请耐心等待!' });
          } else {
            addArr.map(async item => {
              const result_socket = await ctx.model.SocketUser.findOne({
                where: {
                  user_id: item.friend_id,
                },
                raw: true,
              });
              result_socket.socket_id && socketArr.push(result_socket);
              socketFlag++;
              socketFlag === addArr.length
              // eslint-disable-next-line array-callback-return
             && socketArr.map(item => {
               item.user_id !== payload.data.id &&
               this.ctx.model.MessageNotification.create({
                 user_id: item.user_id,
                 message_type: '1',
                 message_content: payload.data.username + '希望添加您为好友，请处理。',
               }).then(() => {
                 nsp.to(item.socket_id).emit('addMessages', { type: '1', message: payload.data.username + '希望添加您为好友，请处理。' });
               }).catch(() => {
                 return false;
               });
             })
             && socket.emit('addSubmit', { code: 0, message: '添加成功！' });
            });
          }
        });
      } catch (e) {
        socket.emit('addSubmit', { code: 5, message: '添加出错！' });
      }
      /* socket.emit("addSubmit",payload); //发送给自己
         socket.broadcast.emit("addSubmit",payload); //发给除了自己的其他人*/
      /* nsp.to(room).emit('addSubmit', payload);*/ // 给指定房间的人发送消息
      /* nsp.to(socket.id).emit('addSubmit', payload);*/// 发送给指定ID的人
      /* nsp.sockets[item.socket_id].emit('addMessages',{type:'添加好友信息',message:payload.data.username+'希望添加您为好友，请处理。'})*/
      // 发送给指定ID的人
    }
  }
  return Controller;
};
