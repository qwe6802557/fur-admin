<template>
  <div id="tag">
    <Title :title="title"/>
    <div class="button-area">
      <a-button type="primary" icon="search" @click="showTable">筛选查询</a-button>
      <a-button type="danger" icon="delete" @click="deleteMany">批量删除</a-button>
      <a-button icon="plus" @click="addTagGroup">新增员工</a-button>
      <a-button type="primary" icon="pushpin" @click="changeHeader">筛选显示</a-button>
    </div>
    <a-spin :spinning="initLoading" tip="获取员工数据中...">
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
          <a href="javascript:;" @click="editOperation(text)" v-if="text['group.group_status'] === '0' || !text['group.group_status']">修改分组</a>
          <a href="javascript:;" @click="authoritySet(text)">权限设置</a>
          <!--<a href="javascript:;" @click="showTag(text)">查看详情</a>-->
          <a href="javascript:;" @click="deleteOperation(text)" v-if="text['group.group_status'] === '0' || !text['group.group_status']">删除</a>
        </template>
      </a-table>
    </a-spin>
    <div class="form-drawer">
      <a-drawer :title="'筛选员工'"
                :closable="false"
                :visible="drawerVisible"
                @close="drawerClose"
                :drawerStyle="{background:'#F8FAFC'}"
                :width="drawerWidth"
      >
        <div class="form-content">
          <SearchStaff :searchLoading="searchLoading" @search="search" ref="searchCategory" :groupList="groupList"/>
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
            <a-form-item label="员工名称"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-input v-decorator="[
                                             'staff_name',
                                             {   initialValue: editInfo.group_name || undefined,
                                                 rules: [
                                                 {   required: true, message: '请输入员工名称!' }] }
                                                ]"
                       placeholder="请输入员工名称">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="!editInfo.id">
            <a-form-item label="员工账号"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-input v-decorator="[
                                             'staff_username',
                                             {  initialValue: editInfo.staff_username || undefined,
                                                rules: [
                                                 {   required: true, message: '请输入员工账号!' }] }
                                                ]"
                              placeholder="请输入员工账号" :min="0" :max="10">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="!editInfo.id">
            <a-form-item label="登录密码"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-input v-decorator="[
                                             'staff_password',
                                             {  initialValue: editInfo.staff_password || undefined,
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
                                             'staff_phone',
                                             {  initialValue: editInfo.staff_phone || undefined,
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
                                             'staff_eMail',
                                             {  initialValue: editInfo.staff_eMail || undefined,
                                                rules: [
                                                 {   required: true, message: '请输入邮箱!' }] }
                                                ]"
                       placeholder="请输入邮箱">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="showGroup">
            <a-form-item label="所属分组"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-select showSearch
                        :filterOption="filterOption"
                        v-decorator="['group_id',
                                                              {    initialValue: editInfo.group_id || '' }
                                                            ]"
                        placeholder="请选择所属分组"
                        :disabled="!!editInfo.tableId"
                        @change="changeGroup"
              >
                <a-select-option  :value="''">
                  {{'请选择分组'}}
                </a-select-option>
                <a-select-option  v-for="item in groupList" :value="item.id" :key="item.id">
                  {{item.group_name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="showLeader">
            <a-form-item label="设为组长"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-radio-group v-decorator="[
                                                              'is_leader',
                                                              {    initialValue: editInfo['groupMembers.is_leader'] || '0',
                                                              }
                                                            ]"
                             >
                <a-radio :value="'1'">是</a-radio>
                <a-radio :value="'0'">否</a-radio>
              </a-radio-group>
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
  import SearchStaff from "@/views/staff/SearchStaff"
  import { moneyFormat } from "../../filters";
  import { mapMutations } from 'vuex';
  import {
    reqAddStaff,
    reqAllAuthority,
    reqAllGroup, reqAuthoritySet,
    reqDeleteStaff, reqSingleAuthority,
    reqStaffList,
    reqUpdateStaff
  } from "../../api/staff";
  export default {
    name: "StaffList",
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
          name: 'staff_name',
          title: '员工名称'
        }, {
          id: 3,
          name: 'staff_username',
          title: '员工账号',
          scopedSlots: true,
        },  {
          id: 4,
          name: 'staff_phone',
          title: '手机号',
          scopedSlots: true,
        }, {
          id: 5,
          name: 'staff_eMail',
          title: '邮箱',
        }, {
          id: 6,
          name: 'group.group_name',
          title: '所属分组',
          scopedSlots: true,
        }, {
          id: 7,
          name: 'staff_time',
          title: '入职时间'
        }],
        options: [  { label: '序号', value: 'id' },
          { label: '员工名称', value: 'staff_name' },
          { label: '员工账号', value: 'staff_username' },
          { label: '手机号', value: 'staff_phone' },
          { label: '邮箱', value: 'staff_eMail' },
          { label: '所在分组', value: 'group.group_name' },
          { label: '入职时间', value: 'staff_time' },],
        showColumns: [],
        dataSource: [],
        initLoading: false,
        tableValue: '',
        title: '员工管理',
        tableId: '',
        visible: false,
        confirmLoading: false,
        tableLoading: false,
        modalTitle: '新增员工',
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
        const result_category = await reqStaffList({
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
        this.$router.push("/auth/goods/detail/" + tagGroup.id);
      },
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      },
      deleteOperation (tagGroup) {
        Modal.confirm({
          title: '删除员工',
          content: '确定要删除 ' + tagGroup.staff_name + ' 吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            reqDeleteStaff({
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
          title: '批量删除员工',
          content: '确定要批量删除这些员工吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            reqDeleteStaff({
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
        this.modalTitle = '新增员工';
        this.editInfo = {};
        this.showHeader = false;
        this.showGroup = false;
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
            if (this.showAuthority){
              reqAuthoritySet({
                staff_id: this.editInfo.id,
                ids: this.checkedAuthority,
              }).then( res => {
                const { code, message } = res.data;

                code === 0 && this.$message.success(message);
                code !== 0 && this.$message.error(message);

                this.visible = false;
                this.confirmLoading = false;
                this.checkedHeader = [];
              })
            } else {
              if (!this.editInfo.id){
                reqAddStaff(values).then( res => {
                  const { code, message } = res.data;
                  code === 0 && this.$message.success(message) && this.getTableData();
                  code !== 0 && this.$message.error(message);
                  this.confirmLoading = false;
                  this.visible = false;
                })
              } else {
                values.id = this.editInfo.id;
                reqUpdateStaff(values).then( res => {
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
      SearchStaff
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
    .ant-select-selection--single{
      background: #F7F9FA !important;
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
