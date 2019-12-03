'use strict'

const {Service}=require('egg');

class ListService extends Service{
    async getList(){
        const {id}=this.ctx.query;
        let result;
        if (!id){
            result=await this.ctx.model.List.findAll();
        }else {
            result=await this.ctx.model.List.findAll({
                where:{
                    id
                }
            })
        }
        return result;
    }
    async addList(){
        const {List_name}=this.ctx.request.body;
        if (List_name.trim()){
            const result=await this.ctx.model.List.create({List_name});
            return result;
        }else{
            return false;
        }
    }
    async updateList(){
        const {id,List_name}=this.ctx.request.body;
        if (Number(id) && List_name.trim()){
            const result=await this.ctx.model.List.update({List_name},{
                where: {
                    id
                }
            })
            return result;
        }else{
            return false;
        }
    }
    async deleteList(){
        const {id}=this.ctx.request.body;
        if (Number(id)){
            const result=await this.ctx.model.List.destroy({
                where:{
                    id
                }
            })
            return result;
        }else {
            return false
        }
    }
}
module.exports=ListService;