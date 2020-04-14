'use strict';

const { Service } = require('egg');
// node.js 文件操作对象
const fs = require('fs');
// node.js 路径操作对象
const path = require('path');
const moment = require('moment');

class PicCodeService extends Service {
  // 获取二维码信息service操作
  async getPicCode() {
    const { currentPage, pageSize, id, code_start_time, code_end_time, code_type, code_name, user_name } = this.ctx.request.body;
    const offset = (currentPage - 1) * pageSize;
    const limit = parseInt(pageSize);
    const searchCondition = {};

    !code_start_time && !!code_end_time && this.ctx.helper.defineProperty(searchCondition, 'code_time', {
      [ this.app.Sequelize.Op.lt ]: new Date(code_end_time).getTime(),
    });

    !!code_start_time && !code_end_time && this.ctx.helper.defineProperty(searchCondition, 'code_time', {
      [ this.app.Sequelize.Op.gt ]: new Date(code_start_time).getTime(),
    });

    !!code_start_time && !!code_end_time && this.ctx.helper.defineProperty(searchCondition, 'code_time', {
      [ this.app.Sequelize.Op.gt ]: new Date(code_start_time).getTime(),
      [ this.app.Sequelize.Op.lt ]: new Date(code_end_time).getTime(),
    });

    !!id && this.ctx.helper.defineProperty(searchCondition, 'id', {
      [this.app.Sequelize.Op.like]: `%${id}%`,
    });

    !!code_name && this.ctx.helper.defineProperty(searchCondition, 'code_name', {
      [this.app.Sequelize.Op.like]: `%${code_name}%`,
    });

    !!code_type && this.ctx.helper.defineProperty(searchCondition, 'code_type', code_type);

    const result = await this.ctx.model.PicCode.findAndCountAll({
      where: searchCondition,
      offset,
      limit,
      raw: true,
    });

    result.rows.map(item => {
      item.code_time = moment(item.code_time).format('YYYY-MM-DD HH:mm:ss');
      return item;
    });
    return result;
  }
  // 上传二维码
  async uploadPicCode() {

    let { base64, code_type, produce_id } = this.ctx.request.body;
    let writeFlag = true;
    base64 = base64.replace('data:image/png;base64,', '');
    const dataBuffer = Buffer.from(base64, 'base64');

    fs.writeFileSync(path.join(__dirname, '../public/uploads/' + produce_id + '.png'), dataBuffer, function(err) {
      if (err) {
        writeFlag = false;
      }
    });

    try {
      let result_produce = {};

      if (code_type === '0') {
        result_produce = await this.ctx.model.ProducePackage.findOne({
          where: {
            id: produce_id,
          },
          include: this.ctx.model.Package,
          raw: true,
        });
      } else {
        result_produce = await this.ctx.model.ProduceGoods.findOne({
          where: {
            id: produce_id,
          },
          include: this.ctx.model.Goods,
          raw: true,
        });
      }

      const result_pic = await this.ctx.model.PicCode.findOne({
        where: {
          picCode: '/public/uploads/' + produce_id + '.png',
          user_id: this.ctx.payload.data.id,
        },
        raw: true,
      });

      if (result_pic) {
        return true;
      }

      await this.ctx.model.PicCode.create({
        picCode: '/public/uploads/' + produce_id + '.png',
        code_type,
        code_name: code_type === '0' ? result_produce['package.package_name'] : result_produce['good.goods_name'],
        produce_id,
        user_id: this.ctx.payload.data.id,
        username: this.ctx.payload.data.username,
      });
    } catch (e) {
      writeFlag = false;
      console.log(e);
    }

    return writeFlag;
  }
  // 删除二维码
  async deletePicCode() {
    const { ids } = this.ctx.request.body;

    await this.ctx.model.PicCode.destroy({
      where: {
        id: ids,
      },
    });
  }
}

module.exports = PicCodeService;
