'use strict';
/**
 * 状态表--生产过程
 * @param app
 * @return {*|sequelize.Model<any, any, TAttributes>|void}
 */
module.exports = app => {
  const { INTEGER, STRING } = app.Sequelize;
  const materialUse = app.model.define('material_use', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: true,
    },
    use_name: {
      type: STRING,
      fields: 'use_name',
      allowNull: false,
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
  });
  materialUse.associate = function() {
    app.model.MaterialUse.hasMany(app.model.Package, { foreignKey: 'package_use' });
    app.model.MaterialUse.hasMany(app.model.Machine, { foreignKey: 'machine_type' });
  };
  return materialUse;
};
