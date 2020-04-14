<template>
  <div id="tag">
    <Title :title="title"/>
    <div class="button-area">
      <a-button type="primary" icon="search" @click="showTable">筛选查询</a-button>
      <a-button type="danger" icon="delete" @click="deleteMany">批量删除</a-button>
      <a-button icon="plus" @click="addTagGroup">新增商户</a-button>
      <a-button type="primary" icon="pushpin" @click="changeHeader">筛选显示</a-button>
    </div>
    <a-spin :spinning="initLoading" tip="获取商户数据中...">
      <a-table class="tag-table"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :rowSelection="rowSelection"
               :rowKey="'id'"
               @change="handleTableChange">
                <span slot="group.group_name" slot-scope="group">
                    {{group || '-'}}
                </span>
        <span slot="goods_price" slot-scope="goods_price">
                    {{ goods_price | moneyFormat}}
                </span>
        <template slot="operation" slot-scope="text">
          <a href="javascript:;" @click="editOperation(text)">修改地址</a>
          <a href="javascript:;" @click="showTag(text)">查看详情</a>
          <a href="javascript:;" @click="deleteOperation(text)">删除</a>
        </template>
      </a-table>
    </a-spin>
    <div class="form-drawer">
      <a-drawer :title="'筛选商户'"
                :closable="false"
                :visible="drawerVisible"
                @close="drawerClose"
                :drawerStyle="{background:'#F8FAFC'}"
                :width="drawerWidth"
      >
        <div class="form-content">
          <SearchMerchant :searchLoading="searchLoading" @search="search" ref="searchCategory" :groupList="groupList"/>
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
            <a-form-item label="商户账号"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-input v-decorator="[
                                             'merchant_username',
                                             {  initialValue: editInfo.merchant_username || undefined,
                                                rules: [
                                                 {   required: true, message: '请输入商户账号!' }] }
                                                ]"
                       placeholder="请输入商户账号" :min="0" :max="10">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="!editInfo.id">
            <a-form-item label="登录密码"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-input v-decorator="[
                                             'merchant_password',
                                             {  initialValue: editInfo.merchant_password || undefined,
                                                rules: [
                                                 {   required: true, message: '请输入登录密码!' }] }
                                                ]"
                       placeholder="请输入登录密码">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="!editInfo.id">
            <a-form-item label="手机号"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-input v-decorator="[
                                             'merchant_phone',
                                             {  initialValue: editInfo.merchant_phone || undefined,
                                                rules: [
                                                 {   required: true, message: '请输入手机号!' }] }
                                                ]"
                       placeholder="请输入手机号">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="!editInfo.id">
            <a-form-item label="邮箱"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-input v-decorator="[
                                             'merchant_eMail',
                                             {  initialValue: editInfo.merchant_eMail || undefined,
                                                rules: [
                                                 {   required: true, message: '请输入邮箱!' }] }
                                                ]"
                       placeholder="请输入邮箱">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="showGroup">
            <a-form-item label="地址"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-input v-decorator="[
                                             'merchant_address',
                                             {  initialValue: editInfo.merchant_address || undefined }
                                                ]"
                       placeholder="请输入地址">
              </a-input>
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
  import {reqAddMerchant, reqDeleteMerchant, reqMerchantList, reqUpdateMerchant} from "../../api/merchant";
  export default {
    name: "Merchant",
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
          title: '序号'
        },  {
          id: 2,
          name: 'merchant_username',
          title: '商户账号'
        }, {
          id: 3,
          name: 'merchant_phone',
          title: '手机号',
          scopedSlots: true,
        },  {
          id: 4,
          name: 'merchant_eMail',
          title: '邮箱',
          scopedSlots: true,
        },  {
          id: 5,
          name: 'merchant_address',
          title: '地址'
        }, {
          id: 6,
          name: 'merchant_time',
          title: '注册时间',
        }],
        options: [  { label: '序号', value: 'id' },
          { label: '商户账号', value: 'merchant_username' },
          { label: '手机号', value: 'merchant_phone' },
          { label: '邮箱', value: 'merchant_eMail' },
          { label: '地址', value: 'merchant_address' },
          { label: '注册时间', value: 'merchant_time' },],
        showColumns: [],
        dataSource: [],
        initLoading: false,
        tableValue: '',
        title: '商户管理',
        tableId: '',
        visible: false,
        confirmLoading: false,
        tableLoading: false,
        modalTitle: '新增商户',
        detailUse: [],
        groupList: [],
        authorityList: [],
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
        const result_category = await reqMerchantList({
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
        this.modalTitle = '修改分组';
        this.editInfo = tagGroup;
        this.showHeader = false;
        this.showAuthority = false;
        this.showGroup = true;
        if (tagGroup.group_id){
          this.showLeader = true;
        }
        this.visible = true;
      },
      showTag (tagGroup) {
        this.$router.push("/auth/merchant/detail/" + tagGroup.id);
      },
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      },
      deleteOperation (tagGroup) {
        Modal.confirm({
          title: '删除商户',
          content: '确定要删除 ' + tagGroup.merchant_username + ' 吗?将会删除该商户的订单及关联生产计划',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            reqDeleteMerchant({
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
          title: '批量删除商户',
          content: '确定要批量删除这些商户吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            reqDeleteMerchant({
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
        this.modalTitle = '新增商户';
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
                reqAddMerchant(values).then( res => {
                  const { code, message } = res.data;
                  code === 0 && this.$message.success(message) && this.getTableData();
                  code !== 0 && this.$message.error(message);
                  this.confirmLoading = false;
                  this.visible = false;
                })
              } else {
                values.id = this.editInfo.id;
                reqUpdateMerchant(values).then( res => {
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
      Title,
      SearchMerchant
    },
    mounted() {
      this.getTableData();
      this.tableInit();
      this.getAllGroup();
      this.getAllAuthority();
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
  #detail_time{
    width: auto !important;
  }
</style>
