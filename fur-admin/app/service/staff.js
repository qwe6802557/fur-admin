'use strict';

const { Service } = require('egg');
const moment = require('moment');

class AuthorityService extends Service {

  async getStaff() {
    const { pageSize, currentPage, id, staff_name, staff_username, staff_phone, group_id, staff_start_time, staff_end_time } = this.ctx.request.body;
    const offset = (currentPage - 1) * pageSize;
    const limit = parseInt(pageSize);
    const searchCondition = {};

    !staff_start_time && !!staff_end_time && this.ctx.helper.defineProperty(searchCondition, 'staff_time', {
      [ this.app.Sequelize.Op.lt ]: new Date(staff_end_time).getTime(),
    });

    !!staff_start_time && !staff_end_time && this.ctx.helper.defineProperty(searchCondition, 'staff_time', {
      [ this.app.Sequelize.Op.gt ]: new Date(staff_start_time).getTime(),
    });

    !!staff_start_time && !!staff_end_time && this.ctx.helper.defineProperty(searchCondition, 'staff_time', {
      [ this.app.Sequelize.Op.gt ]: new Date(staff_start_time).getTime(),
      [ this.app.Sequelize.Op.lt ]: new Date(staff_end_time).getTime(),
    });

    !!id && Object.defineProperty(searchCondition, 'id', {
      value: {
        [this.app.Sequelize.Op.like]: `%${id}%`,
      },
      writable: true,
      enumerable: true,
    });

    !!group_id && Object.defineProperty(searchCondition, 'group_id', {
      value: {
        [this.app.Sequelize.Op.like]: `%${group_id}%`,
      },
      writable: true,
      enumerable: true,
    });

    !!staff_name && Object.defineProperty(searchCondition, 'staff_name', {
      value: {
        [this.app.Sequelize.Op.like]: `%${staff_name}%`,
      },
      writable: true,
      enumerable: true,
    });

    !!staff_username && Object.defineProperty(searchCondition, 'staff_username', {
      value: {
        [this.app.Sequelize.Op.like]: `%${staff_username}%`,
      },
      writable: true,
      enumerable: true,
    });

    !!staff_phone && Object.defineProperty(searchCondition, 'staff_phone', {
      value: {
        [this.app.Sequelize.Op.like]: `%${staff_phone}%`,
      },
      writable: true,
      enumerable: true,
    });

    const result = await this.ctx.model.Staff.findAndCountAll({
      where: searchCondition,
      offset,
      limit,
      raw: true,
      include: [{
        model: this.ctx.model.Group,
      }, {
        model: this.ctx.model.GroupMember,
      }],
    });

    result.rows.map(item => {
      item.staff_time = moment(item.staff_time).format('YYYY-MM-DD HH:mm:ss');
      return item;
    });

    return result;
  }

  async getAllStaff() {
    return await this.ctx.model.Staff.findAll({
      raw: true,
    });
  }

  async addStaff() {
    let { staff_name, staff_username, staff_password,
      staff_phone, staff_eMail, group_id  } = this.ctx.request.body;
    const transaction = await this.ctx.model.transaction();

    staff_name = staff_name.trim();
    staff_username = staff_username.trim();

    try {
      const result_name = await this.ctx.model.Staff.findOne({
        where: {
          staff_name,
        },
        raw: true,
      });

      if (result_name) {
        return 1;
      }

      const result_username = await this.ctx.model.User.findOne({
        where: {
          username: staff_username,
        },
        raw: true,
      });

      if (result_username) {
        return 2;
      }

      const result_phone = await this.ctx.model.User.findOne({
        where: {
          mobile: staff_phone,
        },
        raw: true,
      });

      if (result_phone) {
        return 3;
      }

      const result_email = await this.ctx.model.User.findOne({
        where: {
          e_mail: staff_eMail,
        },
        raw: true,
      });

      if (result_email) {
        return 4;
      }

      staff_password = await this.ctx.app.encryptPw(5, staff_password);

      console.log(staff_password);

      await this.ctx.model.User.create({
        username: staff_username,
        password: staff_password,
        identity: '0',
        e_mail: staff_eMail,
        mobile: staff_phone,
      }, {
        transaction,
      });

      await this.ctx.model.Staff.create({
        staff_name,
        staff_username,
        staff_password,
        staff_eMail,
        staff_phone,
        group_id,
      }, {
        raw: true,
        transaction,
      });

      await transaction.commit();

      return 0;
    } catch (e) {
      await transaction.rollback();
      console.log(e);
      return 5;
    }
  }

  async updateStaff() {
    const { id, group_id, is_leader } = this.ctx.request.body;

    const result = await this.ctx.model.GroupMember.findOne({
      where: {
        staff_id: id,
      },
      raw: true,
    });

    if (result) {

      if (is_leader === '1') {
        await this.ctx.model.GroupMember.update({
          is_leader: '0',
        }, {
          where: {
            is_leader: '1',
            group_id,
          },
          raw: true,
        });
      }

      await this.ctx.model.GroupMember.update({
        group_id: group_id ? group_id : null,
        staff_id: id,
        is_leader: is_leader.toString(),
      }, {
        where: {
          staff_id: id,
        },
      });
    } else {
      await this.ctx.model.GroupMember.create({
        group_id: group_id ? group_id : null,
        staff_id: id,
        is_leader: is_leader.toString(),
      });
    }

    await this.ctx.model.Staff.update({
      group_id: group_id ? group_id : null,
    }, {
      where: {
        id,
      },
    });

    return true;
  }

  async deleteStaff() {
    const { ids } = this.ctx.request.body;
    const transaction = await this.ctx.model.transaction();

    try {

      const result = await this.ctx.model.Staff.findAll({
        where: {
          id: ids,
        },
        raw: true,
        transaction,
      });

      const names = result.map(item => item.staff_username);

      await this.ctx.model.GroupMember.destroy({
        where: {
          staff_id: ids,
        },
        transaction,
      });

      await this.ctx.model.StaffAuthority.destroy({
        where: {
          staff_id: ids,
        },
        transaction,
      });

      await this.ctx.model.Staff.destroy({
        where: {
          id: ids,
        },
        transaction,
      });

      await this.ctx.model.User.destroy({
        where: {
          username: names,
        },
        transaction,
      });

      await transaction.commit();

      return true;
    } catch (e) {
      await transaction.rollback();
      console.log(e);
      return false;
    }
  }
}
module.exports = AuthorityService;
