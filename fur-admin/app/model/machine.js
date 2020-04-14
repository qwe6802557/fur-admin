'use strict';
/**
 * 机器--生产
 * @param app
 * @returns {*|sequelize.Model<any, any, TAttributes>|void}
 */
module.exports = app => {
  const { STRING, INTEGER, ENUM, DOUBLE } = app.Sequelize;
  const Machine = app.model.define('machine', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    machine_name: {
      type: STRING,
      allowNull: false,
      fields: 'machine_name',
    },
    machine_use: {
      type: ENUM([ '0', '1' ]), // '0' 配件生产  '1' 产品生产
      allowNull: true,
      fields: 'machine_use',
      defaultValue: '0',
    },
    machine_price: {
      type: INTEGER,
      allowNull: false,
      fields: 'machine_price',
    },
    machine_type: {
      type: INTEGER,
      allowNull: true,
      fields: 'machine_type',
      defaultValue: 9,
    },
    machine_status: {
      type: ENUM([ '0', '1' ]), // '0' 待运行  '1' 运行中
      allowNull: true,
      fields: 'machine_status',
      defaultValue: '0',
    },
    machine_image: {
      type: STRING,
      allowNull: true,
      fields: 'machine_image',
      defaultValue: '',
    },
    machine_info: {
      type: STRING,
      allowNull: true,
      fields: 'machine_info',
      defaultValue: '',
    },
    machine_time: {
      type: DOUBLE,
      allowNull: true,
      fields: 'machine_time',
      defaultValue: Date.now,
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
    underscored: true, // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会被转变成 updateAt故报错
  });
  Machine.associate = function() {
    app.model.Machine.belongsTo(app.model.MaterialUse, { foreignKey: 'machine_type', targetKey: 'id' });
    app.model.Machine.hasMany(app.model.ProducePackage, { foreignKey: 'machine_id' });
  };
  return Machine;
};
