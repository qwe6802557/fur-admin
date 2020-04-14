'use strict';
/** 上传文件管理controller层
* @param uploadFilesController
*/
const Controller = require('egg').Controller;

class UploadController extends Controller {
  async uploadImg() {
    const { ctx } = this;
    try {
      const result = await this.service.upload.uploadImg();
      ctx.body = {
        code: 0,
        message: '上传成功！',
        url: '/public/uploads/' + result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: e,
      };
    }
  }
  async deleteImg() {
    const { ctx } = this;
    try {
      await this.service.upload.deleteImg();
      ctx.body = {
        code: 0,
        message: '删除成功！',
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: e,
      };
    }
  }
}
module.exports = UploadController;
