'use strict';
/** 用户管理service层
 * @param userManagerService
 */
const Service = require('egg').Service;

class UserService extends Service {
  // 用户登录service操作
  async login() {
    try {
      const { username, password, verify_code } = this.ctx.request.body;
      const result = await this.app.model.User.findOne({
        where: {
          [this.app.Sequelize.Op.or]: [{
            username,
          }, {
            mobile: username,
          }, {
            e_mail: username,
          },
          ],
        },
      }); // 模糊查询：`SELECT * FROM USERS WHERE CONCAT(USERNAME,MOBILE) LIKE '%${username}%'`
      if (result) {
        const isMatch = await this.app.decryptPw(password, result.password);
        if (isMatch) {
          if (verify_code.toLowerCase() === this.ctx.session.verify_code.toLowerCase()) {
            return {
              code: 0,
              res: '登录成功！',
              data: result,
            };
          }
          return {
            code: 2,
            res: '验证码输入错误！',
          };
        }
        return {
          code: 1,
          res: '账号或者密码错误！',
        };

      }
      return {
        code: 3,
        res: '用户不存在！',
      };

    } catch (e) {
      return {
        code: 5,
        res: e,
      };
    }
  }

  // 用户注册service操作
  async registor() {
    const { username, password, e_mail, mobile } = this.ctx.request.body;
    const FACTORY_STRENTTH = 10; // 设置加盐加密强度
    const result = await this.app.model.User.findOne({
      where: {
        username,
      },
    });
    if (!result) {
      const result_hash = await this.app.encryptPw(FACTORY_STRENTTH, password);
      return await this.app.model.User.create({ username, password: result_hash, e_mail, mobile }).then(async res => {
        if (res) {
          await this.ctx.model.UserRole.create({
            user_id: res.dataValues.id,
            role_id: 1,
          });
          return {
            code: 0,
            res: '注册成功！将自动跳转到主页！',
            data: res.dataValues,
          };
        }
        return {
          code: 2,
          res: '注册失败！',
        };
      }).catch(err => {
        return {
          code: 5,
          res: err,
        };
      });
    }
    return {
      code: 1,
      res: '用户名已存在!',
    };
  }
  // 获取未处理消息
  async getMainMessage() {
    const { id } = this.ctx.payload.data;
    const result = await this.ctx.model.MessageNotification.findAll({
      where: {
        user_id: id,
      },
    });
    return result;
  }
  // 重置密码
  async resetPass() {
    const { mobile, password } = this.ctx.request.body;
    try {
      const result = await this.app.model.User.findOne({
        where: {
          mobile,
        },
      });
      if (result) {
        const FACTORY_STRENTTH = 10;
        const hash = await this.app.encryptPw(FACTORY_STRENTTH, password);
        const result_reset = await this.app.mysql.update('users', { password: hash }, { where: { mobile } });
        if (result_reset.serverStatus === 34) {
          return {
            code: 0,
            res: '重置密码成功！',
          };
        }
        return {
          code: 1,
          res: '重置密码失败！',
        };

      }
      return {
        code: 2,
        res: '账号不存在！',
      };

    } catch (e) {
      return {
        code: 5,
        res: e,
      };
    }
  }
  // 退出登录
  async loginOut() {
    const { id } = this.ctx.payload.data;
    await this.ctx.model.SocketUser.update({ socket_id: null }, {
      where: {
        user_id: id,
      },
    });
    this.ctx.payload = null;
  }
}
module.exports = UserService;
