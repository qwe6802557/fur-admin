'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const FriendList = app.model.define('friend_list', {
    id: {
      type: INTEGER,
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: INTEGER,
      allowNull: false,
      fields: 'user_id',
    },
    friend_id: {
      type: INTEGER,
      allowNull: false,
      fields: 'friend_id',
    },
    friend_name: {
      type: STRING,
      allowNull: false,
      fields: 'friend_name',
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
    underscored: true, // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会被转变成 updateAt故报错
  });
  FriendList.associate = function() {
    app.model.FriendList.belongsTo(app.model.User, { foreignKey: 'user_id', targetKey: 'id' });
  }; // 和user表进行外键设置
  return FriendList;
};
