'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.post('/machine/list', controller.machine.getMachineList);
  router.post('/machine/add', controller.machine.addMachine);
  router.post('/machine/update', controller.machine.updateMachine);
  router.post('/machine/delete', controller.machine.deleteMachine);
  router.get('/machine/packageMachine', controller.machine.getPackageMachine);
  router.get('/machine/packageGoods', controller.machine.getGoodsMachine);
};
