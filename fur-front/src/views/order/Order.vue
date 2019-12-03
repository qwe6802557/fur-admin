<template>
  <div class="product">
    <div class="product-content">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <i class="line"></i>
          <h2>订单列表</h2>
        </div>
        <div class="devider">
          <span class="is-active">订单列表</span>
        </div>
        <div class="form-content">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="审批人">
              <el-input v-model="formInline.user" placeholder="审批人"></el-input>
            </el-form-item>
            <el-form-item label="活动区域">
              <el-select v-model="formInline.region" placeholder="活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="" icon="el-icon-search">搜索</el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="el-button--danger" icon="el-icon-delete">批量删除</el-button>
            </el-form-item>
            <el-form-item>
              <el-button plain icon="el-icon-plus" @click="addOrders">添加订单</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table-content">
          <el-table
            ref="multipleTable"
            :data="tableData"
            width="100%"
            max-height="550"
            stripe
            border
            v-loading="loading"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="45"
              align="center"
              fixed="left">
            </el-table-column>
            <el-table-column
              prop="id"
              label="订单编号"
              align="center"
              width="55">
            </el-table-column>
            <el-table-column
              prop="order_name"
              label="订购产品"
              align="center"
              width="130"
            >
            </el-table-column>
            <el-table-column
              prop="order_num"
              align="center"
              label="订购数量"
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="order_price"
              align="center"
              label="订单总价"
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="order_owner"
              align="center"
              label="订购商家"
              width="200"
            >
            </el-table-column>
            <el-table-column
              prop="owner_address"
              align="center"
              label="商家地址"
              width="200"
            >
            </el-table-column>
            <el-table-column
              prop="order_time"
              align="center"
              label="订购时间"
            >
            </el-table-column>
            <el-table-column
              prop="last_day"
              align="center"
              label="完成时限"

            >
            </el-table-column>
            <el-table-column
              prop="order_status"
              align="center"
              label="订单状态"
              width="100"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="300"
              show-overflow-tooltip>
              <el-row>
                <el-button type="primary" icon="el-icon-edit" size="mini" round @click="editOrders">编辑</el-button>
                <el-button type="primary"  size="mini" round>查看详细</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" round>删除</el-button>
              </el-row>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="100">
            </el-pagination>
          </div>
        </div>
      </el-card>
      <OrderDialog :FormVisible="FormVisible" :flag="flag" @visibleChange="visibleChange"></OrderDialog>
    </div>
  </div>
</template>

<script>
  import {reqProduct} from "../../api";
  import {Message} from 'element-ui';
  import OrderDialog from './Order-dialog'
  export default {
    name: "Order",
    data() {
      return {
        showList:true,
        tableData: [],
        flag:0,
        formInline: {
          user: '',
          region: ''
        },
        currentPage: 1,
        loading:false,
        FormVisible:false
      }
    },
    methods: {
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      getOrders(){
        this.loading=true;
        reqOrders().then(res=>{
          const {code,message,data}=res.data;
          if (code===0){
            this.tableData=data;
            this.loading=false;
            return;
          }
          Message.error(message);
          this.loading=false;
        })
      },
      addOrders(){
        this.flag=0;
        this.FormVisible=true;
      },
      editOrders(){
        this.flag=1;
        this.FormVisible=true;

      },
      visibleChange(){
        this.FormVisible=false;
      }
    },
    components:{
      OrderDialog
    },
    mounted() {
      this.getOrders();
    }
  }
</script>

<style scoped>
</style>
<style lang="less">
  .product{
    height: 100%;
    .product-content{
      height: 100%;
      line-height: 27px;
      .line{
        width: 10px;
        height: 27px;
        background: #018EED;
        display: inline-block;
        float: left;
        margin: 0 26px;
      }
      h2{
        float: left;
        font-size: 20px;
        color: black;
        font-weight: bold;
      }
    }
    .text {
      font-size: 14px;
    }

    .item {
      margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }
    .clearfix:after {
      clear: both
    }

    .box-card {
      width: 100%;
      height: 100%;
    }
    .el-card__body{
      padding: 10px 45px;
      height: 100%;
    }
    .table-content{
      .pagination{
        margin-top: 20px;
      }
    }
    .devider{
      margin: 0 0 20px 0;
      span{
        font-size: 14px;
      }
      .is-active{
        color:#409EFF;
      }
    }

  }
</style>
