'use strict';

/** 产品管理分路由
 * @param goodsManagerChildRouter
 */
module.exports = app => {
  const { router, controller } = app;

  router.post('/group/add', controller.group.addGroup);
  router.post('/group/list', controller.group.getGroup);
  router.post('/group/update', controller.group.updateGroup);
  router.post('/group/delete', controller.group.deleteGroup);
  router.post('/group/outStaff', controller.group.outGroup);
  /* router.get('/group/detail/:id', controller.group.getAuthorityDetail);*/
  router.post('/group/allGroup', controller.group.getAllGroup);
};
