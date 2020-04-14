'use strict';

module.exports = app => {
  const { INTEGER, DOUBLE, ENUM } = app.Sequelize;
  const groupMember = app.model.define('groupMember', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    group_id: {
      type: INTEGER,
      allowNull: true,
      field: 'group_id',
    },
    staff_id: {
      type: INTEGER,
      allowNull: false,
      field: 'staff_id',
    },
    is_leader: {
      type: ENUM([ '0', '1' ]), // 是否为组长 '0' 不是 '1' 组长
      allowNull: true,
      field: 'is_leader',
      defaultValue: '0',
    },
    member_time: {
      type: DOUBLE,
      allowNull: true,
      field: 'member_time',
      defaultValue: Date.now,
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
    underscored: true, // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会被转变成 updateAt故报错
  });
  groupMember.associate = function() {
    app.model.GroupMember.belongsTo(app.model.Group, { foreignKey: 'group_id', targetKey: 'id' });
    app.model.GroupMember.belongsTo(app.model.Staff, { foreignKey: 'staff_id', targetKey: 'id' });
  };
  return groupMember;
};
