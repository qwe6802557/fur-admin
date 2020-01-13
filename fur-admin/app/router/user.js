'use strict';

/** 用户管理分路由
  * @param userManagerChildRouter
  */
module.exports = app => {
  const { router, controller } = app;
  router.post('/user/login', controller.user.login);
  router.post('/user/registor', controller.user.registor);
  router.get('/user/userInfo', controller.user.getUserInfo);
  router.post('/user/reset', controller.user.resetPass);
  router.post('/user/login_out', controller.user.loginOut);
};
