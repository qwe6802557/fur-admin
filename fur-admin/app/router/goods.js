'use strict';

/** 产品管理分路由
 * @param goodsManagerChildRouter
 */
module.exports=app=>{
    const { router,controller }=app;
    router.post('/goods/add',controller.goods.addGoods);
    router.get('/goods/list',controller.goods.getGoods);
    router.get('/goods/edit',controller.goods.getGoods);
    router.post('/goods/edit',controller.goods.editGoods);
    router.post('/goods/delete',controller.goods.deleteGoods);
    router.post('/goods/deleteMany',controller.goods.deleteGoods);
    router.post('/goods/search',controller.goods.searchGoods);
}