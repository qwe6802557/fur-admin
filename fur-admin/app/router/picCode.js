'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.post('/picCode/list', controller.picCode.getPicCode);
  router.post('/picCode/upload', controller.picCode.uploadPicCode);
  router.post('/picCode/delete', controller.picCode.deletePicCode);
};
