'use strict';

/** 订单管理分路由
 * @param goodsManagerChildRouter
 */
module.exports = app => {
  const { router, controller } = app;

  router.post('/order/add', controller.order.addOrder);
  router.post('/order/list', controller.order.getOrder);
  router.post('/order/handle', controller.order.updateOrder);
  router.post('/order/delete', controller.order.deleteOrder);
  /* router.get('/group/detail/:id', controller.group.getAuthorityDetail);
      router.get('/group/allGroup', controller.group.getAllAuthority);*/
};
