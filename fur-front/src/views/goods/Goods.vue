<template>
  <div id="tag">
    <Title :title="title"/>
    <div class="button-area">
      <a-button type="primary" icon="search" @click="showTable">筛选查询</a-button>
      <a-button type="danger" icon="delete" @click="deleteMany">批量删除</a-button>
      <a-button icon="plus" @click="addTagGroup">产品入库</a-button>
      <a-button type="primary" icon="pushpin" @click="changeHeader">筛选显示</a-button>
    </div>
    <a-spin :spinning="initLoading" tip="获取配件数据中...">
      <a-table class="tag-table"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :rowSelection="rowSelection"
               :rowKey="'id'"
               @change="handleTableChange">
                <span slot="tableId" slot-scope="tableId">
                    {{!!selectValue.filter( item => item.id === tableId )[0] && selectValue.filter( item => item.id === tableId )[0].tableChineseName || '-'}}
                </span>
                <span slot="goods_price" slot-scope="goods_price">
                    {{ goods_price | moneyFormat}}
                </span>
                <span slot="goods_single" slot-scope="goods_single">
                    {{ goods_single | moneyFormat}}
                </span>
                <span slot="goods_sell" slot-scope="goods_sell">
                    {{ goods_sell | moneyFormat}}
                </span>
        <template slot="operation" slot-scope="text">
          <a href="javascript:;" @click="editOperation(text)">编辑</a>
          <a href="javascript:;" @click="showTag(text)">查看详情</a>
          <a href="javascript:;" @click="deleteOperation(text)">删除</a>
        </template>
      </a-table>
    </a-spin>
    <div class="form-drawer">
      <a-drawer :title="'筛选产品'"
                :closable="false"
                :visible="drawerVisible"
                @close="drawerClose"
                :drawerStyle="{background:'#F8FAFC'}"
                :width="drawerWidth"
      >
        <div class="form-content">
          <SearchGoods :searchLoading="searchLoading" @search="search" ref="searchCategory"/>
        </div>
      </a-drawer>
    </div>
    <a-modal :title="modalTitle"
             v-model="visible"
             @ok="handleOk"
             :class="showHeader? ['common-modal', 'personal-modal'] : ['common-modal', 'tagGroup-modal']"
             :destroyOnClose="true"
             :keyboard="true"
             :maskClosable="false"
             :closable="!showHeader"
             :okText="'确认'"
             :cancelText="'取消'"
             :confirmLoading="confirmLoading">
      <div class="check-box-area" v-if="showHeader">
        <a-checkbox-group name="checkboxgroup"
                          v-model="checkedHeader"
                          :options="options">
        </a-checkbox-group>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import Title from '@/components/contentTitle';
  import { Modal } from 'ant-design-vue';
  import SearchGoods from "@/views/goods/SearchGoods"
  import {reqAddCategory, reqCategoryDetailUse, reqEditCategory,} from "../../api";
  import {reqDeletePackage, reqPackageList} from "../../api/package";
  import { moneyFormat } from "../../filters";
  import { mapMutations } from 'vuex';
  import {reqDeleteGoods, reqGoodsList} from "../../api/goods";
  export default {
    name: "Category",
    data () {
      return {
        columns: [],
        showHeader: false,
        drawerVisible: false,
        searchLoading: false,
        searchCondition: {},
        drawerWidth: '450',
        imgUrl: '',
        uploading: false,
        editInfo:{},
        defaultColumns: [{
          id: 1,
          name: 'id',
          title: '序号'
        }, {
          id: 2,
          name: 'goods_name',
          title: '产品名称'
        }, {
          id: 3,
          name: 'goods_info',
          title: '产品说明'
        }, {
          id: 4,
          name: 'goods_single',
          title: '单个成本(元)',
          scopedSlots: true,
        }, {
          id: 5,
          name: 'goods_sell',
          title: '单个售价(元)',
          scopedSlots: true,
        }, {
          id: 6,
          name: 'goods_price',
          title: '当前总成本(元)',
          scopedSlots: true,
        }, {
          id: 7,
          name: 'goods_num',
          title: '库存数量(个)'
        }, {
          id: 8,
          name: 'goods_time',
          title: '入库时间'
        }],
        options: [  { label: '序号', value: 'id' },
          { label: '产品名称', value: 'goods_name' },
          { label: '产品说明', value: 'goods_info' },
          { label: '单个成本(元)', value: 'goods_single' },
          { label: '单个售价(元)', value: 'goods_sell' },
          { label: '当前总成本(元)', value: 'goods_price' },
          { label: '库存数量(个)', value: 'goods_num' },
          { label: '入库时间', value: 'goods_time' }],
        showColumns: [],
        dataSource: [],
        initLoading: false,
        tableValue: '',
        selectValue: [],
        tableHeader: [],
        title: '产品管理',
        tableId: '',
        visible: false,
        confirmLoading: false,
        tableLoading: false,
        modalTitle: '新增产品',
        detailUse: [],
        pagination: {
          total: 0,
          defaultCurrent: 1,
          pageSize: 10,
          current: 1,
          showSizeChange (pageSize) {
            this.pagination.pageSize = pageSize;
          },
          change (page) {
            console.log(page);
            this.pagination.current = page;
            this.getTableData();
          },
          showQuickJumper: true,
          showSizeChanger: false,
          pageSizeOptions: ['10', '20', '30', '40']
        },
        rowSelection: {},
        checkedHeader: [],
        form: this.$form.createForm(this),
        formItemLayout: {
          labelCol: { span: 7 },
          wrapperCol: { span: 14 }
        },
        selectedId: '',
        headers: {
          'Authorization': `Bear ` + this.$store.state.token
        }
      }
    },
    methods: {
      async getTableData (type) {
        if (!type){
          this.initLoading = true;
        } else {
          this.searchLoading = true;
        }
        const result_category = await reqGoodsList({
          ...this.searchCondition,
          currentPage: this.pagination.current,
          pageSize: this.pagination.pageSize
        });
        const {code, message, data } = result_category.data;

        if (code === 0){
          type === 1 && this.$message.success(message) && this.$refs.searchCategory.resetForm();
          this.dataSource = data.rows;
          this.pagination.total = data.count;
        } else {
          this.$message.error(message);
        }
        this.initLoading = false;
        this.searchLoading = false;
        this.drawerVisible = false;
      },
      async getDetailUse () {
        const result = await reqCategoryDetailUse();
        const { code, message, data } = result.data;
        if (code === 0){
          this.detailUse = data;
          this.changeDetailUse(data);
        } else {
          this.$message.error(message);
        }
      },
      handleTableChange (pagination) {
        this.pagination.current = pagination.current;
        this.getTableData();
      },
      changeValue (value) {
        this.tableValue = value;
      },
      drawerClose () {
        this.drawerVisible = false;
      },
      tableInit () {
        this.showColumns = this.defaultColumns;
        this.showColumns.map(( item ) => {
          if (item.scopedSlots){
            this.columns.push({
              title: item.title,
              key: item.name,
              dataIndex: item.name,
              scopedSlots: { customRender: item.name }
            });
          } else {
            this.columns.push({
              title: item.title,
              key: item.name,
              dataIndex: item.name
            });
          }
          return item;
        });
        this.columns.push({
          title: '操作',
          scopedSlots: { customRender: 'operation' }
        });

        this.rowSelection = {
          onChange: (selectedRowKeys) => {
            this.selectedId = selectedRowKeys;
          },
          onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
          },
          onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
          }
        }
      },
      changeHeader () {
        this.modalTitle = '筛选表头';
        this.showHeader = true;
        this.visible = true;
      },
      editOperation (tagGroup) {
        this.$router.push({ path: '/auth/goods/addOrEditGoods', query: { goods: tagGroup }})
      },
      showTag (tagGroup) {
        this.$router.push("/auth/goods/detail/" + tagGroup.id);
      },
      deleteOperation (tagGroup) {
        Modal.confirm({
          title: '删除产品',
          content: '确定要删除 ' + tagGroup.goods_name + ' 吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            reqDeleteGoods({
              ids: [tagGroup.id]
            }).then( res  => {
              const { code, message } = res.data;
              code === 0 && this.$message.success(message) && this.getTableData();
              code !== 0 && this.$message.error(message);
            });
          }
        })
      },
      deleteMany () {
        if (this.selectedId.length === 0){
          return this.$message.warning('请先选择批量删除项');
        }
        Modal.confirm({
          title: '批量删除产品',
          content: '确定要批量删除这些产品吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            reqDeleteGoods({
              ids: this.selectedId
            }).then( res  => {
              const { code, message } = res.data;
              code === 0 && this.$message.success(message) && this.getTableData();
              code !== 0 && this.$message.error(message);
            });
          }
        })
      },
      showSearchForm () {

      },
      addTagGroup () {
        this.$router.push('/auth/goods/addOrEditGoods');
      },
      showTable () {
        this.drawerVisible = true;
      },
      handleOk () {
        if (this.showHeader){
          const okColumns = [];
          this.showColumns.map( item => {
            this.checkedHeader.map( cItem => {
              if (cItem === item.name){
                if (item.scopedSlots){
                  okColumns.push({
                    title: item.title,
                    key: item.name,
                    dataIndex: item.name,
                    scopedSlots: { customRender: item.name }
                  });
                } else {
                  okColumns.push({
                    title: item.title,
                    key: item.name,
                    dataIndex: item.name
                  });
                }
              }
            });
          });
          okColumns.push({
            title: '操作',
            scopedSlots: { customRender: 'operation' }
          });
          this.columns = okColumns;
          this.visible = false;
        } else {
          this.form.validateFields( (err, values) => {
            if (err){
              return false;
            }
            this.confirmLoading = true;
            if (!this.editInfo.id){
              reqAddCategory(values).then( res => {
                const { code, message } = res.data;
                code === 0 && this.$message.success(message) && this.getTableData();
                code !== 0 && this.$message.error(message);
                this.confirmLoading = false;
                this.visible = false;
              })
            } else {
              values.id = this.editInfo.id;
              reqEditCategory(values).then( res => {
                const { code, message } = res.data;
                code === 0 && this.$message.success(message) && this.getTableData();
                code !== 0 && this.$message.error(message);
                this.confirmLoading = false;
                this.visible = false;
              })
            }
          })
        }
      },
      search (searchCondition) {
        this.searchCondition = searchCondition;
        this.getTableData(1);
      },
      handleCheckedCitiesChange () {

      },
      ...mapMutations(['changeDetailUse'])
    },
    filters: {
      moneyFormat (money) {
        return moneyFormat(money)
      }
    },
    components:{
      Title,
      SearchGoods
    },
    mounted() {
      this.getTableData();
      this.getDetailUse();
      this.tableInit();
      this.checkedHeader = this.options.map( item => item.value);
    }
  }
</script>

<style lang="less">
  .add-tag-group{
    .ant-input{
      background: #F7F9FA !important;
    }
    .ant-input:focus{
      background: #ffffff !important;
    }
    .ant-select-selection--single{
      background: #F7F9FA !important;
    }
  }
  .ant-checkbox-group-item{
    white-space: nowrap;
    text-overflow:ellipsis;
    overflow: hidden;
    width: 117px;
  }
  .tagGroup-modal{
    .ant-btn{
      margin-top: 20px;
    }
  }
  .personal-modal{
    .ant-btn{
      &:nth-child(1){
        display: none;
      }
    }
  }
  #detail_time{
    width: auto !important;
  }
</style>
