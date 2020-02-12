'use strict';

/** 定义应用的生命周期函数执行内容
 *@param defineContentsInAppLifeFunction
 */
module.exports = app => {
  app.beforeStart(async () => {
    // 应用会等待这个函数执行完成才启动
    await app.model.sync({ alter: true });
    const password = await app.encryptPw(10, 'admin');
    const result = await app.model.User.findOne({
      where: {
        id: 1,
        username: 'admin',
      },
      raw: true,
    });
    const result_roles = await app.model.Role.findOne({
      raw: true,
    });
    const result_status = await app.model.Status.findOne({
      raw: true,
    });
    const result_materialUse = await app.model.MaterialUse.findOne({
      raw: true,
    });
    if (!result) {
      await app.model.User.create({
        id: 1,
        username: 'admin',
        password,
        e_mail: '425160813@qq.com',
        identity: 1,
        mobile: '13372604414',
      });
    } else {
      console.log('已存在超级管理员！');
    }
    if (!result_roles) {
      const rolesArr = [{ role_name: '普通商户' }, { role_name: 'VIP商户' }, { role_name: '普通员工' }, { role_name: '一级审核员' }, { role_name: '二级管理员' }];
      await app.model.Role.bulkCreate(rolesArr);
    }
    if (!result_status) {
      const statusArr = [{ status_name: '待生产' }, { status_name: '开料中' }, { status_name: '定厚砂光中' }, { status_name: '涂胶中' }, { status_name: '组胚中' },
        { status_name: '胶压中' }, { status_name: '裁边中' }, { status_name: '封边中' }, { status_name: '加工成型中' }, { status_name: '加工装配中' }, { status_name: '表面修整中' },
        { status_name: '生产完成' }];
      await app.model.Status.bulkCreate(statusArr);
    }
    if (!result_materialUse) {
      const useArr = [{ use_name: '开料' }, { use_name: '定厚砂光' }, { use_name: '涂胶' }, { use_name: '组胚' },
        { use_name: '胶压' }, { use_name: '裁边及封边' }, { use_name: '加工成型及装配' }, { use_name: '表面修整' },
      ];
      await app.model.MaterialUse.bulkCreate(useArr);
    }
  });
  /* app.ready(async ()=>{
        let result=await app.mysql.get('users',{username:'admin'});
        if (!result){
            let password=await app.encryptPw(10,'admin');
            app.mysql.insert('users',{id:1,username:'admin',password,e_Mail:'425160813@qq.com',identity:1,mobile:'13372604414'}).then(res=>{
                console.log('初始化成功！')
            }).catch(err=>{
                throw err;
            })
        }else {
            console.log('已初始化过！')
        }
    })*/


};
