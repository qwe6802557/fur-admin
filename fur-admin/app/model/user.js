'use strict';
/**
 * 用户表
 * @param app
 * @returns {*|sequelize.Model<any, any, TAttributes>|void}
 */
module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const User = app.model.define('users', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    username: {
      type: STRING(255),
      allowNull: false,
      fields: 'allowNull',
    },
    password: {
      type: STRING(255),
      allowNull: false,
      fields: 'password',
    },
    identity: {
      type: INTEGER,
      defaultValue: 0,
      fields: 'identity',
    },
    e_mail: {
      type: STRING(255),
      allowNull: false,
      fields: 'e_mail',
    },
    mobile: {
      type: STRING(255),
      allowNull: false,
      fields: 'mobile',
    },
    socket_id: {
      type: STRING(255),
      allowNull: true,
      defaultValue: '',
      fields: 'socket_id',
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
  });
  User.associate = function() {
    app.model.User.hasOne(app.model.SocketUser, { foreignKey: 'user_id' });
    app.model.User.hasMany(app.model.Orders, { foreignKey: 'uid' });
    app.model.User.hasMany(app.model.FriendList, { foreignKey: 'user_id' });
    app.model.User.hasMany(app.model.MessageAdd, { foreignKey: 'user_id' });
    app.model.User.hasMany(app.model.MessageNotification, { foreignKey: 'user_id' });
    app.model.User.hasMany(app.model.UserRole, { foreignKey: 'user_id' });
  }; // 一对多或一对一外键设置
  return User;
};
