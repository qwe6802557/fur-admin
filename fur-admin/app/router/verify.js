'use strict';

/** 验证码管理及token验证分路由
 * @param verifyChildRouter
 */
module.exports = app => {
    const { router, controller } = app;
    router.get('/verify/verify_code',controller.verify.getVerCode);
    router.post('/verify/mes_code',controller.verify.getMesCode);
    router.post('/verify/valiate_code',controller.verify.valiateMes);
    router.post('/verify/token',controller.verify.valiateToken)
};