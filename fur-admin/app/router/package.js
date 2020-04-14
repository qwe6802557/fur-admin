'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/package/list', controller.package.getPackage);
  router.get('/package/allPackage', controller.package.getAllPackage);
  router.post('/package/add', controller.package.addPackage);
  router.post('/package/update', controller.package.updatePackage);
  router.get('/package/detail/:id', controller.package.getPackageDetail);
  router.post('/package/delete', controller.package.deletePackage);
};
