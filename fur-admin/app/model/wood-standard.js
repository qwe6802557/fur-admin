'use strict';
module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;
  const woodStandard = app.model.define('wood_standard', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    wood_name: {
      type: STRING,
      allowNull: false,
      fields: 'wood_name',
    },
    wood_length: {
      type: STRING,
      allowNull: false,
      fields: 'wood_length', // 木材标准宽度 单位mm
    },
    wood_width: {
      type: STRING,
      allowNull: false,
      fields: 'wood_width', // 木材标准长度 单位mm
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
  });
  return woodStandard;
};
