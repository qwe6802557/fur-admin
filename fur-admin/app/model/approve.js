'use strict';

module.exports = app => {
  const { INTEGER, STRING, DOUBLE, ENUM } = app.Sequelize;
  const approve = app.model.define('approve', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    produce_id: {
      type: INTEGER,
      allowNull: false,
      field: 'produce_id',
    },
    approve_type: {
      type: ENUM([ '0', '1' ]), // 0 配件生产 1 产品生产
      allowNull: true,
      field: 'approve_type',
      defaultValue: '0',
    },
    approve_status: {
      type: ENUM([ '0', '1', '2' ]), // 0 待审批 1 通过 2 驳回
      allowNull: true,
      field: 'approve_status',
      defaultValue: '0',
    },
    approve_creator: {
      type: STRING,
      allowNull: false,
      field: 'approve_creator',
    },
    creator_id: {
      type: INTEGER,
      allowNull: false,
      field: 'creator_id',
    },
    approve_id: {
      type: INTEGER,
      allowNull: false,
      field: 'approve_id',
    },
    machine_id: {
      type: INTEGER,
      allowNull: true,
      field: 'machine_id',
      defaultValue: 0,
    },
    approve_time: {
      type: DOUBLE,
      allowNull: true,
      field: 'approve_time',
      defaultValue: Date.now,
    },
    approve_advice: {
      type: STRING,
      allowNull: true,
      field: 'approve_advice',
      defaultValue: '',
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
    underscored: true, // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会被转变成 updateAt故报错
  });
  approve.associate = function() {
    app.model.Approve.belongsTo(app.model.User, { foreignKey: 'creator_id' });
    app.model.Approve.belongsTo(app.model.User, { foreignKey: 'approve_id' });
  };
  return approve;
};
