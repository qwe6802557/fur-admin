


/**总路由
 * @param applicatioRouter
 */
module.exports = app => {
  const { router, controller } = app;
  require('./router/user')(app);
  require('./router/verify')(app);
  require('./router/goods')(app);
  require('./router/upload')(app);
  require('./router/category')(app);
  app.io.route('chat', app.io.controller.chat.ping);
};
