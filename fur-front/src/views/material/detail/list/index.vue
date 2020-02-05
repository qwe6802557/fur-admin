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
                  <el-option label="可用" value="1"></el-option>
                  <el-option label="不可用" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item v-if="formInline.select === 'other_conditions'" label="入库时间">
                <!--<el-input v-model="formInline.detail_time" placeholder="请选择入库时间"></el-input>-->
                <el-date-picker
                  v-model="formInline.detail_time"
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
              <el-button type="primary" @click="" icon="el-icon-search" @click="searchDetail">{{formInline.select !== 'other_conditions'?'搜索':''}}</el-button>
            </el-form-item>
            <el-form-item v-if="formInline.select !== 'other_conditions'">
              <el-button class="el-button--danger" icon="el-icon-delete" @click="deleteMany">批量删除</el-button>
            </el-form-item>
            <el-form-item v-if="formInline.select !== 'other_conditions'">
              <el-button plain icon="el-icon-plus" @click="addDetail">新配件入库</el-button>
            </el-form-item>
          </el-row>
          <el-form-item v-if="formInline.select === 'other_conditions'">
            <el-button class="el-button--danger" icon="el-icon-delete" @click="deleteMany">批量删除</el-button>
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
            label="配件编号"
            align="center"
            width="200">
          </el-table-column>
          <el-table-column
            prop="category_name"
            label="配件名称"
            align="center"
            width="300"
          >
          </el-table-column>
          <el-table-column
            prop="category_info"
            label="配件状态"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="category_num"
            label="配件库存(个)"
            align="center"
            width="200"
          >
          </el-table-column>
          <el-table-column
            prop="category_children_num"
            label="配件用途"
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
              <el-button type="primary"  size="mini" round @click="showFlag = !showFlag">查看子列表</el-button>
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
      <DetailDialog :formVisible="formVisible" @visibleChange="visibleChange"/>
    </div>
</template>
<script>
  import DetailDialog from '@/views/material/detail/dialog'
    export default {
        name: "List",
        data(){
          return {
            formVisible:false,
            currentPage:1,
            total:0,
            tableData:[],
            loading:false,
            formInline:{
              select:'id',
              values:'',
              detail_name:'',
              detail_use:'',
              detail_status:'',
              detail_time:'',
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

        },
        addDetail(){
          this.formVisible = true;
        },
        //点击取消的回调
        visibleChange(){
          this.formVisible = false;
        },
        deleteMany(){

        },
        handleSizeChange(){

        },
        handleCurrentChange(){

        },
        handleSelectionChange(){

        },
        editCategory(){

        },
        deleteCategory(){

        },
      },
      components:{
          DetailDialog,
      }
    }
</script>

<style scoped lang="less">
</style>
