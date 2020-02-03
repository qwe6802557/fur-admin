<template>
    <div class="product-list">
      <div class="form-content">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="类型">
            <el-select v-model="formInline.select" placeholder="搜索区域">
              <el-option label="产品编号" value="id"></el-option>
              <el-option label="产品名称" value="goods_name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.value" placeholder="搜索内容"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="" icon="el-icon-search" @click="searchProducts">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button class="el-button--danger" icon="el-icon-delete" @click="delMany">批量删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button plain icon="el-icon-plus" @click="addProducts">添加产品</el-button>
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
            label="产品编号"
            align="center"
            width="55">
          </el-table-column>
          <el-table-column
            prop="goods_name"
            label="产品名称"
            align="center"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="goods_info"
            label="产品简介"
            align="center"

          >
          </el-table-column>
          <el-table-column
            prop="goods_material"
            label="产品配件"
            align="center"
            width="300"
          >
          </el-table-column>
          <el-table-column
            prop="goods_price"
            label="产品单价(元)"
            align="center"
            width="120"
          >
            <template slot-scope="scope">
              {{scope.row.goods_price|moneyFormat}}
            </template>
          </el-table-column>
          <el-table-column
            prop="goods_num"
            label="生产总量(个)"
            align="center"
            width="120"
          >
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            show-overflow-tooltip
            width="300"
          >
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" round @click="editProducts(scope.row)">编辑</el-button>
              <el-button type="primary"  size="mini" round @click="showDetail(scope.row)">查看详情</el-button>
              <el-button @click="delProducts(scope.row)" type="danger" icon="el-icon-delete" size="mini" round>删除</el-button>
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
        <ProductDialog :FormVisible="FormVisible" :flag="flag" @visibleChange="visibleChange" @tableChange="tableChange" :singleData="singleData" ref="ProductDialog"></ProductDialog>
      <ProductDetail ref="product-detail" :singleInfo="singleInfo"></ProductDetail>
    </div>
</template>

