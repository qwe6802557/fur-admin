'use strict'
module.exports=app=>{
    app.io.of('/').route('sendMessage', app.io.controller.chat.sendMessage);
    app.io.of('/').route('getMessage',app.io.controller.chat.getMessage);
    app.io.of('/').route('getList',app.io.controller.chat.getList);
}