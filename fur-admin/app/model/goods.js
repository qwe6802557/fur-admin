'use strict'

module.exports=app=>{
    const { DATE ,INTEGER,STRING,DOUBLE}=app.Sequelize;
    const moment=require('moment');
    const Goods=app.model.define("goods",{
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull:true
        },
        goods_name:{
            type:STRING,
            allowNull: false,
            field:"goods_name"
        },
        goods_material:{
            type:STRING,
            allowNull:false,
            field:"goods_material"
        },
        goods_info:{
            type:STRING,
            allowNull:false,
            field:"goods_info"
        },
        goods_image:{
            type:STRING,
            allowNull:false,
            field: "goods_image"
        },
        goods_price:{
            type:DOUBLE,
            allowNull:false,
            field:"goods_price"
        },
        goods_num:{
            type:DOUBLE,
            defaultValue:0,
            field:"goods_num"
        }
       /* create_time:{
            type:DATE,
            allowNull:false,
            field:'create_time',
            get() {
                return moment(this.getDataValue('last_day')).format('YYYY-MM-DD HH:mm:ss');
            }
        }*/
    },{
        timestamps: false, // 自动维护时间戳 [ created_at、updated_at ]
        freezeTableName: true,// 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
        // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
        underscored: true  // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会被转变成 updateAt故报错
    })
    Goods.associate=function () {
        app.model.Goods.hasOne(app.model.Spends,{foreignKey:'goods_id'})
    }
    return Goods;
}