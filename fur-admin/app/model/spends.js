'use strict'

module.exports=app=>{
    const {INTEGER,STRING}=app.Sequelize;
    const Spends=app.model.define('spends',{
        id:{
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull:true,
        },
        goods_id:{
            type: INTEGER,
            allowNull:false,
            fields:'goods_id'
        },
        spend_name:{
            type:STRING,
            allowNull: false,
            fields:'spend_name'
        },
        spend_num:{
            type:INTEGER,
            allowNull:false,
            fields:'spend_num'
        }
    },{
        timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
        freezeTableName: true,// 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
        // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
        underscored: true
    })
    Spends.associate=function () {
        app.model.Spends.belongsTo(app.model.Goods,{foreignKey:'goods_id',targetKey:'id'});
    }
    return Spends;
}