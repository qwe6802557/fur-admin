'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.post('/merchant/list', controller.merchant.getMerchant);
  router.post('/merchant/add', controller.merchant.addMerchant);
  router.post('/merchant/update', controller.merchant.updateMerchant);
  router.get('/merchant/allMerchant', controller.merchant.getAllMerchant);
  router.get('/merchant/detail/:id', controller.merchant.getMerchantDetail);
  router.post('/merchant/delete', controller.merchant.deleteMerchant);
};
