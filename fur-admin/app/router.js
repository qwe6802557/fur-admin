


/** 总路由
 * @param applicatioRouter
 */
// eslint-disable-next-line strict
module.exports = app => {
  require('./router/user')(app);
  require('./router/verify')(app);
  require('./router/goods')(app);
  require('./router/upload')(app);
  require('./router/category')(app);
  require('./router/material')(app);
  require('./router/io')(app);
};
