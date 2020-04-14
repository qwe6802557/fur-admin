'use strict';

module.exports = app => {
  const { STRING, INTEGER, ENUM, BIGINT } = app.Sequelize;
  const moment = require('moment');
  const detail = app.model.define('materials', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    category_id: {
      type: INTEGER,
      fields: 'category_id',
      allowNull: false,
    },
    detail_name: {
      type: STRING,
      allowNull: false,
      fields: 'detail_name',
    },
    detail_info: {
      type: STRING,
      allowNull: false,
      fields: 'detail_info',
      defaultValue: '',
    },
    detail_price: {
      type: INTEGER,
      allowNull: false,
      fields: 'detail_price',
    },
    detail_status: {
      type: ENUM([ '0', '1' ]),
      allowNull: true,
      fields: 'detail_status',
      defaultValue: '0',
    },
    detail_num: {
      type: INTEGER,
      allowNull: true,
      fields: 'detail_num',
      defaultValue: 0,
    },
    detail_image: {
      type: STRING,
      allowNull: false,
      fields: 'detail_img',
    },
    detail_time: { // 存入的时间戳
      type: BIGINT,
      allowNull: true,
      defaultValue: Date.now,
      get() {
        return moment(this.getDataValue('detail_time')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
    underscored: true, // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会被转变成 updateAt故报错
  });
  detail.associate = function() {
    app.model.Material.belongsTo(app.model.Category, { foreignKey: 'category_id', targetKey: 'id' });
    app.model.Material.hasMany(app.model.PackageMaterial, { foreignKey: 'material_id' });
  };
  return detail;
};
