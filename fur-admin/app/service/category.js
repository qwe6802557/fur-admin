'use strict'

const {Service}=require('egg');

class CategoryService extends Service{
    async getCategory(){
        let {id,pageSize,currentPage}=this.ctx.query;
            let result;
            if (!id){
                const offset=(currentPage-1)*pageSize;
                const limit=parseInt(pageSize);
                console.log(offset,limit)
                const total=await this.ctx.model.Category.count();
                result=await this.ctx.model.Category.findAll({
                    offset,
                    limit,
                    distinct:true
                });
                return {result,total}
            }
                result=await this.ctx.model.Category.findAll({
                    where:{
                        id
                    }
                })
                return result;
    }
    async addCategory(){
        let {category_name}=this.ctx.request.body;
        category_name=category_name.trim();
        console.log(category_name);
        if (category_name){
                const result=await this.ctx.model.Category.findAll({
                    where:{
                        category_name
                    }
                })
                if (result.length!=0){
                    return 1;
                }
                await this.ctx.model.Category.create({category_name});
                return 0;
        }else{
            return false;
        }
    }
    async updateCategory(){
        let {id,category_name}=this.ctx.request.body;
        category_name=category_name.trim();
        if (Number(id) && category_name){
                const result=await this.ctx.model.Category.update({category_name},{
                                where: {
                                    id
                                }
                            })
                return result;
        }else{
            return false;
        }
    }
    async deleteCategory(){
        const {id}=this.ctx.request.body;
        if (Number(id)){
                const result=await this.ctx.model.Category.destroy({
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
module.exports=CategoryService;