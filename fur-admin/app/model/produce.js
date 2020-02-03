'use strict';
module.exports = app => {
  const { INTEGER, STRING, DOUBLE } = app.Sequelize;
  /* const moment = require('moment');*/
  const produce = app.model.define('produces', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    produce_name: {
      type: STRING,
      allowNull: false,
      field: 'produce_name',
    },
    /*  produce_status: {
      type: ENUM([ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11' ]), // 0.待生产 1.开料中 2.定厚砂光中 3.涂胶中 4.组胚中 5.胶压中 6.裁边中 7.封边中 8.加工成型中 9.加工装配中 10.表面修整中 11.生产完成
      allowNull: true,
      field: 'produce_status',
      defaultValue: '0',
    },*/
    produce_goods: {
      type: STRING,
      allowNull: false,
      field: 'produce_goods',
    },
    produce_number: {
      type: DOUBLE,
      allowNull: false,
      field: 'produce_number',
    },
    produce_owner: {
      type: STRING,
      allowNull: false,
      field: 'produce_owner',
    },
    produce_admin: {
      type: STRING,
      allowNull: false,
      field: 'produce_admin',
    },
    /* create_time:{
             type:DATE,
             allowNull:false,
             field:'create_time',
             get() {
                 return moment(this.getDataValue('last_day')).format('YYYY-MM-DD HH:mm:ss');
             }
         }*/
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
    underscored: true, // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会被转变成 updateAt故报错
  });
  produce.associate = function() {
    app.model.Produce.hasOne(app.model.ProduceStatus, { foreignKey: 'produce_id' });
  };
  return produce;
};
