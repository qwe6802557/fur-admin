'use strict';
/** 审批管理controller层
 * @param ordersManagerController
 */
const Controller = require('egg').Controller;

class ApproveController extends Controller {
  // 获取审批信息
  async getApproveList() {
    const { ctx } = this;

    try {
      const result = await this.service.approve.getApproveList();
      ctx.body = {
        code: 0,
        message: '获取审批信息成功！',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 0,
        message: '获取审批信息失败！',
        data: null,
      };
      throw e;
    }
  }
  // 查看审批详情
  async getApproveDetail() {
    const { ctx } = this;

    try {
      const result = await this.service.getApproveDetail();

      ctx.body = {
        code: 0,
        message: '获取审批详情成功',
        data: result,
      };
    } catch (e) {

      ctx.body = {
        code: 5,
        message: '获取审批详情失败',
        data: null,
      };
      throw e;
    }

  }
  // 删除审批操作
  async deleteApprove() {
    const { ctx } = this;
    try {
      await this.service.approve.deleteApprove();

      ctx.body = {
        code: 0,
        message: '删除审批成功!',
        data: null,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '删除审批失败!',
        data: null,
      };
      throw e;
    }
  }
  async getApproveDetail() {
    const { ctx } = this;
    try {
      const result = await this.service.approve.getApproveDetail();
      ctx.body = {
        code: 0,
        message: '查询审批详情成功!',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '查询审批详情失败!',
        data: null,
      };
      throw e;
    }
  }
  // 提交配件审批
  async handleApprovePackage() {
    const { ctx } = this;

    const result = await this.service.approve.handleApprovePackage();
    if (result) {
      ctx.body = {
        code: 0,
        message: '提交配件审批成功!',
        data: result,
      };
    } else {
      ctx.body = {
        code: 5,
        message: '提交配件审批失败!',
        data: null,
      };
    }
  }
  // 配件审批通过/不通过
  async passOrRejectPackageApprove() {
    const { ctx } = this;
    try {
      const result = await this.service.approve.passOrRejectPackageApprove();
      ctx.body = {
        code: 0,
        message: '审批成功!',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '审批失败!',
        data: null,
      };
      throw e;
    }
  }
  // 产品提交审批
  async handleApproveGoods() {
    const { ctx } = this;
    const result = await this.service.approve.handleApproveGoods();

    if (result) {
      ctx.body = {
        code: 0,
        message: '提交产品审批成功!',
        data: result,
      };
    } else {
      ctx.body = {
        code: 5,
        message: '提交产品审批失败!',
        data: null,
      };
    }
  }
  // 产品审批通过/不通过
  async passOrRejectGoodsApprove() {
    const { ctx } = this;
    const result = await this.service.approve.passOrRejectGoodsApprove();

    if (result === 0) {
      ctx.body = {
        code: 0,
        message: '审批成功!',
        data: result,
      };
    } else {
      ctx.body = {
        code: 5,
        message: '审批失败!',
        data: null,
      };
    }
  }
}
module.exports = ApproveController;