<script>
  import {moneyFormat} from "@/filters/index.js"
  import ProductDetail from '@/views/product/detail/index'
  import ProductDialog from '@/views/product/list/dialog/index';
  import {Message,MessageBox} from 'element-ui';
  import {reqProduct,reqAddProduct,reqGetProduct,reqEditProduct,reqDelProduct,reqDelMany,reqSearch} from "@/api/index";
    export default {
        name: "list",
        data(){
          return {
            tableData: [],
            flag:0,
            pagination:0, //用于判断分页改变的时候是搜索分页还是获取产品分页
            arrId:[],
            arrObj:[],
            singleData:{},
            singleInfo:{},
            formInline: {
              select: 'id',
              value: '',
            },
            currentPage: 1,
            loading:false,
            FormVisible:false,
            pageSize:10,
            total:0,
          }
        },
      methods:{
        handleEdit(index, row) {
          console.log(index, row);
        },
        handleDelete(index, row) {
          console.log(index, row);
        },
        //复选框每次改变触发函数
        handleSelectionChange(row){
          this.arrObj=row;
          this.arrId=row.map(item=>{
            return item.id
          });
        },
        //每页条数改变触发函数
        handleSizeChange(val) {
          this.pageSize=val;
          if (this.pagination===0){
            this.getProducts();
            return;
          }
          this.searchProducts();
        },
        //当前页数改变触发函数
        handleCurrentChange(val) {
          this.currentPage=val;
          if (this.pagination===0){
            this.getProducts();
            return;
          }
          this.searchProducts();
        },
        //获取产品数据
        getProducts(){
          this.loading=true;
          const {currentPage,pageSize}=this;
          reqProduct({currentPage,pageSize}).then(res=>{
            const {code,message,data}=res.data;
              if (code===0){
                /*              data.forEach(item => {
                                item.visible = false;
                              })*/   //v-model=scope.row.visible
                this.tableData=data.result;
                this.total=data.total;
                this.loading=false;
                return;
              }
              Message.error(message);
              this.loading=false;
          })
        },
        //确定操作后触发$emit的函数
        tableChange(val,resetForm,resetFile,id){
          if (this.flag===0){
            this.reqProduct(reqAddProduct,val,resetForm,resetFile,this.flag);
          }else {
            val.id=id;
            this.reqProduct(reqEditProduct,val,resetForm,resetFile);
          }
        },
        //添加与编辑函数封装
        reqProduct(reqFun,val,resetForm,resetFile,flag){
          reqFun(val).then(res=>{
            const {code,message}=res.data;
            if (code===0){
              Message.success(message);
              if (flag){
                this.getProducts();
              }else {
                if (this.pagination===0){
                  this.getProducts();
                  return;
                }
                this.searchProducts();
              }
            }else {
              Message.error(message);
            }
            resetForm();
            resetFile();
          }).catch(err=>{
            Message.error(err);
          })
        },
        //添加按钮点击函数
        addProducts(){
          this.flag=0;
          this.FormVisible=true;
          this.$nextTick(()=>{
            this.$refs.ProductDialog.resetFields();
          });
        },
        //编辑按钮点击函数
        editProducts(row){
          this.flag=1;
          reqGetProduct({id:row.id}).then(res=>{
            const {code,message,data}=res.data;
              if (code===0){
                this.FormVisible=true;
                this.$nextTick(()=>{
                  this.singleData=data[0];
                });
              }else {
                Message.error(message);
              }
          }).catch(err=>{
            Message.error(err);
          })
        },
        //删除按钮点击函数
        delProducts(row){
          MessageBox.confirm('确定删除商品'+row.goods_name+'吗？','提示',{
            confirmButtonText:'确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            reqDelProduct({id:row.id}).then(res=>{
              const {code,message}=res.data;
                if (code===0){
                  Message.success(message);
                  if (this.pagination===0){
                    this.getProducts();
                    return;
                  }
                  this.searchProducts();
                  return;
                }
                Message.error(message);
            })
          }).catch(err=>{
          })
        },
        //批量删除点击函数
        delMany(){
          const {arrId}=this;
          if (arrId.length === 0 ){
            return Message.warning('请选择需要删除项！');
          }
          MessageBox.confirm('确定批量删除商品'+this.arrObj.map(item=>item.goods_name).join(',')+'吗？','提示',{
            confirmButtonText:'确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            reqDelMany({arrId}).then(res=>{
              const {code,message}=res.data;
                if (code===0){
                  Message.success(message);
                  if (this.pagination===0){
                    this.getProducts();
                    return
                  }
                  this.searchProducts();
                }else {
                  Message.error(message);
                }
            })
          }).catch(err=>{})
        },
        //搜索按钮点击函数
        searchProducts(){
          this.pagination=1;
          const {pageSize,currentPage}=this;
          const {select,value}=this.formInline;
          if (!value){
            this.pagination=0;
          }
          reqSearch({select,value:value.trim(),pageSize,currentPage}).then(res=>{
            const {code,data,message}=res.data;
              if (code===0){
                this.tableData=data.result;
                this.total=data.total;
              }else {
                Message.error(message);
              }
          }).catch(err=>{
            Message.error(err);
          })
        },
        //商品详情页面
        showDetail(row){
          this.$refs['product-detail'].drawer=true;
          this.singleInfo=row;
        },
        //子组件触发$emit函数
        visibleChange(){
          this.FormVisible=false;
        },
        resetFields(){
          let {goods_name,goods_material,goods_price,goods_info}=this.singleData;
          goods_name=goods_material=goods_price=goods_info='';
        }
      },
      components:{
        ProductDialog,
        ProductDetail
      },
      filters:{
        moneyFormat(money){
          return moneyFormat(money);
        }
      },
      mounted() {
        this.getProducts();
      }
    }
</script>

<style scoped>

</style>

