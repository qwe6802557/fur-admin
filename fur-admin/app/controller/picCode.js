'use strict';

const { Controller } = require('egg');

class PicCodeController extends Controller {
  // 获取二维码列表
  async getPicCode() {
    const { ctx } = this;

    try {
      const result = await this.service.picCode.getPicCode();
      ctx.body = {
        code: 0,
        message: '获取二维码列表成功!',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '获取二维码列表失败!',
        data: null,
      };
    }
  }
  // 上传二维码
  async uploadPicCode() {
    const { ctx } = this;

    const result = await this.service.picCode.uploadPicCode();

    if (result) {
      ctx.body = {
        code: 0,
        message: '上传二维码成功!',
        data: null,
      };
    } else {
      ctx.body = {
        code: 5,
        message: '上传二维码失败!',
        data: null,
      };
    }
  }
  // 删除二维码
  async deletePicCode() {
    const { ctx } = this;
    try {
      await this.service.picCode.deletePicCode();

      ctx.body = {
        code: 0,
        message: '删除二维码成功!',
        data: null,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '删除二维码失败!',
        data: null,
      };
    }
  }
}

module.exports = PicCodeController;
