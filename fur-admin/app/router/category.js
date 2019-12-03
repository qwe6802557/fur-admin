'use strict'

module.exports=app=>{
    const {router,controller}=app;
    router.get('/category/list',controller.category.getCategory);
    router.post('/category/add',controller.category.addCategory);
    router.get('/category/update',controller.category.getCategory);
    router.post('/category/update',controller.category.updateCategory);
    router.post('/category/delete',controller.category.deleteCategory);
}