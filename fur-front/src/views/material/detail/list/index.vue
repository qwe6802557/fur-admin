<template>
    <div class="material-detail">
      <div class="form-content">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" label-position="left">
          <el-row :gutter="18">
            <el-col :span="4.5">
              <el-form-item label="类型">
                <el-select v-model="formInline.select" placeholder="搜索条件" style="width: 150px;">
                  <el-option label="配件编号" value="id"></el-option>
                  <el-option label="其他条件" value="other_conditions"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item v-if="formInline.select !== 'other_conditions'">
                <el-input v-model="formInline.values" placeholder="请输入编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item v-if="formInline.select === 'other_conditions'" label="配件名称">
                <el-input v-model="formInline.detail_name" placeholder="请输入配件名称" style="width: 180px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item v-if="formInline.select === 'other_conditions'" label="配件状态">
                <el-select v-model="formInline.detail_status" placeholder="请选择配件状态" style="width: 180px;">
                  <el-option label="可用" value="1"></el-option>
                  <el-option label="不可用" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item v-if="formInline.select === 'other_conditions'" label="配件用途">
                <el-select v-model="formInline.detail_use" placeholder="请选择配件用途" style="width: 180px;">
                  <el-option v-for="item in detailUseArr" :label="item.use_name" :value="item.id" :key="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item v-if="formInline.select === 'other_conditions'" label="入库时间">
                <!--<el-input v-model="formInline.detail_time" placeholder="请选择入库时间"></el-input>-->
                <el-date-picker
                  v-model="detail_time"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="searchDetail" :loading="loading">{{formInline.select !== 'other_conditions'?'搜索':''}}</el-button>
            </el-form-item>
            <el-form-item v-if="formInline.select !== 'other_conditions'">
              <el-button class="el-button--danger" icon="el-icon-delete" @click="deleteDetailMany">批量删除</el-button>
            </el-form-item>
            <el-form-item v-if="formInline.select !== 'other_conditions'">
              <el-button plain icon="el-icon-plus" @click="addDetail">新配件入库</el-button>
            </el-form-item>
          </el-row>
          <el-form-item v-if="formInline.select === 'other_conditions'">
            <el-button class="el-button--danger" icon="el-icon-delete" @click="deleteDetailMany">批量删除</el-button>
          </el-form-item>
          <el-form-item v-if="formInline.select === 'other_conditions'">
            <el-button plain icon="el-icon-plus" @click="addDetail">新配件入库</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-content">
        <el-table
          ref="multipleTable"
          :data="tableData"
          width="100%"
          max-height="583"
          stripe
          border
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="45"
            align="center"
            fixed="left">
          </el-table-column>
          <el-table-column
            prop="id"
            label="配件编号"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="detail_name"
            label="配件名称"
            align="center"
            width="300"
          >
          </el-table-column>
          <el-table-column
            prop="detail_status"
            label="配件状态"
            align="center"
            width="150"
          >
            <template slot-scope="scope">
              <span :style="scope.row.detail_status === '0'? {color:'red'} : {color:'green'}">{{scope.row.detail_status === '0' ? '不可用' : '可用' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="detail_use"
            label="配件用途"
            align="center"
          >
            <template slot-scope="scope">
              {{scope.row['material_use.use_name']}}  <!--elementUI的对象显示方法-->
            </template>
          </el-table-column>
          <el-table-column
            prop="detail_price"
            label="配件价格(元)"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{scope.row.detail_price | moneyFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="detail_num"
            label="配件库存(个)"
            align="center"
            width="150"
          >
          </el-table-column>
          <el-table-column
            prop="detail_time"
            label="入库时间"
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
              <el-button type="primary" icon="el-icon-edit" size="mini" round @click="editDetail(scope.row)">编辑</el-button>
              <el-button type="primary"  size="mini" round @click="showFlag = !showFlag">查看详情</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" round @click="deleteDetail(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.currentPage"
            :page-sizes="[10, 20, 30]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
          </el-pagination>
        </div>
      </div>
      <DetailDialog :formVisible="formVisible" @visibleChange="visibleChange" @dialogAdd="dialogAdd" ref="DetailDialog" :loading="loading_confirm" :rowData="rowData" :detailUseArr="detailUseArr" :category_id="category_id"/>
    </div>
</template>
<script>
  import DetailDialog from '@/views/material/detail/dialog';
  import { reqCategoryDetailAdd, reqCategoryDetailEditGet,
    reqCategoryDetailEditPost, reqCategoryDetailQuery,
    reqCategoryDetailDelete, reqCategoryDetailDeleteMany,
    reqCategoryDetailUse, } from "@/api";
  import { Message, MessageBox } from 'element-ui';
  import {moneyFormat} from "@/filters/index.js"
  import Moment from 'moment';
  export default {
        name: "List",
        props:['category_id'],
        data(){
          return {
            formVisible:false,
            currentPage:1,
            tableData:[],
            loading:false,
            loading_confirm:false,
            rowData:{},
            formData:{}, //记录每次搜索的表单数据
            checkedArr:[],
            detailUseArr:[],
            detail_time: null,
            formInline:{
              select:'id',
              values:'',
              detail_name:'',
              detail_use:'',
              detail_status:'',
              detail_start_time:'',
              detail_end_time:'',
            },
            pagination:{
              currentPage:1,
              pageSize:10,
              total:0,
            },
            pickerOptions: {
              shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近一个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近三个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                  picker.$emit('pick', [start, end]);
                }
              }]
            },
          }
        },
      methods:{
        searchDetail(){
          this.loading = true;
          this.getCategoryDetail(this.formInline);
        },
        addDetail(){
          this.formVisible = true;
          this.$nextTick(() => {
            this.$refs.DetailDialog.resetFields();
          });
        },
        //点击取消的回调
        visibleChange(){
          this.formVisible = false;
        },
        //分页搜索
        getCategoryDetail(data = {},showMessage){
          let { currentPage, pageSize } = this.pagination;
          data.category_id = this.category_id;
          reqCategoryDetailQuery({
            currentPage,
            pageSize,
            data:data,
          }).then(res => {
            const { code, message, data,  } = res.data;
            if (code === 0 ){
              !!data && !!showMessage && Message.success(message);
              this.tableData = data.rows;
              this.pagination.total = data.count;
            }else {
              Message.warning(message);
            }
            this.loading = false;
          });
        },
        //弹框点击确定
        dialogAdd(formData, confirmFlag){
          this.loading = true;
          if (!confirmFlag){
            reqCategoryDetailAdd(formData).then(res => {
              const { code, message } = res.data;
              if (code === 0){
                Message.success(message);
                this.loading = false;
                this.formVisible = false;
                this.getCategoryDetail(this.formInline);
              } else {
                Message.warning(message);
              }
            }).catch(err => {
              Message.error(err);
              this.loading = false;
            })
          }else {
            reqCategoryDetailEditPost(formData).then(res => {
              const { code, message } = res.data;
              if ( code === 0){
                Message.success(message);
                this.loading = false;
                this.formVisible = false;
                this.getCategoryDetail(this.formInline);
              }else {
                this.loading = false;
                message.error(message);
              }
            }).catch(err => {
              Message.error(err);
              this.loading = false;
            });
          }
        },
        //批量删除
        deleteDetailMany(){
          MessageBox.confirm('确定删除配件'+ this.checkedArr.map((item) => item.detail_name ).join(',') +'吗？','批量删除提示',{
            confirmButtonText:'确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(res =>{
            reqCategoryDetailDeleteMany({
              idArr:this.checkedArr.map((item) => item.id),
            }).then(res => {
              const { code, message } = res.data;
              code === 0 && Message.success(message) && this.getCategoryDetail(this.formData) || Message.warning(message);
            });
          }).catch(err => {});
        },
        handleSizeChange(pageSize){
          this.pagination.pageSize = pageSize;
          this.getCategoryDetail();
        },
        handleCurrentChange(currentPage){
          this.pagination.currentPage = currentPage;
          this.getCategoryDetail();
        },
        handleSelectionChange(checkedArr){
          this.checkedArr = checkedArr;
        },
        editDetail(rowData){
          reqCategoryDetailEditGet(this.category_id, rowData.id).then(res => {
            const { code, message, data } = res.data;
            if (code === 0){
              this.formVisible = true;
              this.$nextTick(() => {
                this.rowData = data;
              });
            } else {
              Message.error(message);
            }
          }).catch(err => {
            Message.error(err);
          })
        },
        deleteDetail(rowData){
          MessageBox.confirm('确定删除配件'+ rowData.detail_name +'吗？','删除提示',{
            confirmButtonText:'确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(res => {
            reqCategoryDetailDelete(rowData.id).then(res => {
              const { code, message, } = res.data;
              code === 0 && Message.success(message) && this.getCategoryDetail(this.formData) || Message.warning(message);
            });
          }).catch(err => {});
        },
      },
      filters:{
        moneyFormat(money){
          return moneyFormat(money);
        }
      },
      components:{
          DetailDialog,
      },
      mounted() {
         reqCategoryDetailUse().then(res => {
           const { code, message, data } = res.data;
           code === 0 ? this.detailUseArr = data : Message.error(message);
         }).catch(err => {
           Message.error(err);
         });
         this.getCategoryDetail();
      },
      watch:{
          detail_time(val){
            if (val){
              this.formInline.detail_start_time = Moment(val[0]).format('YYYY-MM-DD HH:mm:ss');
              this.formInline.detail_end_time = Moment(val[1]).format('YYYY-MM-DD HH:mm:ss');
            }else if (!val && this.formInline.detail_start_time && this.formInline.detail_end_time){
              this.formInline.detail_start_time = '';
              this.formInline.detail_end_time = '';
            }
          }
        },
    }
</script>

<style scoped lang="less">
  /deep/ .pagination{
    margin:20px 0px;
  }
</style>
