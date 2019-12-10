'use strict'

const {Service}=require('egg');

class CategoryService extends Service{

    async getCategory(){
        const {pageSize,currentPage}=this.ctx.query;
        const {id}=this.ctx.params;
            let result;
            if (!id){
                const offset=(currentPage-1)*pageSize;
                const limit=parseInt(pageSize);
                const total=await this.ctx.model.Category.count();
                result=await this.ctx.model.Category.findAll({
                    offset,
                    limit,
                    distinct:true
                });
                return {result,total}
            }
                result=await this.ctx.model.Category.findOne({
                    where:{
                        id
                    }
                })
                return result;
    }

    async addCategory(){
        let {category_name,category_info}=this.ctx.request.body;
        category_name=category_name.trim();
        category_info=category_info.trim();
        if (category_name && category_info){
                const result=await this.ctx.model.Category.findAll({
                    where:{
                        category_name
                    }
                })
                if (result.length!=0){
                    return 1;
                }
                await this.ctx.model.Category.create({category_name,category_info});
                return 0;
        }else{
            return false;
        }
    }

    async updateCategory(){
        let {id,category_name,category_info}=this.ctx.request.body;
        category_name=category_name.trim();

        if (Number(id) && category_name){
                const result=await this.ctx.model.Category.update({category_name,category_info},{
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

    async searchCategory(){
        const {pageSize,currentPage,select,values}=this.ctx.query;
        const offset=(currentPage-1)*pageSize;
        const limit=parseInt(pageSize);
        let result;
        if (select=='id'){
            result=await this.ctx.model.Category.findAndCountAll({
                where:{
                    id:{
                        [this.app.Sequelize.Op.like]:`%${values}%`
                    }
                },
                offset,
                limit,
                raw:true
            })
        }else{
            result=await this.ctx.model.Category.findAndCountAll({
                where:{
                    category_name:{
                        [this.app.Sequelize.Op.like]:`%${values}%`
                    }
                },
                offset,
                limit,
                raw:true
            })
        }
        return result;
    }
}
module.exports=CategoryService;