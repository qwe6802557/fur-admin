'use strict';

/** 产品管理分路由
 * @param goodsManagerChildRouter
 */
module.exports = app => {
  const { router, controller } = app;

  router.post('/goods/add', controller.goods.addGoods);
  router.post('/goods/list', controller.goods.getGoods);
  router.post('/goods/update', controller.goods.editGoods);
  router.post('/goods/delete', controller.goods.deleteGoods);
  router.get('/goods/detail/:id', controller.goods.getGoodsDetail);
  router.get('/goods/allGoods', controller.goods.getAllGoods);
};
