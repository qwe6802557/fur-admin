<template>
  <div id="tag">
    <Title :title="title"/>
    <div class="button-area">
      <a-button type="primary" icon="search" @click="showTable">筛选查询</a-button>
      <a-button type="danger" icon="delete" @click="deleteMany">批量删除</a-button>
      <a-button icon="plus" @click="addTagGroup">新增班组</a-button>
      <a-button type="primary" icon="pushpin" @click="changeHeader">筛选显示</a-button>
    </div>
    <a-spin :spinning="initLoading" tip="获取分组数据中...">
      <a-table class="tag-table"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :rowSelection="rowSelection"
               :rowKey="'id'"
               @change="handleTableChange">
                <span slot="group_status" slot-scope="group_status">
                    <a-tag :color="group_status === '0'? 'green' : 'volcano'">
                        {{group_status === '0'? '空闲中' : '工作中'}}
                    </a-tag>
                </span>
                <span slot="group_score" slot-scope="group_score">
                    <a-rate v-model="group_score" disabled />
                </span>
        <a-table
          slot="expandedRowRender"
          slot-scope="text"
          :columns="innerColumns"
          :dataSource="text.groupMember"
          :pagination="false"
          :rowKey="'staff.id'"
        >
          <span slot="staff_name" slot-scope="staff_name">
            <a-tag color="#f50" v-if="text.groupMember.filter( item => item['staff.staff_name'] === staff_name)[0].is_leader === '1'">组长</a-tag>{{staff_name}}
          </span>
          <span slot="innerOperation" slot-scope="innerOperation">
            <a href="javascript:;" @click="outGroup" v-if="text.group_status === '0'">踢出分组</a>
            <span v-if="text.group_status === '1'">-</span>
          </span>
        </a-table>
        <template slot="operation" slot-scope="text">
          <a href="javascript:;" @click="editOperation(text)">编辑</a>
          <!--<a href="javascript:;" @click="showTag(text)">查看详情</a>-->
          <a href="javascript:;" @click="deleteOperation(text)">删除</a>
        </template>
      </a-table>
    </a-spin>
    <div class="form-drawer">
      <a-drawer :title="'筛选分组'"
                :closable="false"
                :visible="drawerVisible"
                @close="drawerClose"
                :drawerStyle="{background:'#F8FAFC'}"
                :width="drawerWidth"
      >
        <div class="form-content">
          <SearchGroup :searchLoading="searchLoading" @search="search" ref="searchCategory"/>
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
      <div class="check-box-area" v-if="!showHeader">
        <a-form :form="form">
          <a-col :span="24">
            <a-form-item label="分组名称"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-input v-decorator="[
                                             'group_name',
                                             {   initialValue: editInfo.group_name || undefined,
                                                 rules: [
                                                 {   required: true, message: '请输入分组名称!' }] }
                                                ]"
                       placeholder="请输入分组名称">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="分组评分"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-input-number v-decorator="[
                                             'group_score',
                                             {  initialValue: editInfo.group_score || 0,
                                                rules: [
                                                 {   required: true, message: '请输入分组评分(0-5)!' }] }
                                                ]"
                              placeholder="请输入分组评分(0-5)" :min="0" :max="10">
              </a-input-number>
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
  import SearchGroup from "@/views/staff/SearchGroup"
  import {reqCategoryDetailUse} from "../../api";
  import { moneyFormat } from "../../filters";
  import { mapMutations } from 'vuex';
  import {reqAddGroup, reqDeleteGroup, reqGroupList, reqOutGroup, reqUpdateGroup} from "../../api/staff";
  export default {
    name: "StaffList",
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
        },  {
          id: 2,
          name: 'group_name',
          title: '班组名称'
        }, {
          id: 3,
          name: 'group_status',
          title: '班组状态',
          scopedSlots: true,
        }, {
          id: 4,
          name: 'group_score',
          title: '能力评分',
          scopedSlots: true,
        }, {
          id: 5,
          name: 'group_time',
          title: '创建时间',
          scopedSlots: true,
        }],
        innerColumns: [
          { title: '员工名称', dataIndex: 'staff.staff_name', key: 'staff.staff_name', scopedSlots: { customRender: 'staff_name' } },
          { title: '员工账号', dataIndex: 'staff.staff_username', key: 'staff.staff_username' },
          { title: '进组时间', dataIndex: 'member_time', key: 'member_time' },
          {
            title: '操作',
            dataIndex: 'innerOperation',
            key: 'innerOperation',
            scopedSlots: { customRender: 'innerOperation' },
          },
        ],
        options: [  { label: '序号', value: 'id' },
          { label: '班组名称', value: 'group_name' },
          { label: '班组状态', value: 'group_status' },
          { label: '能力评分', value: 'group_score' },
          { label: '创建时间', value: 'group_time' }],
        showColumns: [],
        dataSource: [],
        initLoading: false,
        tableValue: '',
        selectValue: [],
        tableHeader: [],
        title: '分组管理',
        tableId: '',
        visible: false,
        confirmLoading: false,
        tableLoading: false,
        modalTitle: '新增班组',
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
        const result_category = await reqGroupList({
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
      outGroup (e) {
        Modal.confirm({
          title: '踢出分组',
          content: '确定要踢出该成员吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            reqOutGroup({
              id: e.target.parentNode.parentNode.parentNode.dataset.rowKey,
            }).then( res => {
              const { code, message } = res.data;
              code === 0 && this.$message.success(message) && this.getTableData();
              code !== 0 && this.$message.error(message);
            })
          }
        })
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
        this.editInfo = tagGroup;
        this.modalTitle = '编辑分组';
        this.showHeader = false;
        this.visible = true;
      },
      showTag (tagGroup) {
        this.$router.push("/auth/goods/detail/" + tagGroup.id);
      },
      deleteOperation (tagGroup) {
        Modal.confirm({
          title: '删除分组',
          content: '确定要删除 ' + tagGroup.group_name + ' 吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            reqDeleteGroup({
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
          title: '批量删除分组',
          content: '确定要批量删除这些分组吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            reqDeleteGroup({
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
        this.modalTitle = '新增分组';
        this.editInfo = {};
        this.showHeader = false;
        this.visible = true;
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
              reqAddGroup(values).then( res => {
                const { code, message } = res.data;
                code === 0 && this.$message.success(message) && this.getTableData();
                code !== 0 && this.$message.error(message);
                this.confirmLoading = false;
                this.visible = false;
              })
            } else {
              values.id = this.editInfo.id;
              reqUpdateGroup(values).then( res => {
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
      SearchGroup
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
    .ant-input-number{
      width: 100% !important;
      background: #F7F9FA !important;
      &:focus{
        background: #ffffff !important;
      }
    }
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
