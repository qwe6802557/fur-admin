<template>
  <div id="add-form">
    <Title :title="'配件入库'"/>
    <div class="container">
      <div class="add-title">
        <i class="title-icon"/>
        基本信息
      </div>
      <a-form :form="form" style="width: 80%; overflow: hidden;">
        <a-col :span="8">
          <a-form-item label="配件名称"
                       :label-col="formItemLayout.labelCol"
                       :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-decorator="[
                                         'package_name',
                                         { initialValue: $route.query.package && $route.query.package.package_name || undefined,
                                           rules: [{
                                           required: true, message: '请输入配件名称'
                                           }]}
                                            ]"
                     placeholder="请输入配件名称">
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="配件数量"
                       :label-col="formItemLayout.labelCol"
                       :wrapper-col="formItemLayout.wrapperCol">
            <a-input-number v-decorator="[
                                             'package_num',
                                             {  initialValue: $route.query.package && $route.query.package.package_num,
                                                rules: [
                                                 {   required: true, message: '请添加配件数量(个)!' }] }
                                                ]"
                            placeholder="请添加配件数量(个)" :min="1">
            </a-input-number>
          </a-form-item>
        </a-col>
          <a-col :span="8">
            <a-form-item label="配件用途"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-select
                v-decorator="[
                                                      'package_use',
                                                      { rules: [{ required: true, message: '请选择配件用途!' }] }
                                                    ]"
                placeholder="请选择配件用途"
              >
                <a-select-option v-for="item in detailUse" :value="item.id" :key="item.id">
                  {{item.use_name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        <a-col :span="8">
          <a-form-item label="配件图片"
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
        <a-col :span="8">
          <a-form-item label="配件说明"
                       :label-col="formItemLayout.labelCol"
                       :wrapper-col="formItemLayout.wrapperCol">
            <a-textarea v-decorator="[
                                         'package_info',
                                         {
                                             initialValue: $route.query.package && $route.query.package.package_info || undefined,
                                         }
                                            ]"
                     placeholder="请输入配件说明"
                    :autoSize="{ minRows: 5, maxRows: 5 }">
            </a-textarea>
          </a-form-item>
        </a-col>
      </a-form>
      <div class="add-title">
        <i class="title-icon"/>
        所需原料
      </div>
      <div class="material-choose">
        <a-form :form="form" style="width: 80%; overflow: hidden;">
          <a-col :span="8">
            <a-form-item label="原料目录"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-select
                v-decorator="[
                                                      'category_id',
                                                      { rules: [{ required: true, message: '请选择原料目录!' }] }
                                                    ]"
                placeholder="请选择原料目录"
                @change="changeCategory"
              >
                <a-select-option v-for="item in packageCategory" :value="item.id" :key="item.id">
                  {{ item.category_name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-form>
      </div>
      <div>
        <div class="check-box-area">
         <div class="box-container">
           <a-form :form="form" style="width: 80%; overflow: hidden;">
             <el-checkbox-group v-model="checkedHeader" @change="handleCheckedCitiesChange">
               <a-col v-for="item in options" :key="item.value" class="check-area-col">
                 <el-checkbox  :label="item.label" :value="item.value"/>
                 <a-input-number v-if="item.showNum" v-decorator="[
                                               item.label,
                                               {  initialValue: $route.query.package && $route.query.package.package_num,
                                                  rules: [
                                                   {   required: true, message: '请添加原料数量(个)!' }] }
                                                  ]"
                                 placeholder="请添加原料数量(个)" :min="1">
                 </a-input-number>
               </a-col>
             </el-checkbox-group>
           </a-form>
         </div>
        </div>
      </div>
    </div>
    <div class="modal-button">
      <a-button shape="round" type="primary" id="cancelButton" @click="cancel">取消</a-button>
      <a-button shape="round" type="primary" id="okButton" @click="confirm" :loading="confirmLoading">确定</a-button>
    </div>
  </div>
</template>

<script>
  import Title from '@/components/contentTitle';
  import { mapState } from 'vuex';
  import {reqAllCategory, reqAllMaterial} from "../../api/package";
  export default {
    name: "AddWords",
    data () {
      return {
        form: this.$form.createForm(this),
        formItemLayout: {
          labelCol: { span: 7 },
          wrapperCol: { span: 15 }
        },
        showIndex: false,
        dataType: [],
        uploading: false,
        imgUrl: '',
        dataTypeLoading: false,
        confirmLoading: false,
        packageCategory: [],
        packageDetail: [],
        headers: {
          'Authorization': `Bear ` + this.$store.state.token
        },
        checkedHeader: [],
        options: []
      }
    },
    methods: {
      cancel () {
        this.$router.go(-1);
      },
      confirm () {
        this.confirmLoading = true;
        this.form.validateFields( (err , values) => {
          if (err) {
            this.confirmLoading = false;
            return false;
          }
          values.hasIndex = !!Number(values.hasIndex);
          values.showColumn = !!Number(values.showColumn);
          values.tableId = this.$route.query.tableId;
          values.dataType = values.dataType - 1;

        })
      },
      async getAllCategory () {
        const result = await reqAllCategory();
        this.packageCategory = result.data.data;
      },
      async getMaterialList (category_id) {
        const result = await reqAllMaterial({
          category_id
        });
        this.packageDetail = [];
        this.options = [];
        this.packageDetail = result.data.data;
        this.packageDetail.map(item => {
          this.options.push({
            label: item.detail_name,
            value: item.id,
            showNum: false
          })
        })
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
      },
      changeCategory (value) {
        this.getMaterialList(value);
      },
      handleCheckedCitiesChange (value) {
        this.options.map( cItem => {
          cItem.showNum = false;
          value.map( item => {
            if (item === cItem.label){
              cItem.showNum = true;
            }
          });
        });
      }
    },
    computed: {
      ...mapState(['detailUse'])
    },
    components: {
      Title
    },
    mounted() {
      this.getAllCategory();
    }
  }
</script>

<style lang="less">
#add-form{
    .ant-input-number{
      width: 100% !important;
      background: #F7F9FA !important;
      &:focus{
        background: #ffffff !important;
      }
  }
  .check-box-area {
    .ant-input-number {
      width: 60% !important;
      background: #F7F9FA !important;
      margin-left: 15px;
      &:focus {
        background: #ffffff !important;
      }
    }
  }
  .check-area-col{
    display: inline-block;
    margin-left: 20px;
    .box-container{
        display: flex;
        flex-direction: row;
        align-items: center;
        max-width: 33.3%;
    }
  }
}
</style>
