'use strict';
/**
 * 权限表
 * @param app
 * @return {*|sequelize.Model<any, any, TAttributes>|void}
 */
module.exports = app => {
  const { INTEGER, STRING } = app.Sequelize;
  const Privilege = app.model.define('privileges', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: true,
    },
    privilege_describe: {
      type: STRING,
      fields: 'privilege_describe',
      allowNull: true,
      defaultValue: null,
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
  });
  Privilege.associate = function() {
    app.model.Privilege.hasMany(app.model.RolePrivilege, { foreignKey: 'privilege_id' });
  };
  return Privilege;
};
