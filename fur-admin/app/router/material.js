'use strict';

module.exports = app => {
  const { router, controller } = app;
  router.get('/material/edit/:category_id/:id', controller.material.editMaterialGet);
  router.get('/material/getDetailUse', controller.material.getMaterialUse);
  router.post('/material/list', controller.material.getMaterialList);
  router.post('/material/add', controller.material.addMaterial);
  router.post('/material/edit', controller.material.editMaterialPost);
  router.post('/material/delete', controller.material.deleteMaterial);
  router.get('/material/allMaterial', controller.material.getAllMaterial);
};
