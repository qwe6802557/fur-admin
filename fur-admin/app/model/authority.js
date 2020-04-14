'use strict';

module.exports = app => {
  const { STRING, INTEGER, DOUBLE } = app.Sequelize;
  const authority = app.model.define('authority', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    authority_name: {
      type: STRING,
      allowNull: false,
      fields: 'authority_name',
    },
    authority_count: {
      type: INTEGER,
      allowNull: true,
      fields: 'authority_count',
      defaultValue: 0,
    },
    authority_time: {
      type: DOUBLE,
      allowNull: true,
      fields: 'authority_time',
      defaultValue: Date.now,
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
    underscored: true, // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会被转变成 updateAt故报错
  });
  authority.associate = function() {
    app.model.Authority.hasMany(app.model.StaffAuthority, { foreignKey: 'authority_id' });
  };
  return authority;
};
