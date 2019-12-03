'user strict';
/**订单管理controller层
 * @param ordersManagerController
 */
const Controller=require('egg').Controller;

class OrdersController extends Controller{
    //获取订单信息
    async getOrders(){
        const { ctx }=this;
        let result=await this.service.orders.getOrders();
        Array.isArray(result)?ctx.body={code:0,message:'获取订单数据成功！',data:result}:ctx.body={code:5,message:result}
    }
    //添加订单信息
    async addGoods(){
        const { ctx }=this;
        let result=await this.service.orders.addOrders();
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
}
module.exports=OrdersController;