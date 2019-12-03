'use strict';

const Service =require('egg').Service;
//node.js 文件操作对象
const fs = require('fs');
//node.js 路径操作对象
const path = require('path');
//管道读入一个虫洞。
const sendToWormhole = require('stream-wormhole');
//这里使用了egg-multipart
const md5 = require('md5'); //这里由于文件名的限制用md5加密 暂时放弃bcrypt加密

class UploadService extends Service{
    async uploadImg(){
        //egg-multipart 已经帮我们处理文件二进制对象
        // node.js 和 php 的上传唯一的不同就是 ，php 是转移一个 临时文件
        // node.js 和 其他语言（java c#） 一样操作文件流
        const stream = await this.ctx.getFileStream();
        //新建一个文件名
        const filename = md5(stream.filename) + path.extname(stream.filename).toLocaleLowerCase();
        //文件生成绝对路径
        //当然这里这样是不行的，因为你还要判断一下是否存在文件路径
        const target = path.join(this.config.baseDir, `app/public/uploads/${filename}`);

        return new Promise((resolve, reject) => {
            // 创建文件写入流
            const remoteFileStrem = fs.createWriteStream(target)
            // 以管道方式写入流
            stream.pipe(remoteFileStrem)
            let errFlag
            // 监听error事件
            remoteFileStrem.on('error', err => {
                errFlag = true
                // 停止写入
                sendToWormhole(stream)
                remoteFileStrem.destroy()
                reject(err)
            });
            // 监听写入完成事件
            remoteFileStrem.on('finish', () => {
                if (errFlag) return
                resolve(filename)
            })
        })
    }
    async deleteImg(){
        const {url}=this.ctx.request.body;
        return new Promise((resolve, reject) =>{
            fs.unlink(path.join(this.config.baseDir,'/app',url.split('7001')[1]),(err)=>{
                if (err)reject(err);
                resolve(true);
            })
        })
    }
}
module.exports=UploadService;