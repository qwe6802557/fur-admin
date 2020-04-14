<template>
  <div id="tag">
    <Title :title="title"/>
    <div class="button-area">
      <a-button type="primary" icon="search" @click="showTable">筛选查询</a-button>
      <a-button type="danger" icon="delete" @click="deleteMany">批量删除</a-button>
      <a-button icon="plus" @click="addTagGroup">新增机器</a-button>
      <a-button type="primary" icon="pushpin" @click="changeHeader">筛选显示</a-button>
    </div>
    <a-spin :spinning="initLoading" tip="获取机器列表数据中...">
      <a-table class="tag-table"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :rowSelection="rowSelection"
               :rowKey="'id'"
               @change="handleTableChange">
                <span slot="machine_status" slot-scope="machine_status">
                    <a-tag :color="machine_status === '0'? 'geekblue' : 'volcano'">
                        {{machine_status === '0'? '待运行' : '运行中'}}
                    </a-tag>
                </span>
                <span slot="machine_price" slot-scope="machine_price">
                    {{ machine_price | moneyFormat}}
                </span>
               <span slot="machine_use" slot-scope="machine_use">
                 {{machine_use === '0'? '配件生产' : '产品生产'}}
                </span>
        <template slot="operation" slot-scope="text">
          <a href="javascript:;" @click="editOperation(text)" v-if="text.machine_status === '0'">编辑</a>
          <a href="javascript:;" @click="showTag(text)">查看详情</a>
          <a href="javascript:;" @click="deleteOperation(text)" v-if="text.machine_status === '0'">删除</a>
        </template>
      </a-table>
    </a-spin>
    <div class="form-drawer">
      <a-drawer :title="'筛选机器'"
                :closable="false"
                :visible="drawerVisible"
                @close="drawerClose"
                :drawerStyle="{background:'#F8FAFC'}"
                :width="drawerWidth">
        <div class="form-content">
          <SearchMachine :searchLoading="searchLoading" @search="search" ref="searchCategory"/>
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
            <a-form-item label="机器名称"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-input v-decorator="[
                                             'machine_name',
                                             {   initialValue: editInfo.machine_name || undefined,
                                                 rules: [
                                                 {   required: true, message: '请输入机器名称!' }] }
                                                ]"
                       placeholder="请输入机器名称">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="机器成本"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-input v-decorator="[
                                             'machine_price',
                                             {   initialValue: editInfo.machine_price || undefined,
                                                 rules: [
                                                 {   required: true, message: '请输入机器成本(元)!' }] }
                                                ]"
                       placeholder="请输入机器成本(元)">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="机器类型"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-select
                v-decorator="[  'machine_use' , {
                  initialValue: editInfo.machine_use || undefined,
                  rules: [{   required: true, message: '请输入机器名称!' }]
                } ]"
                placeholder="请选择机器类型"
                @change="typeChange"
              >
                <a-select-option value="0">
                  配件生产
                </a-select-option>
                <a-select-option value="1">
                  产品生产
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="机器用途"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol" v-if="showType">
              <a-select
                v-decorator="[  'machine_type', {
                  initialValue: editInfo.machine_type || undefined,
                  rules: [{
                    required: true, message: '请输入机器名称!' }]
                }]"
                placeholder="请选择机器用途"
              >
                <a-select-option :value="item.id" v-for=" item in detailUse" :key="item.id" v-if="item.id !== 9">
                  {{item.use_name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="机器图片"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-upload
                name="detail_image"
                listType="picture-card"
                class="avatar-uploader"
                :showUploadList="false"
                action="/upload"
                :beforeUpload="beforeUpload"
                :headers="headers"
                @change="handleChange"
              >
                <img v-if="imgUrl" :src="imgUrl" alt="avatar" />
                <div v-else>
                  <a-icon :type="uploading ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">点击上传</div>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="机器备注"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-textarea v-decorator="[
                                             'machine_info',
                                             {   initialValue: editInfo.machine_info || undefined,
                                                 }
                                                ]"
                          placeholder="请输入机器备注"
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
  import SearchMachine from "@/views/machine/SearchMachine"
  import { reqCategoryDetailUse} from "../../api";
  import { mapMutations } from 'vuex'
  import {reqAddMachine, reqDeleteMachine, reqMachineList, reqUpdateMachine} from "../../api/machine";
  import { moneyFormat } from "../../filters";

  export default {
    name: "Machine",
    data () {
      return {
        columns: [],
        showHeader: false,
        drawerVisible: false,
        searchLoading: false,
        uploading: false,
        showType: false,
        detailUse: [],
        drawerWidth: '450',
        imgUrl: '',
        editInfo:{},
        defaultColumns: [{
          id: 1,
          name: 'id',
          title: '机器编号'
        }, {
          id: 2,
          name: 'machine_name',
          title: '机器名称',
          scopedSlots: true
        },  {
          id: 3,
          name: 'machine_price',
          title: '机器成本',
          scopedSlots: true
        }, {
          id: 4,
          name: 'machine_use',
          title: '机器类型',
          scopedSlots: true,
        }, {
          id: 5,
          name: 'material_use.use_name',
          title: '机器用途'
        },{
          id: 6,
          name: 'machine_status',
          title: '运行状态',
          scopedSlots: true
        }, {
          id: 7,
          name: 'machine_time',
          title: '入库时间'
        }],
        options: [  { label: '机器编号', value: 'id' },
          { label: '机器名称', value: 'machine_name' },
          { label: '机器成本', value: 'machine_price' },
          { label: '机器类型', value: 'material_use.use_name' },
          { label: '机器用途', value: 'machine_type' },
          { label: '运行状态', value: 'machine_status' },
          { label: '入库时间', value: 'machine_time' }],
        showColumns: [],
        dataSource: [],
        initLoading: false,
        tableValue: '',
        selectValue: [],
        tableHeader: [],
        title: '机器管理',
        tableId: '',
        visible: false,
        confirmLoading: false,
        tableLoading: false,
        modalTitle: '新增机器',
        pagination: {
          total: 0,
          defaultCurrent: 1,
          pageSize: 10,
          current: 1,
          showSizeChange (pageSize) {
            this.pagination.pageSize = pageSize;
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
        },
        searchCondition: {}
      }
    },
    methods: {
      async getTableData (type) {
        if (!type){
          this.initLoading = true;
        } else {
          this.searchLoading = true;
        }
        const result_category = await reqMachineList({
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
      changeValue (value) {
        this.tableValue = value;
      },
      drawerClose () {
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
        this.modalTitle = '编辑机器';
        this.showHeader = false;
        this.editInfo = tagGroup;
        this.imgUrl = tagGroup.machine_image;
        this.showType = tagGroup.machine_use !== '0';
        this.visible = true;
      },
      showTag (tagGroup) {
        this.$router.push({ path: "/auth/machine/detail", query: { machine: tagGroup }});
      },
      deleteOperation (tagGroup) {
        Modal.confirm({
          title: '删除机器',
          content: '确定要删除 ' + tagGroup.machine_name + ' 吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            reqDeleteMachine({
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
          title: '批量删除机器',
          content: '确定要批量删除这些机器吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            reqDeleteMachine({
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
        this.modalTitle = '新增机器';
        this.imgUrl = '';
        this.editInfo = {};
        this.showHeader = false;
        this.showType = false;
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
            values.machine_image =  this.imgUrl;
            if (this.editInfo.id){
              values.id = this.editInfo.id;

              reqUpdateMachine(values).then( res => {
                const { code, message } = res.data;

                code === 0 && this.$message.success(message) && this.getTableData();
                code !== 0 && this.$message.error(message);

                this.confirmLoading = false;
                this.visible = false;
              });
            } else {
              reqAddMachine(values).then( res => {
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
      handleChange(info) {
        if (info.file.status === 'uploading') {
          this.uploading = true;
          return;
        }
        if (info.file.status === 'done') {
          const { code, message, url } = info.file.response;
          if (code === 0){
            this.$message.success(message);
            this.imgUrl = url;
          } else {
            this.$message.error(message);
          }
          this.uploading = false;
        }
      },
      beforeUpload (file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          this.$message.error('只能上传jpeg/png文件!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('图片大小不能超过2MB!');
        }
        return isJpgOrPng && isLt2M;
      },
      typeChange (value) {
        if (value === '0'){
          this.showType = false;
        } else {
          this.showType = true;
        }
      },
      search (searchCondition) {
        this.searchCondition = searchCondition;
        this.getTableData(1);
      },
      handleTableChange (pagination) {
        this.pagination.current = pagination.current;
        this.getTableData();
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
      SearchMachine
    },
    mounted() {
      this.tableInit();
      this.getTableData();
      this.getDetailUse();
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
  .ant-calendar-picker{
    width: auto !important;
  }
  .ant-input-number{
    width: 100% !important;
    background: #F7F9FA !important;
    &:focus{
      background: #ffffff !important;
    }
  }
</style>
