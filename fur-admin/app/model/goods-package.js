'use strict';
/**
 * 产品消耗配件表
 * @param app
 * @return {*|sequelize.Model<any, any, TAttributes>|void}
 */
module.exports = app => {
  const { INTEGER, DOUBLE } = app.Sequelize;
  const spendPackage = app.model.define('spend_package', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    package_id: {
      type: INTEGER,
      fields: 'package_id',
      allowNull: false,
    },
    goods_id: {
      type: INTEGER,
      fields: 'goods_id',
      allowNull: false,
    },
    spend_num: {
      type: INTEGER,
      fields: 'spend_num',
      allowNull: false,
    },
    spend_price: {
      type: DOUBLE,
      fields: 'spend_price',
      allowNull: false,
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
    underscored: true, // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会
  });
  spendPackage.associate = function() {
    app.model.GoodsPackage.belongsTo(app.model.Goods, { foreignKey: 'goods_id', targetKey: 'id' });
    app.model.GoodsPackage.belongsTo(app.model.Package, { foreignKey: 'package_id', targetKey: 'id' });
  };
  return spendPackage;
};
