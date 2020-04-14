'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.post('/producePackage/list', controller.producePackage.getProducePackage);
  router.post('/producePackage/add', controller.producePackage.addProducePackage);
  router.post('/producePackage/update', controller.producePackage.updateProducePackage);
  /* router.get('/package/detail/:id', controller.package.getPackageDetail);*/
  router.post('/producePackage/delete', controller.producePackage.deleteProducePackage);
};
