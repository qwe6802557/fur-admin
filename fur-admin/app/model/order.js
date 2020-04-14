'use strict';

module.exports = app => {
  const { INTEGER, DOUBLE, ENUM } = app.Sequelize;
  const order = app.model.define('order', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    merchant_id: {
      type: INTEGER,
      field: 'merchant_id',
      allowNull: false,
    },
    goods_id: {
      type: INTEGER,
      field: 'goods_id',
      allowNull: false,
    },
    order_status: {
      type: ENUM([ '0', '1' ]), // 0 未交付  1 已交付
      allowNull: true,
      field: 'order_status',
      defaultValue: '0',
    },
    order_num: {
      type: INTEGER,
      field: 'order_num',
      allowNull: false,
    },
    order_price: {
      type: INTEGER,
      field: 'order_price',
      allowNull: false,
    },
    order_time: {
      type: DOUBLE,
      field: 'order_time',
      allowNull: true,
      defaultValue: Date.now,
    },
    handle_time: {
      type: DOUBLE,
      field: 'handle_time',
      allowNull: false,
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
    underscored: true, // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会被转变成 updateAt故报错
  });
  order.associate = function() {
    app.model.Order.belongsTo(app.model.Merchant, { foreignKey: 'merchant_id', targetKey: 'id' });
    app.model.Order.belongsTo(app.model.Goods, { foreignKey: 'goods_id', targetKey: 'id' });
    app.model.Order.hasOne(app.model.ProduceGoods, { foreignKey: 'order_id', targetKey: 'id' });
  };
  return order;
};
