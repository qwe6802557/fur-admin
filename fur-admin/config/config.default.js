/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
const database = 'panelfur'; // 初始化数据库名称
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1573026485155_8308';

  // add your middleware config here
  config.middleware = [];

  // 配置mysql初始连接参数
  /* config.mysql= {
    client: {
      //host
      host: 'localhost',
      //port
      port: '3306',
      //username
      user: 'root',
      //password
      password: 'luoyang',
      //database
      database: 'panelfur'
    },
    //load into app,default is open //加载到应用程序，默认为打开
    app:true,
    //load into agent,default is close //加载到代理中，默认值为“关闭”
    agent:false
  };*/
  config.sequelize = { // egg-sequelize 配置
    dialect: 'mysql', // db type
    database,
    host: 'localhost',
    port: '3306',
    username: 'root',
    password: 'luoyang',
    timezone: '+08:00', // 保存为本地时区
    dialectOptions: {
      dateStrings: true,
      typeCast(field, next) {
        // for reading from database
        if (field.type === 'DATETIME') {
          return field.string();
        }
        return next();
      },
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
  };
  // 暂时关闭crsf验证
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: [ 'http://127.0.0.1:7001', 'http://127.0.0.1:7002' ],
  };

  // 跨域配置
  config.cors = {
    origin: 'http://localhost:8080',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true,
  };

  // 配置生成jwt
  config.jwt = {
    secret: 'luoyang414@qq.com',
  };
  // 上传文件配置
  config.multipart = {
    mode: 'stream',
    fileSize: '500kb',
  };
  // 中间件配置
  config.middleware = [ 'token' ];
  config.token = {
    enable: true,
    /* match: ['/admin'], */// 只匹配指定路由，反之如果只忽略指定路由，可以用ignore
    ignore: [ '/user/login', '/user/registor', '/user/reset', '/verify', '/category' ], // 不要与match一起使用，避免冲突
  };
  // io设置
  config.io = {
    namespace: {
      '/': {
        connectionMiddleware: [ 'auth' ],
        packetMiddleware: [ 'filter', 'token' ],
      },
    },
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };


  return {
    ...config,
    ...userConfig,
  };
};
