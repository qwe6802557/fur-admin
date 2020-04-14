'use strict';

module.exports = app => {
  const { INTEGER, STRING, DOUBLE } = app.Sequelize;
  const Goods = app.model.define('goods', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    goods_name: {
      type: STRING,
      allowNull: false,
      field: 'goods_name',
    },
    goods_info: {
      type: STRING,
      allowNull: true,
      field: 'goods_info',
      defaultValue: '',
    },
    goods_image: {
      type: STRING,
      allowNull: true,
      field: 'goods_image',
      defaultValue: '',
    },
    goods_price: {
      type: INTEGER,
      field: 'goods_price',
      allowNull: true,
      defaultValue: 0,
    },
    goods_single: {
      type: INTEGER,
      field: 'goods_single',
      allowNull: true,
      defaultValue: 0,
    },
    goods_sell: {
      type: INTEGER,
      allowNull: false,
      field: 'goods_sell',
    },
    goods_num: {
      type: INTEGER,
      allowNull: true,
      field: 'goods_num',
      defaultValue: 0,
    },
    goods_time: {
      type: DOUBLE,
      allowNull: true,
      field: 'goods_time',
      defaultValue: Date.now,
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
    underscored: true, // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会被转变成 updateAt故报错
  });
  Goods.associate = function() {
    app.model.Goods.hasMany(app.model.GoodsPackage, { foreignKey: 'goods_id' });
    app.model.Goods.hasMany(app.model.ProduceGoods, { foreignKey: 'goods_id' });
  };
  return Goods;
};
