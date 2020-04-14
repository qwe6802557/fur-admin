'use strict';

/** 员工管理分路由
 * @param goodsManagerChildRouter
 */
module.exports = app => {
  const { router, controller } = app;

  router.post('/staff/add', controller.staff.addStaff);
  router.post('/staff/list', controller.staff.getStaff);
  router.post('/staff/update', controller.staff.updateStaff);
  router.post('/staff/delete', controller.staff.deleteStaff);
  /* router.get('/group/detail/:id', controller.group.getAuthorityDetail);
    router.get('/group/allGroup', controller.group.getAllAuthority);*/
};
