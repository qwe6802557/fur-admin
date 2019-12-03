'user strict';
/**产品管理service层
 * @param goodsManagerService
 */
const Service=require('egg').Service;
const moment=require('moment')
class GoodsService extends Service{
    //获取产品信息service操作
    async getGoods(){
        const {id,pageSize,currentPage}=this.ctx.query;
        if (id){
            try {
                let result=await this.app.model.Goods.findAll({
                    where:{
                        id
                    }
                })
                return result;
            }catch (e) {
                return e;
            }
        }else {
            try {
                const offset=(currentPage-1)*pageSize;
                const limit=parseInt(pageSize);
                let total=await this.app.model.Goods.count();
                let result=await this.app.model.Goods.findAll({
                    offset,
                    limit,
                    distinct:true //这一句可以去重，它返回的 count 不会把你的 include 的数量算进去
                });
                return {result,total};
            }catch (e) {
                return e;
            }
        }
    }
    //添加产品信息service操作
    async addGoods(){
        const goods_add=this.ctx.request.body;
        const { goods_name,goods_material,goods_info,goods_price,goods_image}=goods_add;
        try {
            if (goods_name.trim() && goods_material.trim() && goods_info.trim() && goods_image.trim() && goods_price.trim())
            {
                /*goods_add.create_time=moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');*/
                let result=await this.app.model.Goods.create(goods_add);
                return true;
            }else {
                return false;
            }
        }catch (e) {
            return e;
        }
    }
    //编辑产品service操作
    async editGoods(){
        const goods_edit=this.ctx.request.body;
        const {id,goods_name,goods_material,goods_info,goods_price,goods_image}=goods_edit;
            if (Number(id) && goods_name.trim() && goods_material.trim() && goods_info.trim() && goods_image.trim() && goods_price && Number(goods_price)){
                try {
                    /*goods_add.create_time=moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');*/
                    await this.app.model.Goods.update(goods_edit,{
                        where: {
                            id:id
                        }
                    });
                    return true;
                }catch (e) {
                    return e;
                }
            }else {
                return false;
            }
    }
    //删除产品service操作
    async deleteGoods(){
        const {id,arrId}=this.ctx.request.body;
        try {
        if (id){
            let result=await this.app.model.Goods.destroy({
                where:{
                    id
                }
            })
            if (result){
                return true;
            }else {
                return false;
            }
        }else {
           let result=await this.app.model.Goods.destroy({
               where:{
                   id:arrId
               }
           })
            if (result){
                return true;
            }else {
                return false;
            }
        }
        }catch (e) {
            return e;
        }
    }
    async searchGoods(){
        let {select,value,pageSize,currentPage}=this.ctx.request.body;
        pageSize=parseInt(pageSize);
        currentPage=(currentPage-1)*pageSize;
            let result=[];
            let total=0;
           if (select=='id'){
                total=await this.app.model.Goods.count({
                    where:{
                        id:{
                            [this.app.Sequelize.Op.like]:`%${value}%`
                        }
                    },
                    offset: currentPage,
                    limit: pageSize
                });
                result=await this.app.model.query(`SELECT * FROM GOODS WHERE CONCAT(id) LIKE '%${value}%' LIMIT ${pageSize} OFFSET ${currentPage}`,{type:'SELECT'});
           }else {
               total=await this.app.model.Goods.count({
                   where:{
                       goods_name:{
                           [this.app.Sequelize.Op.like]:`%${value}%`
                       }
                   },
                   offset: currentPage,
                   limit: pageSize
               });
                result=await this.app.model.query(`SELECT * FROM GOODS WHERE CONCAT(GOODS_NAME) LIKE '%${value}%' LIMIT ${pageSize} OFFSET ${currentPage}`,{type:'SELECT'});
           }
           return {result,total};
       }
}
module.exports=GoodsService;