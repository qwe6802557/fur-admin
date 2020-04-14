'use strict';
/** 商户管理controller层
 * @param ordersManagerController
 */
const Controller = require('egg').Controller;

class MerchantController extends Controller {
  // 获取商户信息
  async getMerchant() {
    const { ctx } = this;
    try {
      const result = await this.service.merchant.getMerchant();

      ctx.body = {
        code: 0,
        message: '查询成功!',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '查询失败!',
        data: null,
      };
      throw e;
    }
  }
  // 添加商户信息
  async addMerchant() {
    const { ctx } = this;
    const result = await this.service.merchant.addMerchant();
    if (result === 0) {
      ctx.body = {
        code: 0,
        message: '增加商户成功！',
      };
    } else if (result === 2) {
      ctx.body = {
        code: 2,
        message: '用户名已存在！',
      };
    } else if (result === 3) {
      ctx.body = {
        code: 3,
        message: '手机号已被注册！',
      };
    } else if (result === 4) {
      ctx.body = {
        code: 4,
        message: '邮箱已被注册！',
      };
    } else {
      ctx.body = {
        code: 5,
        message: '增加商户失败!',
      };
    }
  }
  // 删除商户
  async deleteMerchant() {
    const { ctx } = this;
    const result = await this.service.merchant.deleteMerchant();
    if (result) {
      ctx.body = {
        code: 0,
        message: '删除商户成功！',
      };
    } else {
      ctx.body = {
        code: 5,
        message: '删除商户失败!',
      };
    }
  }
  // 获取所有商户
  async getAllMerchant() {
    const { ctx } = this;
    try {
      const result = await this.service.merchant.getAllMerchant();

      ctx.body = {
        code: 0,
        message: '查询成功!',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '查询失败!',
        data: null,
      };
    }
  }
  // 修改商户
  async updateMerchant() {
    const { ctx } = this;
    try {
      await this.service.merchant.updateMerchant();

      ctx.body = {
        code: 0,
        message: '修改商户成功!',
        data: null,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '修改商户失败!',
        data: null,
      };
    }
  }
  // 查看商户详情
  async getMerchantDetail() {
    const { ctx } = this;
    try {
      const result = await this.service.merchant.getMerchantDetail();

      ctx.body = {
        code: 0,
        message: '查询成功!',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '查询失败!',
        data: null,
      };
      throw e;
    }
  }
}
module.exports = MerchantController;
