<template>
    <div class="product-detail">
      <el-drawer
        title="产品详情"
        :visible.sync="drawer"
        :direction="direction"
        :before-close="handleClose" v-change>
        <div class="detail-content">
          <div class="detail-image">
            <img v-lazy="singleInfo.goods_image" alt="商品">
          </div>
          <div class="message-content padding">
            <div class="detail-title">
              <div class="detail-title-content">
                <span class="title">{{singleInfo.goods_name}}</span>
                <span class="price">39人收藏</span>
              </div>
              <div class="detail-collection">
                <el-button type="primary" v-if="collection" round icon="el-icon-star-off" @click="collection=!collection">添加收藏</el-button>
                <el-button  type="info" v-else icon="el-icon-star-on" @click="collection=!collection" round>取消收藏</el-button>
              </div>
            </div>
            <el-divider><i class="el-icon-shopping-bag-1"></i></el-divider>
            <div class="detail-price">
                <img src="../../../../static/images/sale.png" alt="">
                <span>¥{{singleInfo.goods_price| moneyFormat}}元</span>
            </div>
            <el-divider><span class="info">简介</span></el-divider>
            <div class="product-info">
              <p>
                {{singleInfo.goods_info}}
              </p>
            </div>
          </div>
        </div>
      </el-drawer>
    </div>
</template>

<script>
    import {moneyFormat} from "../../../filters";
    export default {
        name: "ProductDetail",
        props:['singleInfo'],
        data(){
          return {
            drawer: false,
            direction: 'rtl',
            collection:true
          }
        },
        methods: {
          handleClose(done) {
            done();
          }
      },
      directives:{
          change:{
            inserted(el){
              let i=el.querySelector('.el-drawer__close-btn i');
              i.classList.remove('el-icon-close');
              i.classList.add('el-icon-back');
            }
          }
      },
      filters:{
          moneyFormat(money){
            return moneyFormat(money);
          }
      }
    }
</script>

<style scoped>

</style>
<style lang="less">
  #el-drawer__title{
    .el-drawer__close-btn{
      position: absolute;
    }
    span{
      text-align: center;
    }
  }
  .detail-content{
    .el-divider{
      margin: 15px 0;
    }
    .product-info{
      padding: 20px 0;
      font-size: 15px;
      p{
        text-indent: 30px;
      }
    }
    .info{
      font-size:18px;
    }
    .detail-price{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        img{
          width: 200px;
        }
       span{
         font-size: 35px;
         color: #F88814;
         margin-right: 30px;
         text-shadow: 2px 2px 2px #b3b3b3;
      }
    }
    .detail-title-content{
      display: flex;
      flex-direction: column;
      flex: 1;
      text-align: center;
    }
    .detail-collection{
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      .el-button{
        margin: 0 auto;
        width: 150px;
      }
    }
    .padding{
      padding: 20px;
    }
    .detail-image{
      width: 100%;
      height: 300px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .detail-title{
      display: flex;
      flex-direction: row;
      .title{
        font-size: 25px;
      }
      .price{
        color: #F3B226;
        margin-top: 10px;
        font-size: 16px;
      }
    }
    .detail-collection{
      float: right;
    }
  }
</style>

