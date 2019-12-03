'user strict'

module.exports = app => {
    const { STRING, INTEGER} = app.Sequelize;

    const User = app.model.define("users", {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull:true,
        },
        username: {
            type:STRING(255),
            allowNull:false
        },
        password: {
            type:STRING(255),
            allowNull:false
        },
        identity:{
            type:INTEGER,
            defaultValue:0
        },
        e_mail:{
            type:STRING(255),
            allowNull:false
        },
        mobile:{
            type:STRING(255),
            allowNull:false,
        }
    }, {
        timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
        freezeTableName: true// 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
        // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
        })
    User.associate=function () {
        app.model.User.hasMany(app.model.Orders,{foreignKey:'uid'});
    }  //一对多外键设置
    return User;
};