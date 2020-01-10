


/** 总路由
 * @param applicatioRouter
 */
// eslint-disable-next-line strict
module.exports = app => {
  // eslint-disable-next-line no-unused-vars
  const { router, controller } = app;
  require('./router/user')(app);
  require('./router/verify')(app);
  require('./router/goods')(app);
  require('./router/upload')(app);
  require('./router/category')(app);
  require('./router/io')(app);
};
