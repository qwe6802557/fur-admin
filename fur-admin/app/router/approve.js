'use strict';

/** 审批管理分路由
 * @param goodsManagerChildRouter
 */
module.exports = app => {
  const { router, controller } = app;

  router.post('/approve/list', controller.approve.getApproveList);
  router.post('/approve/delete', controller.approve.deleteApprove);
  router.get('/approve/detail/:id', controller.approve.getApproveDetail);
  router.post('/approve/package', controller.approve.handleApprovePackage);
  router.post('/approve/goods', controller.approve.handleApproveGoods);
  router.post('/approve/handlePackage', controller.approve.passOrRejectPackageApprove);
  router.post('/approve/handleGoods', controller.approve.passOrRejectGoodsApprove);
};
