'use strict'

module.exports=(options,app)=>{
    return async (ctx,next)=>{
        ctx.socket.emit('customEmit','实时服务器连接成功！');
        await next();
        console.log('disconnected!');
    }
}