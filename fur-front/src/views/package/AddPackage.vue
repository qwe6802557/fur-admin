<template>
  <div id="add-form">
    <Title :title="'配件入库'"/>
    <div class="container">
      <div class="add-title">
        <i class="title-icon"/>
        基本信息
      </div>
      <a-form :form="form" style="width: 60%; overflow: hidden;">
        <a-col :span="12">
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
          <a-col :span="12">
            <a-form-item label="配件用途"
                         :label-col="formItemLayout.labelCol"
                         :wrapper-col="formItemLayout.wrapperCol">
              <a-select
                v-decorator="[
                                                      'package_use',
                                                      { initialValue: $route.query.package && $route.query.package.package_use || undefined,
                                                        rules: [{ required: true, message: '请选择配件用途!' }] }
                                                    ]"
                placeholder="请选择配件用途"
              >
                <a-select-option v-for="item in detailUse" :value="item.id" :key="item.id">
                  {{item.use_name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        <a-col :span="12">
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
        <a-col :span="12">
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
      <div class="add-title" v-if="!$route.query.package">
        <i class="title-icon"/>
        所需原料
      </div>
      <div class="material-choose" v-if="!$route.query.package">
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
          <a-col :span="8">
            <a-button type="link" icon="plus" @click="addMoreMaterial">保存添加原料</a-button>
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
                 <a-input-number v-if="item.showNum"  v-model="item.count" placeholder="请添加原料数量(个)" :min="1">
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
  import { mapState, mapMutations } from 'vuex';
  import {reqAddPackage, reqAllCategory, reqAllMaterial, reqUpdatePackage} from "../../api/package";
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
        imgUrl: this.$route.query.package && this.$route.query.package.package_image || '',
        dataTypeLoading: false,
        confirmLoading: false,
        packageCategory: [],
        packageDetail: [],
        headers: {
          'Authorization': `Bear ` + this.$store.state.token
        },
        checkedHeader: [],
        options: [],
        category_id: ''
      }
    },
    methods: {
      cancel () {
        this.changePackageMaterial('');
        this.$router.go(-1);
      },
      confirm () {

        this.form.validateFields( (err , values) => {
          if (err) {
            return false;
          }
          this.confirmLoading = true;
          values.package_image = this.imgUrl;
          delete values.category_id;

         if (this.$route.query.package){
           values.id  = this.$route.query.package.id;
           reqUpdatePackage(values).then( res => {
             const { code, message } = res.data;
             code === 0 && this.$message.success(message) && this.$router.go(-1);
             code !== 0 && this.$message.error(message);
             this.confirmLoading = false;
             this.resetData();
             this.changePackageMaterial('');
           });
         } else {
           if (this.package_material.length === 0){
             this.confirmLoading = false;
             return this.$message.warning('请选择原料目录下所花费的原料及数量');
           }
           values.package_material = this.package_material;
           reqAddPackage(values).then( res => {
             const { code, message } = res.data;
             code === 0 && this.$message.success(message) && this.$router.go(-1);
             code !== 0 && this.$message.error(message);
             this.confirmLoading = false;
             this.resetData();
             this.changePackageMaterial('');
           });
         }
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
            showNum: false,
            count: 1
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
        this.category_id = value;
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
      },
      addMoreMaterial () {
        if (this.checkedHeader.length === 0){
          return this.$message.warning('请选择原料目录下所花费的原料及数量');
        }
        const package_material = [];
        this.options.map( item => {
          for ( const cItem of this.checkedHeader){
            item.label === cItem && package_material.push({
              material_id: item.value,
              spend_num: item.count
            });
          }
        });
        for ( const item of package_material){
          for( const cItem of this.package_material){
            for( const dItem of cItem.package_material){
              if (dItem.material_id === item.material_id){
                return  this.$message.warning('存在已添加过的原料,请检查!');
              }
            }
          }
        }
        this.changePackageMaterial({
          category_id: this.category_id,
          package_material
        });
        this.resetData();
        this.$message.success('已保存');
      },
      resetData () {
        this.checkedHeader = [];
        this.options.map( item => {
          item.showNum = false;
          item.count = 1;
        });
      },
      ...mapMutations(['changePackageMaterial'])
    },
    computed: {
      ...mapState(['detailUse', 'package_material'])
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
