'use strict';
module.exports = app => {
  const { INTEGER, STRING } = app.Sequelize;
  const socketUsers = app.model.define('socket_users', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    user_id: {
      type: INTEGER,
      fields: 'user_id',
      allowNull: false,
    },
    socket_id: {
      type: STRING,
      fields: 'socket_id',
      allowNull: true,
    },
  }, {
    timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
    freezeTableName: true, // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
    underscored: true, // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会
  });
  socketUsers.associate = function() {
    app.model.SocketUser.belongsTo(app.model.User, { foreignKey: 'user_id', targetKey: 'id' });
  };
  return socketUsers;
};
