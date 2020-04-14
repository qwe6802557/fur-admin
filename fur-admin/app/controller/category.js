'use strict';

const { Controller } = require('egg');

class CategoryController extends Controller {
  async getCategory() {
    const { ctx } = this;
    try {
      const result = await this.service.category.getCategory();
      ctx.body = {
        code: 0,
        message: '查询成功！',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: e,
      };
    }
  }

  async getAllCategory() {
    const { ctx } = this;

    try {
      const result = await this.service.category.getAllCategory();
      ctx.body = {
        code: 0,
        message: '查询成功！',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '查询失败!',
      };
      throw e;
    }
  }

  async addCategory() {
    const { ctx } = this;
    try {
      const result = await this.service.category.addCategory();
      if (result === 0) {
        ctx.body = {
          code: 0,
          message: '增加成功！',
        };
      } else if (result === 1) {
        ctx.body = {
          code: 1,
          message: '该分类已存在！',
        };
      } else {
        ctx.body = {
          code: 2,
          message: '数据存在错误，请检查！',
        };
      }
    } catch (e) {
      ctx.body = {
        code: 5,
        message: e,
      };
    }
  }
  async updateCategory() {
    const { ctx } = this;
    try {
      const result = await this.service.category.updateCategory();
      if (result) {
        ctx.body = {
          code: 0,
          message: '修改成功！',
        };
      } else {
        ctx.body = {
          code: 1,
          message: '数据存在错误，请检查！',
        };
      }
    } catch (e) {
      ctx.body = {
        code: 5,
        message: e,
      };
    }
  }

  async deleteCategory() {
    const { ctx } = this;
    const result = await this.service.category.deleteCategory();

    if (result) {
      ctx.body = {
        code: 0,
        message: '删除成功！',
      };
    } else {
      ctx.body = {
        code: 5,
        message: '删除失败!',
      };
    }
  }
  async searchCategory() {
    const { ctx } = this;
    try {
      const result = await this.service.category.searchCategory();
      ctx.body = {
        code: 0,
        message: '查询成功！',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '查询失败！',
      };
    }
  }
}
module.exports = CategoryController;
