'use strict';

module.exports = app => {
  const { INTEGER, STRING, DOUBLE } = app.Sequelize;
  const List = app.model.define('list', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: true,
    },
    category_id: {
      type: INTEGER,
      allowNull: false,
      fields: 'category_id',
    },
    list_name: {
      type: STRING,
      allowNull: false,
      fields: 'list_name',
    },
    list_num: {
      type: STRING,
      allowNull: true,
      defaultValue: 0,
      fields: 'list_num',
    },
    list_info: {
      type: STRING,
      allowNull: false,
      fields: 'list_info',
    },
    list_price: {
      type: DOUBLE,
      allowNull: false,
      fields: 'material_price',
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
    underscored: true, // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会被转变成 updateAt故报错
  });
  List.associate = function() {
    app.model.List.belongsTo(app.model.Category, { foreignKey: 'category_id', targetKey: 'id' });
  };
  return List;
};
