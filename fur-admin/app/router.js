
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
  require('./router/package')(app);
  require('./router/machine')(app);
  require('./router/io')(app);
  require('./router/producePackage')(app);
  require('./router/produceGoods')(app);
  require('./router/approve')(app);
  require('./router/picCode')(app);
  require('./router/authority')(app);
  require('./router/group')(app);
  require('./router/staff')(app);
  require('./router/merchant')(app);
  require('./router/order')(app);
  require('./router/home')(app);
};
