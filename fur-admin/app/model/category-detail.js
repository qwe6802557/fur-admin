'use strict';

module.exports = app => {
  const { STRING, INTEGER, ENUM,} = app.Sequelize;
  const detail = app.model.define('category_detail', {
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
      defaultValue: '0',
    },
    detail_num: {
      type: INTEGER,
      allowNull: true,
      fields: 'detail_num',
      defaultValue: 0,
    },
    detail_img: {
      type: STRING,
      allowNull: false,
      fields: 'detail_img',
    },
    detail_use: {
      type: STRING,
      allowNull: false,
      fileds: 'detail_use',
    },
    detail_time: {
      type: INTEGER,
      allowNull: true,
      defaultValue: Date.now,
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
    underscored: true, // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会被转变成 updateAt故报错
  });
  detail.associate = function() {
    app.model.CategoryDetail.belongsTo(app.model.Category, { foreignKey: 'category_id', targetKey: 'id' });
  };
  return detail;
};
