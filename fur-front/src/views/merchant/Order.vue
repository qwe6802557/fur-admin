<template>
  <div id="order">
    <Title :title="title"/>
    <div class="button-area">
      <a-button type="primary" icon="search" @click="showTable">筛选查询</a-button>
      <a-button type="danger" icon="delete" @click="deleteMany">批量删除</a-button>
      <a-button icon="plus" @click="addTagGroup">新增订单</a-button>
      <a-button type="primary" icon="pushpin" @click="changeHeader">筛选显示</a-button>
    </div>
    <a-spin :spinning="initLoading" tip="获取订单数据中...">
      <a-table class="tag-table"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :rowSelection="rowSelection"
               :rowKey="'id'"
               @change="handleTableChange">
                <span slot="order_status" slot-scope="order_status">
                    <a-tag :color="order_status === '1'? 'green' : 'volcano'">
                        {{order_status === '1'? '已交付' : '未交付'}}
                    </a-tag>
                </span>
                <span slot="order_price" slot-scope="order_price">
                    {{ order_price | moneyFormat}}
                </span>
        <template slot="operation" slot-scope="text">
          <a href="javascript:;" @click="editOperation(text)" v-if="text.order_status === '0'">交付</a>
          <a href="javascript:;" @click="showTag(text)" v-if="text.order_status === '0'">建立生产计划</a>
          <a href="javascript:;" @click="deleteOperation(text)">删除</a>
        </template>
      </a-table>
    </a-spin>
    <div class="form-drawer">
      <a-drawer :title="'筛选订单'"
                :closable="false"
                :visible="drawerVisible"
                @close="drawerClose"
                :drawerStyle="{background:'#F8FAFC'}"
                :width="drawerWidth"
      >
        <div class="form-content">
          <SearchOrder :searchLoading="searchLoading" @search="search" ref="searchCategory" :goodsList="goodsList" :merchantList="merchantList"/>
        </div>
      </a-drawer>
    </div>
    <a-modal :title="modalTitle"
             v-model="visible"
             @ok="handleOk"
             @cancel="handleCancel"
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
      <div class="check-box-area" v-if="showAuthority">
        <a-checkbox-group name="checkboxgroup"
                          v-model="checkedAuthority"
                          :options="authorityList">
        </a-checkbox-group>
      </div>
      <div class="check-box-area" v-if="!showHeader && !showAuthority">
        <a-form :form="form">
          <a-col :span="24" v-if="!editInfo.id">
            <a-form-item label="订单产品"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-select showSearch
                        :filterOption="filterOption"
                        v-decorator="['goods_id',
                        { rules: [{   required: true, message: '请选择订单产品!' }]}]"
                        placeholder="请选择订单产品"
              >
                <a-select-option  v-for="item in goodsList" :value="item.id" :key="item.id">
                  {{item.goods_name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="!editInfo.id">
            <a-form-item label="下单商户"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-select showSearch
                        :filterOption="filterOption"
                        v-decorator="['merchant_id',
                        { rules: [{   required: true, message: '请选择下单商户!' }]}]"
                        placeholder="请选择下单商户"
              >
                <a-select-option  v-for="item in merchantList" :value="item.id" :key="item.id">
                  {{item.merchant_username}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="购买数量"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-input-number v-decorator="[
                                             'order_num',
                                             {  initialValue: editInfo.order_num || undefined,
                                                rules: [
                                                 {   required: true, message: '请添加购买数量(个)!' }] }
                                                ]"
                              placeholder="请添加购买数量(个)" :min="1">
              </a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="预计交付时间"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-date-picker
                v-decorator="[
                  'produce_end_time',
                 {  initialValue: editInfo.produce_end_time && $moment(editInfo.produce_end_time, 'YYYY-MM-DD hh:mm:ss') || undefined,
                 rules: [{   required: true, message: '请选择预计交付时间!' }] }]"
                format="YYYY-MM-DD hh:mm:ss"
                :disabledDate="disabledDate"
                :disabledTime="disabledDateTime"
                :showTime="{ defaultValue: $moment('00:00:00', 'HH:mm:ss') }"
                placeholder="请选择预计交付时间"
              />
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
  import SearchMerchant from "@/views/merchant/SearchMerchant"
  import { moneyFormat } from "../../filters";
  import { mapMutations } from 'vuex';
  import {
    reqAllAuthority,
    reqAllGroup,  reqSingleAuthority,
  } from "../../api/staff";
  import {
    reqAddOrder, reqAllMerchant, reqDeleteOrder, reqHandleOrder,
    reqOrderList, reqUpdateOrder
  } from "../../api/merchant";
  import {reqAllGoods} from "../../api/goods";
  import SearchOrder from "./SearchOrder";
  import {reqDeleteProduceGoods} from "../../api/produce";
  export default {
    name: "Order",
    data () {
      return {
        columns: [],
        showHeader: false,
        drawerVisible: false,
        searchLoading: false,
        showAuthority: false,
        searchCondition: {},
        showLeader: false,
        checkedAuthority: [],
        drawerWidth: '450',
        imgUrl: '',
        uploading: false,
        showGroup: false,
        editInfo:{},
        defaultColumns: [{
          id: 1,
          name: 'id',
          title: '订单号'
        },  {
          id: 2,
          name: 'good.goods_name',
          title: '订单产品'
        }, {
          id: 3,
          name: 'merchant.merchant_username',
          title: '下单商户',
        },  {
          id: 4,
          name: 'order_num',
          title: '购买数量',
        }, {
          id: 5,
          name: 'order_price',
          title: '订单总价',
          scopedSlots: true,
        }, {
          id: 6,
          name: 'order_status',
          title: '订单状态',
          scopedSlots: true,
        }, {
          id: 7,
          name: 'order_time',
          title: '下单时间',
        }, {
          id: 8,
          name: 'handle_time',
          title: '预计交付时间',
        }],
        options: [  { label: '订单号', value: 'id' },
          { label: '订单产品', value: 'good.goods_name' },
          { label: '下单商户', value: 'merchant.merchant_username' },
          { label: '购买数量', value: 'order_num' },
          { label: '订单总价', value: 'order_price' },
          { label: '订单状态', value: 'order_status' },
          { label: '下单时间', value: 'order_time' },
          { label: '预计交付时间', value: 'handle_time'}],
        showColumns: [],
        dataSource: [],
        initLoading: false,
        tableValue: '',
        title: '交付管理',
        tableId: '',
        visible: false,
        confirmLoading: false,
        tableLoading: false,
        modalTitle: '新增订单',
        detailUse: [],
        merchantList: [],
        authorityList: [],
        goodsList: [],
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
        const result_category = await reqOrderList({
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
      handleTableChange (pagination) {
        this.pagination.current = pagination.current;
        this.getTableData();
      },
      changeValue (value) {
        this.tableValue = value;
      },
      changeGroup (value) {
        if (value){
          this.showLeader = true;
        } else {
          this.showLeader = false;
        }
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
        Modal.confirm({
          title: '交付订单',
          content: '确定要交付该订单吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            reqHandleOrder({
              id: tagGroup.id,
            }).then( res  => {
              const { code, message } = res.data;
              code === 0 && this.$message.success(message) && this.getTableData();
              code !== 0 && this.$message.error(message);
            });
          }
        })
      },
      showTag (tagGroup) {
        this.$router.push({ path: "/auth/produceGoods", query: { order: tagGroup }});
      },
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      },
      deleteOperation (tagGroup) {
        Modal.confirm({
          title: '删除订单',
          content: '确定要删除该订单吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            reqDeleteOrder({
              ids: [tagGroup.id]
            }).then( res  => {
              const { code, message } = res.data;
              code === 0 && this.$message.success(message) && this.getTableData();
              code !== 0 && this.$message.error(message);
            });
          }
        })
      },
      async getAllGroup () {
        const result = await reqAllGroup();

        const { code, message, data } = result.data;

        if (code === 0){
          this.groupList = data;
        } else {
          this.$message.error(message);
        }
      },
      async getAllMerchant () {
        const result = await reqAllMerchant();
        const { code, message, data } = result.data;

        if (code === 0){
          this.merchantList = data;
        } else {
          this.$message.error(message);
        }
      },
      async getAllAuthority () {
        const result = await reqAllAuthority();
        const { code, message, data } = result.data;
        if (code === 0){
          this.authorityList = [];
          data.map( item => {
            this.authorityList.push(
              { label: item['authority_name'], value: item['id'] }
            )
          });
        } else {
          this.$message.error(message);
        }
      },
      async authoritySet (staff){
        this.editInfo = staff;
        this.modalTitle = '权限设置';
        this.showHeader = false;
        this.showAuthority = true;
        await this.getSingleAuthority();
        this.visible = true;
      },
      deleteMany () {
        if (this.selectedId.length === 0){
          return this.$message.warning('请先选择批量删除项');
        }
        Modal.confirm({
          title: '批量删除订单',
          content: '确定要批量删除这些订单吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            reqDeleteOrder({
              ids: this.selectedId
            }).then( res  => {
              const { code, message } = res.data;
              code === 0 && this.$message.success(message) && this.getTableData();
              code !== 0 && this.$message.error(message);
            });
          }
        })
      },
      async getSingleAuthority () {
        const result = await reqSingleAuthority({
          staff_id: this.editInfo.id,
        });

        const { code, message, data } = result.data;

        if (code === 0){
          this.checkedAuthority = data.map( item => item['authority.id']);
        } else {
          this.$message.error(message);
        }
      },
      showSearchForm () {

      },
      addTagGroup () {
        this.modalTitle = '新增订单';
        this.editInfo = {};
        this.showHeader = false;
        this.showGroup = true;
        this.showAuthority = false;
        this.showLeader = false;
        this.visible = true;
      },
      showTable () {
        this.drawerVisible = true;
      },
      async getAllGoods () {
        const result = await reqAllGoods();

        const { code, message, data } = result.data;

        if (code === 0){
          this.goodsList = data;
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
            values.handle_time = this.$moment(values.handle_time).format('YYYY-MM-DD hh:mm:ss');

            if (!this.editInfo.id){
              reqAddOrder(values).then( res => {
                const { code, message } = res.data;
                code === 0 && this.$message.success(message) && this.getTableData();
                code !== 0 && this.$message.error(message);
                this.confirmLoading = false;
                this.visible = false;
              })
            } else {
              values.id = this.editInfo.id;
              reqUpdateOrder(values).then( res => {
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
      handleCancel () {
        this.visible = false;
        this.checkedAuthority = [];
      },
      ...mapMutations(['changeDetailUse'])
    },
    filters: {
      moneyFormat (money) {
        return moneyFormat(money)
      }
    },
    components:{
      SearchOrder,
      Title,
      SearchMerchant
    },
    mounted() {
      this.getTableData();
      this.tableInit();
      this.getAllGroup();
      this.getAllGoods();
      this.getAllMerchant();
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
  .ant-calendar-picker{
    width: 220px !important;
  }
</style>
