<template>
  <div id="add-plan">
    <Title :title="title"/>
    <div class="button-area">
      <a-button type="primary" icon="search" @click="showTable">筛选查询</a-button>
      <a-button type="danger" icon="delete" @click="deleteMany">批量删除</a-button>
      <a-button icon="plus" @click="addTagGroup">新增产品计划</a-button>
      <a-button type="primary" icon="pushpin" @click="changeHeader">筛选显示</a-button>
    </div>
    <a-spin :spinning="initLoading" tip="获取产品计划数据中...">
      <a-table class="tag-table"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :rowSelection="rowSelection"
               :rowKey="'id'"
               @change="handleTableChange">
                <span slot="goods_status.status_name" slot-scope="text">
                  <a-badge :status="text !== '已完成' ? 'processing' : 'success'" :text="text" />
                </span>
                <span slot="produce_price" slot-scope="text">
                  {{ text | moneyFormat }}
                </span>
        <template slot="operation" slot-scope="text">
          <a href="javascript:;" @click="editOperation(text)" v-if="($store.state.userInfo.identity === 0 && text.is_leader ) || $store.state.userInfo.identity === 1">编辑</a>
          <a href="javascript:;" @click="approveStatus(text)" v-if="text.produce_status < 8 && text.is_approved === '0' && (($store.state.userInfo.identity === 0 && text.is_leader ) || $store.state.userInfo.identity === 1)">下一阶段</a>
          <a href="javascript:;" @click="approveStatus(text)" v-if="text.produce_status === 8 && text.is_approved === '0' && (($store.state.userInfo.identity === 0 && text.is_leader ) || $store.state.userInfo.identity === 1)">生产完成</a>
          <a href="javascript:;" @click="showTag(text)">查看详情</a>
          <a href="javascript:;" @click="deleteOperation(text)" v-if="text.produce_status === 9 && (($store.state.userInfo.identity === 0 && text.is_leader ) || $store.state.userInfo.identity === 1)">删除</a>
        </template>
      </a-table>
    </a-spin>
    <div class="form-drawer">
      <a-drawer :title="'筛选计划'"
                :closable="false"
                :visible="drawerVisible"
                @close="drawerClose"
                :drawerStyle="{background:'#F8FAFC'}"
                :width="drawerWidth"
      >
        <div class="form-content">
          <SearchGoods :searchLoading="searchLoading" @search="search" ref="searchCategory" :searchMachineList="searchMachineList"/>
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
      <div class="add-tag-group" v-if="!showHeader && !showApprove">
        <a-form :form="form">
          <a-col :span="24" v-if="!editInfo.id">
            <a-form-item label="选择产品"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-select
                v-decorator="[  'goods_id' , {
                  initialValue: editInfo.goods_id || undefined,
                  rules: [{   required: true, message: '请选择生产产品!' }]
                } ]"
                placeholder="请选择产品"
                :disabled="!!editInfo.goods_id"
              >
                <a-select-option v-for="item in packageList" :value="item.id" :key="item.id">
                  {{item.goods_name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="!editInfo.id">
            <a-form-item label="选择机器"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-select
                v-decorator="[  'machine_id' , {
                  initialValue: editInfo.machine_id || undefined,
                  rules: [{   required: true, message: '请选择生产机器!' }]
                } ]"
                placeholder="请选择生产机器"
              >
                <a-select-option v-for="item in machineList" :value="item.id" :key="item.id">
                  {{item.machine_name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="!editInfo.id">
            <a-form-item label="分配班组"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-select
                v-decorator="[  'group_id' , {
                  initialValue: editInfo.group_id || undefined,
                  rules: [{   required: true, message: '请选择分配班组!' }]
                } ]"
                placeholder="请选择分配班组"
              >
                <a-select-option v-for="item in groupList" :value="item.id" :key="item.id">
                  {{item.group_name }} <a-rate v-model="item.group_score" disabled style="float: right;"/>
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="!editInfo.id">
            <a-form-item label="生产数量"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-input-number v-decorator="[
                                             'produce_num',
                                             {  initialValue: editInfo.produce_num || undefined,
                                                rules: [
                                                 {   required: true, message: '请添加生产数量(个)!' }] }
                                                ]"
                              placeholder="请添加生产数量(个)" :min="1"
                              :disabled="!!editInfo.produce_num">
              </a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="预计完成时间"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-date-picker
                v-decorator="[
                  'produce_end_time',
                 {  initialValue: editInfo.produce_end_time && $moment(editInfo.produce_end_time, 'YYYY-MM-DD hh:mm:ss') || undefined,
                 rules: [{   required: true, message: '请选择结束时间(个)!' }] }]"
                format="YYYY-MM-DD hh:mm:ss"
                :disabledDate="disabledDate"
                :disabledTime="disabledDateTime"
                :showTime="{ defaultValue: $moment('00:00:00', 'HH:mm:ss') }"
                placeholder="请选择结束时间"
                :disabled="!!editInfo.produce_end_time"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-textarea v-decorator="[
                                             'produce_info',
                                             {   initialValue: editInfo.produce_info || undefined,
                                                 }
                                                ]"
                          placeholder="请输入生产备注"
                          style="height: 100px;">
              </a-textarea>
            </a-form-item>
          </a-col>
        </a-form>
      </div>
      <div id="approve" v-if="showApprove">
        <a-form :form="form">
          <a-col :span="24">
            <a-form-item label="审批人"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-select
                v-decorator="[  'approve_id', {
                  rules: [{   required: true, message: '请选择审批人!' }]
                }]"
                placeholder="请选择审批人"
              >
                <a-select-option v-for="item in approveList" :value="item.id" :key="item.id">
                  {{item.username}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="选择机器"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-select
                v-decorator="[  'machine_id' , {
                  rules: [{   required: true, message: '请选择生产机器!' }]
                } ]"
                placeholder="请选择生产机器"
              >
                <a-select-option v-for="item in machineByTypeList" :value="item.id" :key="item.id">
                  {{item.machine_name}}
                </a-select-option>
              </a-select>
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
  import SearchGoods from "@/views/produce/SearchGoods"
  import { reqCategoryDetailUse } from "../../api";
  import { mapMutations } from 'vuex';
  import {
    reqAddProduceGoods,reqDeleteProduceGoods,
    reqProduceGoods,reqUpdateProduceGoods,
  } from "../../api/produce";
  import { moneyFormat } from "../../filters";
  import {reqGoodsMachine} from "../../api/machine";
  import {reqAllGoods} from "../../api/goods";
  import {reqApproveId, reqApproveProduce} from "../../api/approve";
  import {reqAllGroup} from "../../api/staff";

  export default {
    name: "ProduceGoods",
    data () {
      return {
        columns: [],
        showHeader: false,
        approveList: [],
        drawerVisible: false,
        searchLoading: false,
        showApprove: false,
        searchCondition: {},
        packageList: [],
        machineList: [],
        groupList: [],
        searchMachineList: [],
        drawerWidth: '450',
        imgUrl: '',
        uploading: false,
        editInfo:{},
        defaultColumns: [{
          id: 1,
          name: 'id',
          title: '生产编号'
        },{
          id: 2,
          name: 'good.goods_name',
          title: '产品名称'
        }, {
          id: 3,
          name: 'machine.machine_name',
          title: '运行机器'
        },{
          id: 4,
          name: 'group.group_name',
          title: '负责班组',
          scopedSlots: true
        },{
          id: 5,
          name: 'produce_price',
          title: '生产总成本(元)',
          scopedSlots: true
        }, {
          id: 6,
          name: 'produce_num',
          title: '生产总数量(个)'
        },{
          id: 7,
          name: 'goods_status.status_name',
          title: '生产状态',
          scopedSlots: true
        }, {
          id: 8,
          name: 'produce_start_time',
          title: '开始时间'
        }, {
          id: 9,
          name: 'produce_end_time',
          title: '预计完成时间'
        }, {
          id: 10,
          name: 'produce_info',
          title: '备注'
        }],
        options: [  { label: '生产编号', value: 'id' },
          { label: '产品名称', value: 'good.goods_name' },
          { label: '运行机器', value: 'machine.machine_name' },
          { label: '负责班组', value: 'group.group_name' },
          { label: '生产总成本(元)', value: 'produce_price' },
          { label: '生产总数量(个)', value: 'produce_num' },
          { label: '生产状态', value: 'goods_status.status_name' },
          { label: '开始时间', value: 'produce_start_time' },
          { label: '预计完成时间', value: 'produce_end_time' },
          { label: '备注', value: 'produce_info' }],
        showColumns: [],
        dataSource: [],
        machineByTypeList: [],
        initLoading: false,
        tableValue: '',
        selectValue: [],
        tableHeader: [],
        title: '产品生产管理',
        tableId: '',
        visible: false,
        confirmLoading: false,
        tableLoading: false,
        modalTitle: '新增计划',
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
      range(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
      },
      disabledDate(current) {
        // Can not select days before today and today
        return current && current < this.$moment().endOf('day');
      },
      disabledDateTime() {
        return {
          disabledHours: () => this.range(0, 24).splice(4, 20),
          disabledMinutes: () => this.range(30, 60),
          disabledSeconds: () => [55, 56],
        };
      },
      async approveStatus (approve) {
        this.modalTitle = '提交审批';
        this.editInfo = approve;
        this.showApprove = true;
        this.showHeader = false;
        await this.getMachineByType(approve.produce_status + 1);
        this.visible = true;
      },
      async orderInit () {
        if (!this.$route.query.order){
          return false;
        }
        const order = this.$route.query.order;
        this.editInfo.goods_id = order.goods_id;
        this.editInfo.produce_num = order.order_num;
        this.editInfo.produce_end_time = order.handle_time;
        this.visible = true;
      },
      async getTableData (type) {
        if (!type){
          this.initLoading = true;
        } else {
          this.searchLoading = true;
        }
        const result_category = await reqProduceGoods({
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
      async getAllGoods () {
        const result = await reqAllGoods();
        const{ code, message, data } = result.data;
        if (code === 0){
          this.packageList = data;
        } else {
          this.$message.error(message);
        }
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
        return true;
      },
      async getAllMachine (condition, isAll) {
         const result = await reqGoodsMachine(condition);
        const { code, message, data } = result.data;
        if (code === 0){
          if (!isAll){
            this.machineList = data;
          } else {
            this.searchMachineList = data;
          }
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
        this.modalTitle = '编辑产品计划';
        this.showHeader = false;
        this.showApprove = false;
        this.editInfo = tagGroup;
        this.visible = true;
      },
      showTag (tagGroup) {
        this.$router.push( { path: "/auth/produceGoods/detail", query: { produce: tagGroup }} );
      },
      deleteOperation (tagGroup) {
        Modal.confirm({
          title: '删除产品计划',
          content: '确定要删除 ' + tagGroup['good.goods_name'] + ' 吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            reqDeleteProduceGoods({
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
          title: '批量删除配件',
          content: '确定要批量删除这些配件吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            reqDeleteProduceGoods({
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
        this.modalTitle = '新增产品计划';
        this.editInfo = {};
        this.showHeader = false;
        this.visible = true;
      },
      showSearchForm () {

      },
      showTable () {
        this.drawerVisible = true;
      },
      async getApproveId (){
        const result = await reqApproveId();

        const { code, message, data } = result.data;
        if (code === 0){
          this.approveList = data;
        } else {
          this.$message.error(message);
        }
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
            if (this.showApprove){
              values.produce = this.editInfo;
              reqApproveProduce(values).then( res => {
                const { code, message } = res.data;

                code === 0 && this.$message.success(message) && this.getTableData();
                code !== 0 && this.$message.error(message);
                this.confirmLoading = false;
                this.visible = false;
              });
            } else {
              values.produce_end_time = this.$moment(values.produce_end_time).format('YYYY-MM-DD hh:mm:ss');
              if (!this.editInfo.id){
                reqAddProduceGoods(values).then( res => {
                  const { code, message } = res.data;
                  code === 0 && this.$message.success(message) && this.getTableData();
                  code !== 0 && this.$message.error(message);
                  this.confirmLoading = false;
                  this.visible = false;
                })
              } else {
                values.id = this.editInfo.id;
                reqUpdateProduceGoods(values).then( res => {
                  const { code, message } = res.data;
                  code === 0 && this.$message.success(message) && this.getTableData();
                  code !== 0 && this.$message.error(message);
                  this.confirmLoading = false;
                  this.visible = false;
                })
              }
            }
          })
        }
      },
      search (searchCondition) {
        this.searchCondition = searchCondition;
        this.getTableData(1);
      },
      async getMachineByType (type) {
        const result = await reqGoodsMachine({
          machine_type: type,
        });
        const { code, message, data } = result.data;
        if (code === 0){
          this.machineByTypeList = data;
        } else {
          this.$message.error(message);
        }
      },
      async getAllGroup () {
        const result = await reqAllGroup({
          type: '0'
        });

        const { code, message, data } = result.data;

        if (code === 0){
          this.groupList = data;
        } else {
          this.$message.error(message);
        }
      },
      handleCheckedCitiesChange () {

      },
      ...mapMutations(['changeDetailUse'])
    },
    filters: {
      moneyFormat (money) {
        return moneyFormat(money);
      }
    },
    components:{
      Title,
      SearchGoods
    },
    mounted() {
      this.getDetailUse().then( () => {
        this.getAllMachine({
          machine_use: '1',
          machine_type: 1,
          machine_status: 0,
        }, false).then( () => {
          this.getAllMachine({
            machine_use: '1',
          }, true);
          this.getTableData();
        });
      });
      this.getAllGoods();
      this.getApproveId();
      this.tableInit();
      this.getAllGroup();
      this.orderInit();
      this.checkedHeader = this.options.map( item => item.value);
    }
  }
</script>

<style lang="less">
  .add-tag-group,#approve{
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
    .ant-input-number{
      width: 100% !important;
      background: #F7F9FA !important;
    }
    .ant-calendar-picker{
      width: 100% !important;
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
