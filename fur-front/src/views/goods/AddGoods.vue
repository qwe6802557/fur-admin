<template>
  <div id="add-form">
    <Title :title="'产品入库'"/>
    <div class="container">
      <div class="add-title">
        <i class="title-icon"/>
        基本信息
      </div>
      <a-form :form="form" style="width: 60%; overflow: hidden;">
        <a-col :span="12">
          <a-form-item label="产品名称"
                       :label-col="formItemLayout.labelCol"
                       :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-decorator="[
                                         'goods_name',
                                         { initialValue: $route.query.goods && $route.query.goods.goods_name || undefined,
                                           rules: [{
                                           required: true, message: '请输入产品名称'
                                           }]}
                                            ]"
                     placeholder="请输入产品名称">
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="单个售价"
                       :label-col="formItemLayout.labelCol"
                       :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-decorator="[
                                         'goods_sell',
                                         { initialValue: $route.query.goods && $route.query.goods.goods_sell || undefined,
                                           rules: [{
                                           required: true, message: '请输入单个售价'
                                           }]}
                                            ]"
                     placeholder="请输入单个售价">
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="产品图片"
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
          <a-form-item label="产品说明"
                       :label-col="formItemLayout.labelCol"
                       :wrapper-col="formItemLayout.wrapperCol">
            <a-textarea v-decorator="[
                                         'goods_info',
                                         {
                                             initialValue: $route.query.goods && $route.query.goods.goods_info || undefined,
                                         }
                                            ]"
                        placeholder="请输入产品说明"
                        :autoSize="{ minRows: 5, maxRows: 5 }">
            </a-textarea>
          </a-form-item>
        </a-col>
      </a-form>
      <div class="add-title" v-if="!$route.query.goods">
        <i class="title-icon"/>
        所需配件
      </div>
      <div v-if="!$route.query.goods">
        <div class="check-box-area">
          <div class="box-container">
            <!--<a-button type="link" icon="plus" @click="addMoreMaterial">保存添加配件</a-button>-->
            <a-form :form="form" style="width: 60%; overflow: hidden;">
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
  import {reqAllPackage} from "../../api/package";
  import {reqAddGoods, reqUpdateGoods} from "../../api/goods";
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
        this.$router.go(-1);
      },
      confirm () {

        this.form.validateFields( (err , values) => {
          if (err) {
            return false;
          }
          values.goods_image = this.imgUrl;

          if (this.$route.query.goods){
            this.confirmLoading = true;
            values.id  = this.$route.query.goods.id;
            reqUpdateGoods(values).then( res => {
              const { code, message } = res.data;
              code === 0 && this.$message.success(message) && this.$router.go(-1);
              code !== 0 && this.$message.error(message);
              this.confirmLoading = false;
              this.resetData();
            });
          } else {
            if (this.checkedHeader.length === 0){
              return this.$message.warning('请选择该产品花费的配件及数量');
            }
            this.confirmLoading = true;
            values.goods_package = this.addMoreMaterial();
            reqAddGoods(values).then( res => {
              const { code, message } = res.data;
              code === 0 && this.$message.success(message) && this.$router.go(-1);
              code !== 0 && this.$message.error(message);
              this.confirmLoading = false;
            });
          }
        })
      },
      async getAllCategory () {
        const result = await reqAllPackage();
        this.packageCategory = result.data.data;
        this.packageCategory.map(item => {
          this.options.push({
            label: item.package_name,
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
        const goods_package = [];
        this.options.map( item => {
          for ( const cItem of this.checkedHeader){
            item.label === cItem && goods_package.push({
              package_id: item.value,
              spend_num: item.count
            });
          }
        });
        return goods_package;
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
