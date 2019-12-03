'use strict';

/** 上传文件管理分路由
 * @param uploadFilesChildRouter
 */
module.exports=app=>{
    const { router,controller }=app;
    router.post('/upload',controller.upload.uploadImg);
    router.post('/upload/delete',controller.upload.deleteImg)
}