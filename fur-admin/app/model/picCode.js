'use strict';

module.exports = app => {
  const { INTEGER, STRING, ENUM, DOUBLE } = app.Sequelize;
  const picCode = app.model.define('picCode', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    picCode: {
      type: STRING,
      allowNull: false,
      field: 'picCode',
    },
    code_type: {
      type: ENUM([ '0', '1' ]),
      allowNull: true,
      field: 'code_type',
      defaultValue: '0',
    },
    code_name: {
      type: STRING,
      allowNull: false,
      field: 'code_name',
    },
    produce_id: {
      type: INTEGER,
      allowNull: false,
      field: 'produce_id',
    },
    user_id: {
      type: INTEGER,
      field: 'user_id',
      allowNull: false,
    },
    username: {
      type: STRING,
      allowNull: false,
      field: 'username',
    },
    code_time: {
      type: DOUBLE,
      allowNull: true,
      defaultValue: Date.now,
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
    underscored: true, // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会被转变成 updateAt故报错
  });
  return picCode;
};
