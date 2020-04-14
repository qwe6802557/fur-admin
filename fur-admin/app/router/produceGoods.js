'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.post('/produceGoods/list', controller.produceGoods.getProduceGoods);
  router.post('/produceGoods/add', controller.produceGoods.addProduceGoods);
  router.post('/produceGoods/update', controller.produceGoods.updateProduceGoods);
  /* router.get('/package/detail/:id', controller.package.getPackageDetail);*/
  router.post('/produceGoods/delete', controller.produceGoods.deleteProduceGoods);
};
