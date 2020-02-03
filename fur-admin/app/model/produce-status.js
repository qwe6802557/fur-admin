'use strict';
/**
 * 生产状态关联表
 * @param app
 * @return {*|sequelize.Model<any, any, TAttributes>|void}
 */
module.exports = app => {
  const { INTEGER } = app.Sequelize;
  const produceStatus = app.model.define('produce_status', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: true,
    },
    produce_id: {
      type: INTEGER,
      fields: 'produce_id',
      allowNull: false,
    },
    status_id: {
      type: INTEGER,
      fields: 'status_id',
      allowNull: false,
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
  });
  produceStatus.associate = function() {
    app.model.ProduceStatus.belongsTo(app.model.Produce, { foreignKey: 'produce_id', targetKey: 'id' });
    app.model.ProduceStatus.belongsTo(app.model.Status, { foreignKey: 'status_id', targetKey: 'id' });
  };
  return produceStatus;
};
