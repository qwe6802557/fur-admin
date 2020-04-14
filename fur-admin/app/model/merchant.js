'use strict';

module.exports = app => {
  const { INTEGER, STRING, DOUBLE } = app.Sequelize;
  const merchant = app.model.define('merchant', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    merchant_username: {
      type: STRING,
      field: 'merchant_username',
      allowNull: false,
    },
    merchant_password: {
      type: STRING,
      allowNull: false,
      field: 'merchant_password',
    },
    merchant_eMail: {
      type: STRING,
      allowNull: false,
      field: 'merchant_eMail',
      defaultValue: '',
    },
    merchant_address: {
      type: STRING,
      allowNull: true,
      field: 'merchant_address',
      defaultValue: '',
    },
    merchant_phone: {
      type: DOUBLE,
      allowNull: false,
      field: 'merchant_phone',
    },
    merchant_time: {
      type: DOUBLE,
      allowNull: true,
      field: 'merchant_time',
      defaultValue: Date.now,
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
    underscored: true, // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会被转变成 updateAt故报错
  });

  merchant.associate = function() {
    app.model.Merchant.hasMany(app.model.Order, { foreignKey: 'merchant_id' });
  };

  return merchant;
};
