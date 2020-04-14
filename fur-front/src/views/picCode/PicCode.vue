<template>
  <div id="tag">
    <Title :title="title"/>
    <div class="button-area">
      <a-button type="primary" icon="search" @click="showTable">筛选查询</a-button>
      <a-button type="danger" icon="delete" @click="deleteMany">批量删除</a-button>
      <a-button type="primary" icon="pushpin" @click="changeHeader">筛选显示</a-button>
    </div>
    <a-spin :spinning="initLoading" tip="获取二维码数据中...">
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
                <span slot="picCode" slot-scope="picCode">
                    <img :src="picCode" alt="二维码" style="width: 30px;height: 30px;">
                </span>
                <span slot="code_type" slot-scope="code_type">
                    {{ code_type === '0' && '配件生产' || '产品生产' }}
                </span>
              <span slot="goods_sell" slot-scope="goods_sell">
                    {{ goods_sell | moneyFormat}}
                </span>
        <template slot="operation" slot-scope="text">
          <a href="javascript:;" @click="editOperation(text)">查看大图</a>
          <!--<a href="javascript:;" @click="showTag(text)">查看内容</a>-->
          <a href="javascript:;" @click="deleteOperation(text)">删除</a>
        </template>
      </a-table>
    </a-spin>
    <div class="form-drawer">
      <a-drawer :title="'筛选二维码'"
                :closable="false"
                :visible="drawerVisible"
                @close="drawerClose"
                :drawerStyle="{background:'#F8FAFC'}"
                :width="drawerWidth"
      >
        <div class="form-content">
          <SearchPic :searchLoading="searchLoading" @search="search" ref="searchCategory"/>
        </div>
      </a-drawer>
    </div>
    <a-modal :title="modalTitle"
             v-model="visible"
             @ok="handleOk"
             :class="showHeader || showPic? ['common-modal', 'personal-modal'] : ['common-modal', 'tagGroup-modal']"
             :destroyOnClose="true"
             :keyboard="true"
             :maskClosable="false"
             :closable="!showHeader"
             :okText="'确认'"
             :cancelText="'取消'"
             :confirmLoading="confirmLoading">
      <div class="check-box-area" >
        <a-checkbox-group name="checkboxgroup"
                          v-model="checkedHeader"
                          :options="options" v-if="showHeader">
        </a-checkbox-group>
        <div id="picCode" v-if="showPic">
          <img :src="editInfo.picCode || ''" alt="二维码大图">
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import Title from '@/components/contentTitle';
  import { Modal } from 'ant-design-vue';
  import {reqAddCategory, reqCategoryDetailUse, reqEditCategory,} from "../../api";
  import { moneyFormat } from "../../filters";
  import { mapMutations } from 'vuex';
  import SearchPic from "./SearchPic";
  import {reqDeletePicCode, reqPicCodeList} from "../../api/picCode";
  export default {
    name: "PicCode",
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
        showPic: false,
        editInfo:{},
        defaultColumns: [{
          id: 1,
          name: 'id',
          title: '序号'
        }, {
          id: 2,
          name: 'picCode',
          title: '二维码',
          scopedSlots: true,
        }, {
          id: 3,
          name: 'code_type',
          title: '来源类型',
          scopedSlots: true,
        }, {
          id: 4,
          name: 'code_name',
          title: '来源个体',
        }, {
          id: 5,
          name: 'username',
          title: '生成人'
        },{
          id: 6,
          name: 'code_time',
          title: '生成时间',
        }],
        options: [  { label: '序号', value: 'id' },
          { label: '二维码', value: 'picCode' },
          { label: '来源类型', value: 'code_type' },
          { label: '来源个体', value: 'code_name' },
          { label: '生成人', value: 'username' },
          { label: '生成时间', value: 'code_time' }],
        showColumns: [],
        dataSource: [],
        initLoading: false,
        tableValue: '',
        selectValue: [],
        tableHeader: [],
        title: '二维码管理',
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
        const result_category = await reqPicCodeList({
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
        this.showPic = false;
        this.visible = true;
      },
      editOperation (text) {
        this.modalTitle = '二维码大图';
        this.editInfo = text;
        this.showHeader = false;
        this.showPic = true;
        this.visible = true;
      },
      showTag (tagGroup) {
        this.$router.push("/auth/goods/detail/" + tagGroup.id);
      },
      deleteOperation (tagGroup) {
        Modal.confirm({
          title: '删除二维码',
          content: '确定要删除 ' + tagGroup.code_name + '的二维码吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            reqDeletePicCode({
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
          title: '批量删除二维码',
          content: '确定要批量删除这些二维码吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            reqDeletePicCode({
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
          this.visible = false;
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
      SearchPic,
      Title,
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
    img{
      margin-left: 17% !important;
    }
  }
  .ant-calendar-picker{
    width: auto !important;
  }
</style>
