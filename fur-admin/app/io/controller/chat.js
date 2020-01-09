
module.exports = app => {
    class Controller extends app.Controller {
        //聊天框消息接收操作
        async sendMessage() {

            const {content,friend_id,is_mine} = this.ctx.args[0];
            const nbsp=app.io.of('/');
            let result={};

            const userData=this.ctx.payload.data;
            for (let i in userData) {
                if (i != 'id' && i !='username') {
                    delete userData[i];
                }
            }

            userData.user_id=userData.id;
            userData.user_name=userData.username;
            delete userData.id;
            delete userData.username;

            try {
                result=await this.ctx.model.Message.create({
                    user_id:userData.user_id,
                    user_name:userData.user_name,
                    content,
                    friend_id,
                    is_mine
                });
                nbsp.emit('inChat',{code:0,userMes:result.dataValues,message:"发送成功！"})
            }catch (e) {
                nbsp.emit('inChat',{code:5,message:"发送失败！"});
                throw e;
            }
                    /*this.ctx.socket.emit('inChat',{code:0,userMes:payload,message,dateTime:moment(Date.now()).format('YYYY-MM-DD HH:mm')});*/
        }

        //页面获取聊天记录
      async getMessage(){
          const userData = this.ctx.payload.data;
          const {id} = userData;
          const friend_id = this.ctx.args[0];

         try {
             const result_mine = await this.ctx.model.Message.findAll({
                 where:{
                     user_id:id,
                     friend_id
                 },
                 raw:true
             })
             const result_friends = await this.ctx.model.Message.findAll({
                 where:{
                     user_id:friend_id,
                     friend_id:id
                 },
                 raw:true
             })

             let result = result_mine.concat(result_friends);
             //id排序
             result.forEach((item,index,arr)=>{
                 if ((index>0) && (arr[index-1].id>item.id)){
                     const temp = arr[index-1];
                     arr[index-1] = item;
                     arr[index] = temp;
                 }
             })

             this.ctx.socket.emit('getMessage',result);
         }catch (e) {
             this.ctx.socket.emit('getMessage',e);
         }
      }
      //获取好友列表
      async getList(){
            const { data } = this.ctx.payload;
            const { id } = data;

            try {
                const result = await this.ctx.model.FriendList.findAll({
                    where:{
                        user_id:id
                    }
                })

                this.ctx.socket.emit('getList',result);
            }catch (e) {
                this.ctx.socket.emit('getList',e);
            }

      }
      //获取除本人以外的添加列表
        async getUserList(){
            const { ctx } = this;
            const { data } = ctx.payload;
            const { id } = data;

            try {
                let result = await ctx.model.User.findAll({
                    raw:true
                });
                result.filter((item)=>{
                    return item.id != id;
                })
                ctx.socket.emit('getUserList',result);
            }catch (e) {
                ctx.socket.emit('getUserList',e);
            }
        }
        //添加好友请求
        async addSubmit(){
            const { ctx } = this;
            const { socket,payload } = ctx;

            /*socket.emit("addSubmit",payload); //发送给自己
            socket.broadcast.emit("addSubmit",payload); //发给除了自己的其他人*/
        }
    }
    return Controller
};