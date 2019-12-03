'use strict';

/** @type Egg.EggPlugin */
//配置应用启动时所启用的包
module.exports = {
    mysql:{
        enable:true,
        package:'egg-mysql'
    },
    cors:{
        enable:true,
        package: 'egg-cors'
    },
    jwt:{
        enable:true,
        package:'egg-jwt'
    },
    sequelize:{
        enable:true,
        package:'egg-sequelize',
    },
    io:{
        enable:true,
        package:'egg-socket.io'
    }
};
