'use strict'

module.exports=(options,app)=>{
    return async (ctx,next)=>{
        const {token}=ctx.socket.handshake.query;
        if (token){
            let payload=ctx.app.jwt.verify(token.split(' ')[1],ctx.app.config.jwt.secret);
            if (payload){
                ctx.payload=payload;
                await next();
            } else {
                ctx.socket.emit('customEmit',{code:1,message:'登录状态发生变化，请重新登录！'});
            }
        } else{
            ctx.socket.emit('customEmit',{code:2,message:'登录信息无效，请重新登录！'});
        }
    }
}