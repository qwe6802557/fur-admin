'use strict';
/**
 * 配件表
 * @param app
 * @returns {string|*|sequelize.Model<any, any, TAttributes>|void}
 */
module.exports = app => {
  const { STRING, INTEGER, ENUM, BIGINT } = app.Sequelize;
  const moment = require('moment');
  const packageModel = app.model.define('packages', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    package_name: {
      type: STRING,
      allowNull: false,
      fields: 'package_name',
    },
    package_info: {
      type: STRING,
      allowNull: false,
      fields: 'package_info',
      defaultValue: '',
    },
    package_price: {
      type: INTEGER,
      allowNull: true,
      fields: 'package_price',
      defaultValue: 0,
    },
    package_single: {
      type: INTEGER,
      allowNull: true,
      fields: 'package_single',
      defaultValue: 0,
    },
    package_status: {
      type: ENUM([ '0', '1' ]),
      allowNull: true,
      fields: 'package_status',
      defaultValue: '0',
    },
    package_num: {
      type: INTEGER,
      allowNull: true,
      fields: 'package_num',
      defaultValue: 0,
    },
    package_image: {
      type: STRING,
      allowNull: true,
      fields: 'package_image',
      defaultValue: '',
    },
    package_use: {
      type: INTEGER,
      allowNull: false,
      fields: 'package_use',
    },
    package_time: { // 存入的时间戳
      type: BIGINT,
      allowNull: true,
      defaultValue: Date.now,
      fields: 'package_time',
      get() {
        return moment(this.getDataValue('package_time')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
    underscored: true, // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会被转变成 updateAt故报错
  });
  packageModel.associate = function() {
    app.model.Package.belongsTo(app.model.MaterialUse, { foreignKey: 'package_use', targetKey: 'id' });
    app.model.Package.hasMany(app.model.PackageMaterial, { foreignKey: 'package_id' });
    app.model.Package.hasMany(app.model.ProducePackage, { foreignKey: 'package_id' });
  };
  return packageModel;
};
