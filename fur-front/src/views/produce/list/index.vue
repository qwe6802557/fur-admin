<template>
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
        label="生产编号"
        align="center"
        width="90">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="生产名称"
        align="center"
        width="250"
      >
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="生产状态"
        align="center"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="goods_info"
        label="所属产品"
        align="center"
        width="250"
      >
      </el-table-column>
      <el-table-column
        prop="goods_material"
        label="所属位次"
        align="center"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="所属商户"
        align="center"
        width="220"
      >
      </el-table-column>
      <el-table-column
        prop="goods_num"
        label="当前管理人员"
        align="center"
        width="140"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" round @click="editProducts(scope.row)">进入下一阶段</el-button>
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
</template>

<script>
    export default {
        name: "List",
        data(){
          return {
            tableData:[],
            loading:false,
            currentPage:1,
            total:0,
          }
        },
        methods:{
          handleSelectionChange(data){
            console.log(data);
          },
          handleSizeChange(data){
            console.log(data);
          },
          handleCurrentChange(data){
            console.log(data);
          },
          editProducts(data){
            console.log(data);
          },
          showDetail(data){
            console.log(data)
          },
          delProducts(data){
            console.log(data);
          },
        },
    }
</script>

<style scoped>

</style>
