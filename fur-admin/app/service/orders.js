'user strict';
/**订单管理service层
 * @param goodsManagerService
 */
const Service=require('egg').Service;
const moment=require('moment')
class GoodsService extends Service{
    //获取订单信息service操作
    async getOrders(){
        try {
            let result=await this.app.model.Orders.findAll({
                raw:true
            });
            return result;
        }catch (e) {
            return e;
        }
    }
    //添加订单信息service操作
    async addOrders(){
        const orders_add=this.ctx.request.body;
        const { orders_name,orders_price,order_status,order_owner,owner_address,last_day,order_num,orders_material}=orders_add;
        try {
            if (orders_name && orders_price && order_status
                && order_owner && owner_address && last_day
                && order_num && orders_material)
            {
                orders_add.order_time=moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                await this.app.mysql.insert('goods',orders_add);
                return true;
            }else {
                return false;
            }
        }catch (e) {
            return e;
        }
    }
}
module.exports=GoodsService;