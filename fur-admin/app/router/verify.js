'use strict';

/** 验证码管理分路由
 * @param verifyChildRouter
 */
module.exports = app => {
    const { router, controller } = app;
    router.get('/verify/verify_code',controller.verify.getVerCode);
    router.post('/verify/mes_code',controller.verify.getMesCode);
    router.post('/verify/valiate_code',controller.verify.valiateMes);
};