'use strict';
module.exports = app => {
  const { ENUM, INTEGER, STRING } = app.Sequelize;
  const addMessage = app.model.define('add_messages', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    user_id: {
      type: INTEGER,
      fields: 'user_id',
      allowNull: false,
    },
    friend_id: {
      type: INTEGER,
      fields: 'friend_id',
      allowNull: false,
    },
    friend_name:{
      type:STRING,
      fields:'friend_name',
      allowNull:false
    },
    is_allowed: {
      type: ENUM([ '0', '1' ]),
      allowNull: true,
      defaultValue: '0',
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
    underscored: true, // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会
  });
  return addMessage;
};
