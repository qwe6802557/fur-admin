'use strict';

/**定义应用的生命周期函数执行内容
 *@param defineContentsInAppLifeFunction
 */
module.exports=(app)=>{
    app.beforeStart(async () => {
        // 应用会等待这个函数执行完成才启动
        await app.model.sync({alter:true});
        let password=await app.encryptPw(10,'admin');
        let result=await app.model.User.findOne({
            where:{
                id:1,
                username:'admin'
            },
            raw:true
        })
        if (!result){
            await app.model.User.create({
                id:1,
                username:'admin',
                password,
                e_mail:'425160813@qq.com',
                identity:1,
                mobile:'13372604414'
            })
        }else {
            console.log('已存在超级管理员！');
        }
    });
    /*app.ready(async ()=>{
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


}