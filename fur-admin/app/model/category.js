'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;
  const Category = app.model.define('category', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    category_name: {
      type: STRING,
      allowNull: false,
      fields: 'category_name',
    },
    category_info: {
      type: STRING,
      allowNull: false,
      fields: 'category_info',
      defaultValue: '',
    },
    category_num: {
      type: INTEGER,
      allowNull: true,
      fields: 'category_num',
      defaultValue: 0,
    },
    category_children_num: {
      type: INTEGER,
      allowNull: true,
      fields: 'category_children_num',
      defaultValue: 0,
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
    underscored: true, // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会被转变成 updateAt故报错
  });
  Category.associate = function() {
    app.model.Category.hasOne(app.model.List, { foreignKey: 'category_id' });
    app.model.Category.hasMany(app.model.Material, { foreignKey: 'category_id' });
  };
  return Category;
};
