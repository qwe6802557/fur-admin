'use strict';

/** 产品管理分路由
 * @param goodsManagerChildRouter
 */
module.exports = app => {
  const { router, controller } = app;

  router.post('/authority/add', controller.authority.addAuthority);
  router.post('/authority/set', controller.authority.setStaffAuthority);
  router.post('/authority/list', controller.authority.getAuthority);
  router.post('/authority/update', controller.authority.updateAuthority);
  router.post('/authority/delete', controller.authority.deleteAuthority);
  router.get('/authority/detail/:id', controller.authority.getAuthorityDetail);
  router.get('/authority/allAuthority', controller.authority.getAllAuthority);
  router.get('/authority/staff', controller.authority.getStaffAuthority);
};
