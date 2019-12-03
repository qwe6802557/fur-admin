'use strict'

const {Controller}=require('egg');

class ListController extends Controller{
    async getList(){
        const {ctx}=this;
        try {
            const result=await this.service.List.getList();
            ctx.body={
                code:0,
                message:'查询成功！',
                data:result
            }
        }catch (e) {
            ctx.body={
                code:5,
                message:e
            }
        }
    }
    async addList(){
        const {ctx}=this;
        try {
            const result=await this.service.List.addList();
            if (result){
                ctx.body={
                    code:0,
                    message:'增加成功！'
                }
            }else {
                ctx.body={
                    code:1,
                    message:'数据存在错误，请检查！'
                }
            }
        }catch (e) {
            ctx.body={
                code:5,
                message:e
            }
        }
    }
    async updateList(){
        const {ctx}=this;
        try {

         const result=await this.service.List.updateList();
            if (result){
                ctx.body={
                    code:0,
                    message:'更新成功！'
                }
            }else {
                ctx.body={
                    code:1,
                    message:'数据存在错误，请检查！'
                }
            }
        }catch (e) {
            ctx.body={
                code:5,
                message:e
            }
        }
    }
    async deleteList(){
        try {
            await this.service.List.deleteList();
            ctx.body={
                code:0,
                message:'删除成功！'
            }
        }catch (e) {
            ctx.body={
                code:5,
                message:e
            }
        }
    }
}
module.exports=ListController;