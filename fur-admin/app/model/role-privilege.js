'use strict';
/**
 * 角色权限关联表
 * @param app
 * @return {*|sequelize.Model<any, any, TAttributes>|void}
 */
module.exports = app => {
  const { INTEGER } = app.Sequelize;
  const RolePrivilege = app.model.define('role_privileges', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: true,
    },
    role_id: {
      type: INTEGER,
      fields: 'role_id',
      allowNull: false,
    },
    privilege_id: {
      type: INTEGER,
      fields: 'privilege_id',
      allowNull: false,
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
  });
  RolePrivilege.associate = function() {
    app.model.RolePrivilege.belongsTo(app.model.Role, { foreignKey: 'role_id', targetKey: 'id' });
    app.model.RolePrivilege.belongsTo(app.model.Privilege, { foreignKey: 'privilege_id', targetKey: 'id' });
  };
  return RolePrivilege;
};
