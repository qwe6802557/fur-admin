<template>
    <div class="product-material">
      <div class="form-content">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="类型">
            <el-select v-model="formInline.select" placeholder="搜索区域">
              <el-option label="分类编号" value="id"></el-option>
              <el-option label="分类名称" value="category_name"></el-option>
            </el-select>
           </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.values" placeholder="搜索内容"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="" icon="el-icon-search" @click="searchCategory">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button class="el-button--danger" icon="el-icon-delete" @click="deleteMany">批量删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button plain icon="el-icon-plus" @click="addList">添加列表</el-button>
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
          @selection-change="handleSelectionChange">
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
              <el-button type="primary" icon="el-icon-edit" size="mini" round @click="editCategory(scope.row)">编辑</el-button>
              <el-button type="primary"  size="mini" round @click="">查看子列表</el-button>
              <el-button @click="" type="danger" icon="el-icon-delete" size="mini" round @click="deleteCategory(scope.row)">删除</el-button>
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
      <MaterialDialog ref="MaterialDialog" @tableChange="tableChange"></MaterialDialog>
    </div>
</template>

<script>
  import {reqCategory, reqAddCategory, reqSearchCategory, reqGetCategory, reqEditCategory,reqDeleteCategory} from "../../../api";
  import {Message,MessageBox} from 'element-ui'
  import MaterialDialog from '@/views/product/material/dialog/index'
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
            pageSize:10,
            total:0,
            arrId:[],
            arrObj:[]
          }
        },
      methods:{
        sendTest(){

        },
        //添加配件列表
        addList(){
          this.$refs.MaterialDialog.title="添加列表"
          this.$refs.MaterialDialog.FormVisible=true;
          this.$nextTick(()=>{
            this.$refs.MaterialDialog.resetFields();
          })
        },
        //获取配件列表
        getCategory(){
          this.loading=true;
          const {pageSize,currentPage}=this;
          reqCategory({pageSize,currentPage}).then(res=>{
            const {code,data,message}=res.data;
              if (code===0){
                this.tableData=data.result;
                this.total=data.total;
                this.loading=false;
              }else{
                Message.error(message);
              }
          }).catch(e=>{
            Message.error(e);
          })
        },
        //获取编辑信息
        editCategory(row){
          this.$refs.MaterialDialog.title="编辑列表"
          this.$refs.MaterialDialog.FormVisible=true;
          reqGetCategory(row.id).then(res=>{
            const {code,message,data}=res.data;
            if (code===0){
              this.$nextTick(()=>{
                this.$refs.MaterialDialog.categoryForm=data;
              })
            }else{
              Message.error(message);
            }
          }).catch(err=>{
            Message.error(err);
          })
        },
        //多选改变函数
        handleSelectionChange(row){
          this.arrObj=row;
          console.log(row);
          this.arrId=row.map(item=>item.id);
        },
        //删除列表信息
        deleteCategory(row){
          this.deleteFun('确定删除列表'+row.category_name+'吗？','删除提示',row.id)
        },
        //批量删除列表信息
        deleteMany(){
          this.deleteFun('确定删除列表'+this.arrObj.map(item=>item.category_name).join(',')+'吗？','批量删除提示',this.arrId);
        },
        //删除函数封装
        deleteFun(...arr){
          MessageBox.confirm(arr[0],arr[1],{
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            type:"warning"
          }).then(()=>{
            reqDeleteCategory(arr[2]).then(res=>{
              const {code,message}=res.data;
              if (code===0){
                Message.success(message);
                this.pagination==0?this.getCategory():this.searchCategory();
              }else {
                Message.error(message);
              }
            }).catch(err=>{
              Message.error(err);
            })
          }).catch(()=>{});
        },
        //每页条数改变触发函数
        handleSizeChange(val) {
          this.pageSize=val;
          if (this.pagination===0){
            this.getCategory();
            return;
          }
          this.searchCategory();
        },
        //当前页数改变触发函数
        handleCurrentChange(val) {
          this.currentPage=val;
          if (this.pagination===0){
            this.getCategory();
            return;
          }
          this.searchCategory();
        },
        //搜索配件一级列表
        searchCategory(){
          this.loading=true;
          this.pagination=1;
          const {select,values}=this.formInline;
          const {currentPage,pageSize}=this;
          if (!values.trim()){
            this.pagination=0;
          }
          /*this.$socket.emit('chat','我是你爸爸！');*/
          reqSearchCategory({select,values,currentPage,pageSize}).then(res=>{
            const {code,message,data}=res.data;
            if (code===0){
              this.tableData=data.rows;
              this.total=data.count;
              this.loading=false;
            }else {
              Message.error(message);
            }
          }).catch(err=>{
            Message.error(err);
          })
        },
        tableChange(Form){
          const {showFlag,title}=this.$refs.MaterialDialog;
          if (!showFlag && title==='添加列表'){
            reqAddCategory(Form).then(res=>{
              const {code,message}=res.data;
              if (code===0){
                Message.success(message);
                this.$refs.MaterialDialog.FormVisible=false;
                this.getCategory();
              }else{
                Message.error(message)
              }
            }).catch(e=>{
              Message.error(e);
            })
          }else if(!showFlag && title==='编辑列表'){
            reqEditCategory(Form).then(res=>{
              const {code,message}=res.data;
              if (code===0){
                Message.success(message);
                this.$refs.MaterialDialog.FormVisible=false;
                this.getCategory();
                this.$refs.MaterialDialog.resetFields();
              }else{
                Message.error(message)
              }
            }).catch(e=>{
              Message.error(e);
            })
          }
        }
      },
      components:{
        MaterialDialog
      },
      mounted() {
          this.getCategory();
      }
    }
</script>

<style scoped>

</style>
