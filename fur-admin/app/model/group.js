'use strict';

module.exports = app => {
  const { INTEGER, STRING, DOUBLE, ENUM } = app.Sequelize;
  const group = app.model.define('group', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    group_name: {
      type: STRING,
      allowNull: false,
      field: 'group_name',
    },
    group_score: {
      type: INTEGER,
      allowNull: true,
      field: 'group_score',
      defaultValue: 0,
    },
    group_status: {
      type: ENUM([ '0', '1' ]), // 0 空闲中 1 工作中
      allowNull: true,
      field: 'group_status',
      defaultValue: '0',
    },
    group_time: {
      type: DOUBLE,
      allowNull: true,
      field: 'group_time',
      defaultValue: Date.now,
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
    underscored: true, // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会被转变成 updateAt故报错
  });
  group.associate = function() {
    app.model.Group.hasMany(app.model.GroupMember, { foreignKey: 'group_id' });
    app.model.Group.hasMany(app.model.Staff, { foreignKey: 'group_id' });
    app.model.Group.hasMany(app.model.ProducePackage, { foreignKey: 'group_id' });
    app.model.Group.hasMany(app.model.ProduceGoods, { foreignKey: 'group_id' });
  };
  return group;
};
