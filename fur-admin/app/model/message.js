'use strict';

module.exports = app => {
  const { INTEGER, STRING, BOOLEAN } = app.Sequelize;
  const moment = require('moment');
  const Message = app.model.define('messages', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: true,
    },
    user_id: {
      type: INTEGER,
      allowNull: false,
      fields: 'user_id',
    },
    friend_id: {
      type: INTEGER,
      allowNull: false,
      fields: 'friend_id',
    },
    user_name: {
      type: STRING,
      allowNull: false,
      fields: 'user_name',
    },
    content: {
      type: STRING,
      allowNull: true,
      defaultValue: '',
      fields: 'content',
    },
    is_mine: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false,
      fields: 'is_mine',
    },
    date_time: {
      type: STRING,
      allowNull: true,
      defaultValue: moment(Date.now()).format('YYYY-MM-DD HH:mm'),
      fields: 'date_time',
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
    underscored: true, // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会被转变成 updateAt故报错
  });
  return Message;
};
