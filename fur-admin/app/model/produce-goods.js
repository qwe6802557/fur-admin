'use strict';
/**
 * 配件生产表
 * @param app
 * @return {*|sequelize.Model<any, any, TAttributes>|void}
 */
module.exports = app => {
  const { INTEGER, DOUBLE, ENUM, STRING } = app.Sequelize;
  const produceGoods = app.model.define('produce_goods', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    goods_id: {
      type: INTEGER,
      fields: 'goods_id',
      allowNull: false,
    },
    machine_id: {
      type: INTEGER,
      fields: 'machine_id',
      allowNull: false,
    },
    group_id: {
      type: INTEGER,
      fields: 'group_id',
      allowNull: false,
    },
    produce_price: {
      type: INTEGER,
      fields: 'produce_price',
      allowNull: true,
      defaultValue: 0,
    },
    produce_num: {
      type: INTEGER,
      fields: 'produce_num',
      allowNull: false,
    },
    produce_status: {
      type: INTEGER, 
      fields: 'produce_status',
      allowNull: false,
    },
    produce_start_time: {
      type: DOUBLE,
      fields: 'produce_start_time',
      allowNull: true,
      defaultValue: Date.now,
    },
    produce_end_time: {
      type: DOUBLE,
      fields: 'produce_start_time',
      allowNull: true,
    },
    produce_info: {
      type: STRING,
      fields: 'produce_info',
      allowNull: true,
      defaultValue: '',
    },
    is_approved: {
      type: ENUM([ '0', '1' ]),
      allowNull: true,
      fields: 'is_approved',
      defaultValue: '0',
    },
    order_id: {
      type: INTEGER,
      fields: 'order_id',
      allowNull: true,
      defaultValue: null,
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
    underscored: true, // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会
  });
  produceGoods.associate = function() {
    app.model.ProduceGoods.belongsTo(app.model.Goods, { foreignKey: 'goods_id', targetKey: 'id' });
    app.model.ProduceGoods.belongsTo(app.model.Machine, { foreignKey: 'machine_id', targetKey: 'id' });
    app.model.ProduceGoods.belongsTo(app.model.GoodsStatus, { foreignKey: 'produce_status', targetKey: 'id' });
    app.model.ProduceGoods.belongsTo(app.model.Group, { foreignKey: 'group_id', targetKey: 'id' });
    app.model.ProduceGoods.belongsTo(app.model.Order, { foreignKey: 'order_id', targetKey: 'id' });
  };
  return produceGoods;
};
