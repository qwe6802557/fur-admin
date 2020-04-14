'use strict';
/**
 * 状态表--产品生产
 * @param app
 * @return {*|sequelize.Model<any, any, TAttributes>|void}
 */
module.exports = app => {
  const { INTEGER, STRING } = app.Sequelize;
  const goodsStatus = app.model.define('goods_status', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: true,
    },
    status_name: {
      type: STRING,
      fields: 'status_name',
      allowNull: false,
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
  });
  goodsStatus.associate = function() {
    app.model.GoodsStatus.hasMany(app.model.ProduceGoods, { foreignKey: 'produce_status' });
  };
  return goodsStatus;
};
