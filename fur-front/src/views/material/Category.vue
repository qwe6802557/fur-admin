<template>
  <div id="tag">
    <Title :title="title"/>
    <div class="button-area">
      <a-button type="primary" icon="search" @click="showTable">筛选查询</a-button>
      <a-button type="danger" icon="delete" @click="deleteMany">批量删除</a-button>
      <a-button icon="plus" @click="addTagGroup">新建原料目录</a-button>
      <a-button type="primary" icon="pushpin" @click="changeHeader">筛选显示</a-button>
    </div>
    <a-spin :spinning="initLoading" tip="获取目录数据中...">
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
        <template slot="operation" slot-scope="text">
          <a href="javascript:;" @click="editOperation(text)">编辑</a>
          <a href="javascript:;" @click="showTag(text)">查看子列表</a>
          <a href="javascript:;" @click="deleteOperation(text)">删除</a>
        </template>
      </a-table>
    </a-spin>
    <div class="form-drawer">
      <a-drawer :title="'筛选目录'"
                :closable="false"
                :visible="drawerVisible"
                @close="drawerClose"
                :drawerStyle="{background:'#F8FAFC'}"
                :width="drawerWidth"
                >
        <div class="form-content">
          <SearchCategory :searchLoading="searchLoading" @search="search" ref="searchCategory"/>
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
      <div class="add-tag-group" v-if="!showHeader">
        <a-form :form="form">
          <a-col :span="24">
            <a-form-item label="列表名称"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-input v-decorator="[
                                             'category_name',
                                             {   initialValue: editInfo.category_name || undefined,
                                                 rules: [
                                                 {   required: true, message: '请输入列表名称!' }] }
                                                ]"
                       placeholder="请输入列表名称">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="列表描述"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-textarea v-decorator="[
                                             'category_info',
                                             {   initialValue: editInfo.category_info || undefined,
                                                 }
                                                ]"
                       placeholder="请输入列表描述"
                       style="height: 100px;">
              </a-textarea>
            </a-form-item>
          </a-col>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import Title from '@/components/contentTitle';
  import { Modal } from 'ant-design-vue';
  import SearchCategory from "@/views/material/SearchCategory"
  import {reqAddCategory, reqDeleteCategory, reqEditCategory, reqSearchCategory} from "../../api";
  export default {
    name: "Category",
    data () {
      return {
        columns: [],
        showHeader: false,
        drawerVisible: false,
        searchLoading: false,
        searchCondition: {},
        drawerWidth: '320',
        editInfo:{},
        defaultColumns: [{
          id: 1,
          name: 'id',
          title: '序号'
        }, {
          id: 2,
          name: 'category_name',
          title: '目录名称'
        }, {
          id: 3,
          name: 'category_info',
          title: '目录说明'
        }, {
          id: 4,
          name: 'category_children_num',
          title: '子原料数量'
        }],
        options: [  { label: '序号', value: 'id' },
          { label: '目录名称', value: 'category_name' },
          { label: '目录说明', value: 'category_info' },
          { label: '子原料数量', value: 'category_children_num' }],
        showColumns: [],
        dataSource: [{
          id: 1,
          tableId: 8,
          tagGroupName: '标签组1'
        }],
        initLoading: false,
        tableValue: '',
        selectValue: [],
        tableHeader: [],
        title: '原料目录',
        tableId: '',
        visible: false,
        confirmLoading: false,
        tableLoading: false,
        modalTitle: '新增原料目录',
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
        selectedId: ''
      }
    },
    methods: {
      async getTableData (type) {
        if (!type){
          this.initLoading = true;
        } else {
          this.searchLoading = true;
        }
        const result_category = await reqSearchCategory({
          ...this.searchCondition,
          currentPage: this.pagination.current,
          pageSize: this.pagination.pageSize
        });
        const {code, message, data } = result_category.data;
        if (code === 0){
          type === 1 && this.$message.success(message) && this.$refs.searchCategory.resetForm();;
          this.dataSource = data.rows;
          this.pagination.total = data.count;
        } else {
          this.$message.error(message);
        }
        this.initLoading = false;
        this.searchLoading = false;
        this.drawerVisible = false;
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
        this.modalTitle = '编辑原料目录';
        this.showHeader = false;
        this.editInfo = tagGroup;
        this.visible = true;
      },
      showTag (tagGroup) {
        this.$router.push("/auth/material/" + tagGroup.id);
      },
      deleteOperation (tagGroup) {
        Modal.confirm({
          title: '删除原料目录',
          content: '确定要删除 ' + tagGroup.category_name + ' 吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            reqDeleteCategory({
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
          title: '批量删除目录',
          content: '确定要批量删除这些目录吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            reqDeleteCategory({
              ids: this.selectedId
            }).then( res  => {
              const { code, message } = res.data;
              code === 0 && this.$message.success(message) && this.getTableData();
              code !== 0 && this.$message.error(message);
            });
          }
        })
      },
      addTagGroup () {
        this.modalTitle = '新增原料目录';
        this.editInfo = {};
        this.showHeader = false;
        this.visible = true;
      },
      showSearchForm () {

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
      }
    },
    components:{
      Title,
      SearchCategory
    },
    mounted() {
      this.getTableData();
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
</style>
