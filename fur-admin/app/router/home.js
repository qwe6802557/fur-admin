'use strict';

/** 首页统计图管理分路由
 * @param goodsManagerChildRouter
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/home/merchant', controller.home.getMerchantMap);
  router.get('/home/order', controller.home.getOrderMap);
  router.get('/home/produce', controller.home.getProduceMap);

};
