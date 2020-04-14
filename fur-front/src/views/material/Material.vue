<template>
  <div id="tag">
    <Title :title="title"/>
    <div class="button-area">
      <a-button type="primary" icon="search" @click="showTable">筛选查询</a-button>
      <a-button type="danger" icon="delete" @click="deleteMany">批量删除</a-button>
      <a-button icon="plus" @click="addTagGroup">原料入库</a-button>
      <a-button type="primary" icon="pushpin" @click="changeHeader">筛选显示</a-button>
      <a-button type="dashed" icon="left" style="float: right;margin-right: 0;" @click="$router.go(-1)">返回原料目录</a-button>
    </div>
    <a-spin :spinning="initLoading" tip="获取目录数据中...">
      <a-table class="tag-table"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :rowSelection="rowSelection"
               :rowKey="'id'"
               @change="handleTableChange">
                <span slot="detail_price" slot-scope="detail_price">
                    {{ detail_price | moneyFormat}}
                </span>
                <span slot="detail_status" slot-scope="detail_status">
                      <a-tag :color="detail_status === '1'? 'geekblue' : 'volcano'">
                        {{detail_status === '1'? '可用' : '不可用'}}
                      </a-tag>
                </span>
        <template slot="operation" slot-scope="text">
          <a href="javascript:;" @click="editOperation(text)">编辑</a>
          <a href="javascript:;" @click="showTag(text)">查看详情</a>
          <a href="javascript:;" @click="deleteOperation(text)">删除</a>
        </template>
      </a-table>
    </a-spin>
    <div class="form-drawer">
      <a-drawer :title="'筛选原料'"
                :closable="false"
                :visible="drawerVisible"
                @close="drawerClose"
                :drawerStyle="{background:'#F8FAFC'}"
                :width="drawerWidth"
      >
        <div class="form-content">
          <SearchMaterial :searchLoading="searchLoading" @search="search" ref="searchCategory"/>
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
             :okText="'入库'"
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
            <a-form-item label="原料名称"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-input v-decorator="[
                                             'detail_name',
                                             {   initialValue: editInfo.detail_name || undefined,
                                                 rules: [
                                                 {   required: true, message: '请输入原料名称!' }] }
                                                ]"
                       placeholder="请输入原料名称">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="原料价格"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-input v-decorator="[
                                             'detail_price',
                                             {   initialValue: editInfo.detail_price || undefined,
                                                 rules: [
                                                 {   required: true, message: '请输入原料价格(元)!' }] }
                                                ]"
                       placeholder="请输入原料价格(元)">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="原料数量"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-input-number v-decorator="[
                                             'detail_num',
                                             {  initialValue: editInfo.detail_num || undefined,
                                                rules: [
                                                 {   required: true, message: '请添加原料数量(个)!' }] }
                                                ]"
                       placeholder="请添加原料数量(个)" :min="1">
              </a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="原料图片"
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
            <a-form-item label="原料说明"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-textarea v-decorator="[
                                             'detail_info',
                                             {   initialValue: editInfo.detail_info || undefined,
                                                 }
                                                ]"
                          placeholder="请输入原料描述"
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
  import SearchMaterial from "@/views/material/SearchMaterial"
  import {
    reqCategoryDetailAdd, reqCategoryDetailDelete,
    reqCategoryDetailEditPost, reqCategoryDetailQuery
  } from "../../api";
  import { moneyFormat } from "../../filters";

  export default {
    name: "Material",
    data () {
      return {
        columns: [],
        showHeader: false,
        drawerVisible: false,
        searchLoading: false,
        searchCondition: {},
        drawerWidth: '500',
        editInfo:{},
        imgUrl: '',
        detail_num: 1,
        uploading: false,
        category_id: this.$route.params.category_id,
        defaultColumns: [{
          id: 1,
          name: 'id',
          title: '序号'
        }, {
          id: 2,
          name: 'detail_name',
          title: '原料名称'
        }, {
          id: 3,
          name: 'detail_info',
          title: '原料说明'
        }, {
          id: 4,
          name: 'detail_price',
          title: '原料价格(元)',
          scopedSlots: true
        }, {
          id: 5,
          name: 'detail_num',
          title: '原料数量(个)',
        }, {
          id: 6,
          name: 'detail_status',
          title: '原料状态',
          scopedSlots: true
        }, {
          id: 7,
          name: 'detail_time',
          title: '入库时间'
        }],
        options: [  { label: '序号', value: 'id' },
          { label: '原料名称', value: 'detail_name' },
          { label: '原料说明', value: 'detail_info' },
          { label: '原料价格(元)', value: 'detail_price' },
          { label: '原料数量(个)', value: 'detail_num' },
          { label: '原料状态', value: 'detail_status'},
          { label: '入库时间', value: 'detail_time' }],
        showColumns: [],
        dataSource: [],
        initLoading: false,
        tableValue: '',
        selectValue: [],
        tableHeader: [],
        title: '原料管理',
        tableId: '',
        visible: false,
        confirmLoading: false,
        tableLoading: false,
        modalTitle: '原料入库',
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
        const result_category = await reqCategoryDetailQuery({
          ...this.searchCondition,
          category_id: this.category_id,
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
        this.modalTitle = '编辑原料';
        this.showHeader = false;
        this.editInfo = tagGroup;
        this.imgUrl = tagGroup.detail_image;
        this.visible = true;
      },
      showTag (tagGroup) {
        this.$router.push({ path: '/auth/materialDetail', query: { detail: tagGroup } });
      },
      deleteOperation (tagGroup) {
        Modal.confirm({
          title: '删除原料',
          content: '确定要删除 ' + tagGroup.detail_name + ' 吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            reqCategoryDetailDelete({
              ids: [tagGroup.id],
              category_id: this.$route.params.category_id,
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
          title: '批量删除原料',
          content: '确定要批量删除这些原料吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            reqCategoryDetailDelete({
              ids: this.selectedId,
              category_id: this.$route.params.category_id,
            }).then( res  => {
              const { code, message } = res.data;
              code === 0 && this.$message.success(message) && this.getTableData();
              code !== 0 && this.$message.error(message);
            });
          }
        })
      },
      addTagGroup () {
        this.modalTitle = '原料入库';
        this.editInfo = {};
        this.showHeader = false;
        this.imgUrl = '';
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
            values.category_id = this.category_id;
            values.detail_image = this.imgUrl;
            if (!this.editInfo.id){
              reqCategoryDetailAdd(values).then( res => {
                const { code, message } = res.data;
                code === 0 && this.$message.success(message) && this.getTableData();
                code !== 0 && this.$message.error(message);
                this.confirmLoading = false;
                this.visible = false;
              })
            } else {
              values.id = this.editInfo.id;
              reqCategoryDetailEditPost(values).then( res => {
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
      beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          this.$message.error('只能上传jpeg/png文件!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('图片大小不能超过2MB!');
        }
        return isJpgOrPng && isLt2M;
      }
    },
    filters: {
      moneyFormat (money) {
        return moneyFormat(money)
      }
    },
    components:{
      Title,
      SearchMaterial
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
  .ant-input-number{
    width: 100% !important;
    background: #F7F9FA !important;
    &:focus{
      background: #ffffff !important;
    }
  }
</style>
