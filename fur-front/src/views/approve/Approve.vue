<template>
  <div id="tag">
    <Title :title="title"/>
    <div class="button-area">
      <a-button type="primary" icon="search" @click="showTable">筛选查询</a-button>
      <a-button type="danger" icon="delete" @click="deleteMany">批量删除</a-button>
      <a-button type="primary" icon="pushpin" @click="changeHeader">筛选显示</a-button>
    </div>
    <a-spin :spinning="initLoading" tip="获取审批数据中...">
      <a-table class="tag-table"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :rowSelection="rowSelection"
               :rowKey="'id'"
               @change="handleTableChange">
                <span slot="approve_type" slot-scope="approve_type">
                    {{ approve_type === '0' && '配件生产' || '产品生产'}}
                </span>
                <span slot="approve_status" slot-scope="approve_status">
                 <a-tag :color="approve_status === '0' && 'green' || approve_status === '1' && '#2db7f5' || 'red'">
                        {{approve_status === '0' &&  '待审批' || approve_status === '1' && '通过' || '驳回'}}
                 </a-tag>
                </span>
                <span slot="approve_advice" slot-scope="approve_advice">
                    {{ approve_advice || '-'}}
                </span>
                <span slot="approve_creator" slot-scope="approve_creator" :style="{color: approve_creator === $store.state.userInfo.username ? 'red' : ''}">
                    {{ approve_creator === $store.state.userInfo.username && '我' || approve_creator}}
                </span>
        <template slot="operation" slot-scope="text">
          <a href="javascript:;" @click="editOperation(text)" v-if="text.approve_status === '0' && text.creator_id !== $store.state.userInfo.id">审批</a>
          <a href="javascript:;" @click="showTag(text)">查看详情</a>
          <a href="javascript:;" @click="deleteOperation(text)" v-if="text.approve_status !== '0'">删除</a>
        </template>
      </a-table>
    </a-spin>
    <div class="form-drawer">
      <a-drawer :title="'筛选审批'"
                :closable="false"
                :visible="drawerVisible"
                @close="drawerClose"
                :drawerStyle="{background:'#F8FAFC'}"
                :width="drawerWidth"
      >
        <div class="form-content">
          <SearchApprove :searchLoading="searchLoading" @search="search" ref="searchCategory"/>
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
      <div class="add-group" v-if="!showHeader">
        <a-form :form="form">
            <a-col :span="24">
              <a-form-item label="审批操作"
                           :label-col="formItemLayout.labelCol"
                           :wrapper-col="formItemLayout.wrapperCol">
                <a-radio-group v-decorator="[  'approve_type', {
                      rules: [{   required: true, message: '请选择审批操作!' }]
                    }]" >
                  <a-radio :value="1">通过</a-radio>
                  <a-radio :value="2">驳回</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="审批意见"
                           :label-col="formItemLayout.labelCol"
                           :wrapper-col="formItemLayout.wrapperCol">
                <a-textarea v-decorator="[ 'approve_advice',
                                                    ]"
                            placeholder="请输入审批意见"
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
  import SearchApprove from "@/views/approve/SearchApprove"
  import {reqAddCategory, reqEditCategory,} from "../../api";
  import { moneyFormat } from "../../filters";
  import { mapMutations } from 'vuex';
  import {reqDeleteGoods} from "../../api/goods";
  import {reqApproveList, reqDeleteApprove, reqPassApprovePackage, reqPassApproveProduce} from "../../api/approve";
  export default {
    name: "Approve",
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
          name: 'approve_type',
          title: '审批类型',
          scopedSlots: true,
        }, {
          id: 3,
          name: 'approve_status',
          title: '审批状态',
          scopedSlots: true,
        }, {
          id: 4,
          name: 'approve_creator',
          title: '提交人',
          scopedSlots: true,
        }, {
          id: 5,
          name: 'approve_time',
          title: '提交时间'
        }, {
          id: 6,
          name: 'approve_advice',
          title: '审批意见',
          scopedSlots: true,
        }],
        options: [  { label: '序号', value: 'id' },
          { label: '审批类型', value: 'approve_type' },
          { label: '审批状态', value: 'approve_status' },
          { label: '提交人', value: 'approve_creator' },
          { label: '审批时间', value: 'approve_time' },
          { label: '审批意见', value: 'approve_advice' },],
        showColumns: [],
        dataSource: [],
        initLoading: false,
        tableValue: '',
        selectValue: [],
        tableHeader: [],
        title: '审批管理',
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
        const result_category = await reqApproveList({
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
      },
      selectionInit () {
        this.rowSelection = {
          onChange: (selectedRowKeys) => {
            this.selectedId = selectedRowKeys;
          },
          onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
          },
          onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
          },
          getCheckboxProps: record => ({
            props: {
              disabled: record.approve_status !== '0', // Column configuration not to be checked
              approve_status: record.approve_status,
            },
          }),
        }
      },
      changeHeader () {
        this.modalTitle = '筛选表头';
        this.showHeader = true;
        this.visible = true;
      },
      editOperation (tagGroup) {
        this.editInfo = tagGroup;
        this.showHeader = false;
        this.modalTitle = '审批生产';
        this.visible = true;
      },
      showTag (tagGroup) {
        this.$router.push("/auth/approve/detail/" + tagGroup.id);
      },
      deleteOperation (tagGroup) {
        Modal.confirm({
          title: '删除审批',
          content: '确定要删除该审批吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            reqDeleteApprove({
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
          title: '批量删除审批',
          content: '确定要批量删除这些审批吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            reqDeleteApprove({
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
            if (this.editInfo.approve_type === '1'){
              values.id = this.editInfo.id;
              reqPassApproveProduce(values).then( res => {
                const { code, message } = res.data;

                code === 0 && this.$message.success(message) && this.getTableData();
                code !== 0 && this.$message.error(message);

                this.confirmLoading = false;
                this.visible = false;
              });
            } else {
              reqPassApprovePackage({
                id: this.editInfo.id,
                ...values
              }).then( res => {
                const { code, message } = res.data;

                code === 0 && this.$message.success(message) && this.getTableData();
                code !== 0 && this.$message.error(message);

                this.confirmLoading = false;
                this.visible = false;
              });
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
      SearchApprove
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
  #detail_time{
    width: auto !important;
  }
</style>
