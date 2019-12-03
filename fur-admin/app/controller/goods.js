'user strict';
/**产品管理controller层
 * @param ordersManagerController
 */
const Controller=require('egg').Controller;

class GoodsController extends Controller{
    //获取产品信息
    async getGoods(){
        const { ctx }=this;
        let result=await this.service.goods.getGoods();
        ctx.body={
            code:0,
            message:'获取产品数据成功！',
            data:result
        }
    }
    //添加产品信息
    async addGoods(){
        const { ctx }=this;
        let result=await this.service.goods.addGoods();
        if (result===true){
          ctx.body={
              code:0,
              message:'增加产品成功！'
          }
        }else if (result===false) {
           ctx.body={
               code:1,
               message: "数据存在错误，请检查！"
           }
        }else {
            ctx.body={
                code:5,
                message:result
            }
        }
    }
    //编辑页面商品数据
    async editGoods(){
        const {ctx}=this;
     let result=await this.service.goods.editGoods();
     if (result===true){
         ctx.body={
             code:0,
             message:'修改商品数据成功！'
         }
     }else if (result===false){
         ctx.body={
             code:1,
             message:'数据存在错误，请检查！'
         }
     }else{
         ctx.body={
             code:5,
             message:result
         }
     }
    }
    //删除商品操作
    async deleteGoods(){
        const { ctx }=this;
        let result=await this.service.goods.deleteGoods();
        if (result===true){
            ctx.body={
                code:0,
                message:'删除成功！'
            }
        }else if (result===false){
            ctx.body={
                code:1,
                message:'删除失败！'
            }
        } else {
            ctx.body={
                code:5,
                message:result
            }
        }
    }
    async searchGoods(){
        const {ctx}=this;
        try {
            let result=await this.service.goods.searchGoods();
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
}
module.exports=GoodsController;