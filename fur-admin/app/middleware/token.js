module.exports=(options,app)=>{
  return async function valiateToken(ctx,next) {
      try {
          const token=ctx.header.authorization;
          console.log(token);
          if (token){
              let payload=app.jwt.verify(token.split(' ')[1],app.config.jwt.secret);
              if (payload){
                  ctx.payload=payload;
                  await next();
              }else {
                  ctx.body={
                      code:6,
                      message:'token验证失败！'
                  }
              }
          }else {
              ctx.body={
                  code:7,
                  message:'验证错误！无有效token!'
              }
          }
      }catch (e) {
          if (e.name=="TokenExpiredError"){
              ctx.body={
                  code:8,
                  message:"登录信息已过期，请重新登录！"
              }
          }else{
              ctx.body={
                  code:9,
                  message:e
              }
          }
      }
  } 
}