'user strict';

module.exports = app => {
  const { DATE, INTEGER, STRING, DOUBLE } = app.Sequelize;
  const moment = require('moment');
  const Orders = app.model.define('orders', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    uid: { // uid作为外键
      type: INTEGER(10),
      allowNull: false,
      field: 'uid',
    },
    order_name: {
      type: STRING,
      allowNull: false,
      field: 'order_name',
    },
    order_owner: {
      type: STRING,
      allowNull: false,
      field: 'order_owner',
    },
    order_status: {
      type: STRING,
      allowNull: false,
      field: 'order_status',
    },
    owner_address: {
      type: STRING,
      allowNull: false,
      field: 'owner_address',
    },
    order_time: {
      type: DATE,
      allowNull: false,
      field: 'order_time',
      get() {
        return moment(this.getDataValue('order_time')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    last_day: {
      type: DATE,
      allowNull: false,
      field: 'last_day',
      get() {
        return moment(this.getDataValue('last_day')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    order_num: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'order_num',
    },
    order_price: {
      type: DOUBLE,
      allowNull: false,
      field: 'order_price',
    },
    owner_address: {
      type: STRING,
      allowNull: false,
      field: 'owner_address',
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
    underscored: true, // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会被转变成 updateAt故报错
  });
  Orders.associate = function() {
    app.model.Orders.belongsTo(app.model.User, { foreignKey: 'uid', targetKey: 'id' });
  }; // 根于uid设置user的Id为外键
  return Orders;
};
