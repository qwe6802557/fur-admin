'use strict';
/**
 * 角色表
 * @param app
 * @returns {*|sequelize.Model<any, any, TAttributes>|void}
 */
module.exports = app => {
  const { INTEGER, STRING } = app.Sequelize;
  const Role = app.model.define('roles', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: true,
    },
    role_name: {
      type: STRING,
      fields: 'role_name',
      allowNull: false,
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
  });
  Role.associate = function() {
    app.model.Role.hasMany(app.model.UserRole, { foreignKey: 'role_id' });
    app.model.Role.hasMany(app.model.RolePrivilege, { foreignKey: 'role_id' });
  };
  return Role;
};
