'use strict';
module.exports = app => {
/*  app.io.of('/').route('connect', app.io.controller.connect.connect);*/
  app.io.of('/').route('connect', app.io.controller.chat.connect);
  app.io.of('/').route('sendMessage', app.io.controller.chat.sendMessage);
  app.io.of('/').route('getMessage', app.io.controller.chat.getMessage);
  app.io.of('/').route('getList', app.io.controller.chat.getList);
  app.io.of('/').route('getUserList', app.io.controller.chat.getUserList);
  app.io.of('/').route('addSubmit', app.io.controller.chat.addSubmit);
};
