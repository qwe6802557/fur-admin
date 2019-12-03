<template>
    <div class="product-material">
      <div class="form-content">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="类型">
            <el-select v-model="formInline.select" placeholder="搜索区域">
              <el-option label="分类编号" value="id"></el-option>
              <el-option label="分类名称" value="material_name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.value" placeholder="搜索内容"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="" icon="el-icon-search" @click="searchCategory">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button class="el-button--danger" icon="el-icon-delete" @click="">批量删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button plain icon="el-icon-plus" @click="">添加列表</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-content">
        <el-table
          ref="multipleTable"
          :data="tableData"
          width="100%"
          max-height="605"
          stripe
          border
          v-loading="loading"
          @selection-change="">
          <el-table-column
            type="selection"
            width="45"
            align="center"
            fixed="left">
          </el-table-column>
          <el-table-column
            prop="id"
            label="列表编号"
            align="center"
            width="55">
          </el-table-column>
          <el-table-column
            prop="category_name"
            label="列表名称"
            align="center"
            width="300"
          >
          </el-table-column>
          <el-table-column
            prop="category_info"
            label="列表说明"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="category_num"
            label="子列表数量(个)"
            align="center"
            width="200"
          >
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            show-overflow-tooltip
            width="400"
          >
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" round @click="">编辑</el-button>
              <el-button type="primary"  size="mini" round @click="">查看子列表</el-button>
              <el-button @click="" type="danger" icon="el-icon-delete" size="mini" round>删除</el-button>
            </template>
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
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
</template>

<script>
  import {valiateToken} from "@/untils/valiateUntil";
  import {reqCategory} from "../../../api";
  import {Message} from 'element-ui'
  export default {
        name: "material",
        data(){
          return {
            tableData:[],
            formInline:{
              select:'id',
              values:''
            },
            pagination:0, //用于判断分页改变的时候是搜索分页还是获取商品分页
            currentPage: 1,
            loading:false,
            FormVisible:false,
            pageSize:10,
            total:0,
          }
        },
      methods:{
        sendTest(){

        },
        getCategory(){
          this.pagination=0;
          const {pageSize,currentPage}=this;
          reqCategory({pageSize,currentPage}).then(res=>{
            const {code,data,message}=res.data;
            const result=valiateToken(code,message,this.$router);
            if (result){
              if (code===0){
                this.tableData=data.result;
                this.total=data.total;
              }else{
                Message.error(message);
              }
            }
          })
        },
        editMaterials(){

        },
        //每页条数改变触发函数
        handleSizeChange(val) {

        },
        //当前页数改变触发函数
        handleCurrentChange(val) {

        },
        searchCategory(){
          this.pagination=1;
          this.$socket.emit('chat','我是你爸爸！');
        }
      },
      mounted() {
          this.getCategory();
          this.sockets.subscribe('customEmit', (data) => {
          console.log(data);
        });
      }
    }
</script>

<style scoped>

</style>
