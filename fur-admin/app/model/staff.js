'use strict';

module.exports = app => {
  const { INTEGER, STRING, DOUBLE } = app.Sequelize;
  const staff = app.model.define('staff', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    group_id: {
      type: INTEGER,
      field: 'group_id',
      allowNull: true,
    },
    staff_name: {
      type: STRING,
      allowNull: false,
      field: 'staff_name',
    },
    staff_username: {
      type: STRING,
      allowNull: true,
      field: 'staff_username',
      defaultValue: '',
    },
    staff_password: {
      type: STRING,
      allowNull: false,
      field: 'staff_password',
    },
    staff_phone: {
      type: DOUBLE,
      field: 'staff_phone',
      allowNull: false,
    },
    staff_eMail: {
      type: STRING,
      allowNull: false,
      field: 'staff_eMail',
    },
    staff_time: {
      type: DOUBLE,
      allowNull: true,
      field: 'staff_time',
      defaultValue: Date.now,
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
    underscored: true, // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会被转变成 updateAt故报错
  });
  staff.associate = function() {
    app.model.Staff.hasMany(app.model.GroupMember, { foreignKey: 'staff_id' });
    app.model.Staff.hasMany(app.model.StaffAuthority, { foreignKey: 'staff_id' });
    app.model.Staff.belongsTo(app.model.Group, { foreignKey: 'group_id', targetKey: 'id' });
  };
  return staff;
};
