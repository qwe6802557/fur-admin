'use strict';
/**
 * 用户角色关联表
 * @param app
 * @return {*|sequelize.Model<any, any, TAttributes>|void}
 */
module.exports = app => {
  const { INTEGER } = app.Sequelize;
  const UserRole = app.model.define('user_roles', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: true,
    },
    user_id: {
      type: INTEGER,
      fields: 'user_id',
      allowNull: false,
    },
    role_id: {
      type: INTEGER,
      fields: 'role_id',
      allowNull: false,
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
  });
  UserRole.associate = function() {
    app.model.UserRole.belongsTo(app.model.User, { foreignKey: 'user_id', targetKey: 'id' });
    app.model.UserRole.belongsTo(app.model.Role, { foreignKey: 'role_id', targetKey: 'id' });
  };
  return UserRole;
};
