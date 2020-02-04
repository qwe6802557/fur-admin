<template>
  <div class="dialog">
    <el-dialog
      :title="title"
      :visible.sync="formVisible"
      width="30%"
      center>
      <span>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="配件名称" prop="detail_name">
              <el-input v-model="ruleForm.detail_name"></el-input>
          </el-form-item>
          <el-form-item label="配件价格" prop="detail_price">
              <el-input v-model="ruleForm.detail_price" class="goods_price"></el-input><span>&nbsp;元</span>
          </el-form-item>
          <el-form-item label="配件数量" prop="detail_num">
              <el-input-number v-model="ruleForm.detail_num" @change="handleChange" :min="1" :max="999" label="配件数量"></el-input-number>
          </el-form-item>
            <el-form-item label="配件图片" prop="detail_image">
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:7001/upload"
              name="file"
              :on-remove="handleRemove"
              :auto-upload="true"
              :headers="{Authorization:`Bearer ${token}`}"
              list-type="picture"
              :file-list="fileList"
              :limit="1"
              :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
            <el-form-item label="配件说明" prop="detail_info">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                :autosize="{ minRows:6,maxRows: 6}"
                v-model="ruleForm.detail_info">
              </el-input>
            </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="confirm">入库</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {reqDeletePic} from "../../../../api";
  import {Message} from 'element-ui';
  import Memory from '@/untils/memoryUntil'
  export default {
    name: "DetailDialog",
    props:['formVisible'/*,'flag','singleData'*/],
    data(){
      return {
        title:'配件入库',
        token:Memory.token,
        fileList: [{name: '默认图片.jpeg', url: 'http://127.0.0.1:7001/public/uploads/a0b762859636f4ae43b694d4edf10b2e.jpg'}],
        ruleForm:{
          detail_name:'',
          detail_info:'',
          detail_price:'',
          detail_image:'http://127.0.0.1:7001/public/uploads/a0b762859636f4ae43b694d4edf10b2e.jpg',
          detail_num:'',
        },
        rules:{
          detail_name:[{
            required:true,
            message:'请输入配件名称！'
          }],
          detail_price:[{
            required:true,
            message:'请输入配件单价！'
          }],
          detail_image:[
            {
              required:true,
              message:'请上传配件图片！'
            }
          ],
          detail_info:[{
            required:true,
            message:'请输入配件简介！'
          }],
          detail_num:[{
            required:true,
            message:'请输入配件数量！'
          }],
        }
      }
    },
    methods:{
      //重置上传列表函数
      resetFileList(){
        this.fileList=[{name: '默认图片.jpeg', url: 'http://127.0.0.1:7001/public/uploads/a0b762859636f4ae43b694d4edf10b2e.jpg'}];
        this.ruleForm.detail_image=this.fileList[0].url;
      },
      //取消按钮点击函数
      cancel(){
        this.$emit('visibleChange');
        this.resetFileList();
      },
      //确定按钮点击函数
      confirm(){
        this.$refs['ruleForm'].validate((boolean)=>{
          if (boolean===true){
            /*this.$emit('tableChange',this.ruleForm,this.resetFileList,this.resetFields,this.id);
            this.$emit('visibleChange');*/
          }else{
            Message.error('请您输入正确的信息！');
          }
        })
      },
      handleChange(value) {
        console.log(value);
      },
      //移除图片删除上传函数
      handleRemove(file) {
        if (!file.url){
          const url=file.response.url;
          reqDeletePic({url}).then(res=>{
            if (res.code===0){
              this.ruleForm.detail_image='';
            }
            return;
            Message.error(res.message);
          })
        }
      },
      //上传图片成功触发函数
      handleSuccess(response){
        if (response.code===0){
          this.ruleForm.detail_image = response.url;
        }else {
          Message.error(response.message);
        }
      },
      //重置表单数据函数
      resetFields(){
        this.$refs.ruleForm.resetFields();
      }
    },
    watch:{
      //检测单个编辑数据变化
      singleData:{
        handler(val){
          let newForm={}
          for(let item in val){
            if (item!=='id'){
              newForm[item]=val[item];
            }
          }
          this.id=val.id;
          this.ruleForm=newForm;
          this.fileList=[{name: newForm.detail_name+newForm.detail_image.substring(newForm.detail_image.lastIndexOf('.')), url: newForm.detail_image}];
        }
      },

      //检测点击添加或编辑变化
      flag(val){
        if (val===0){
          this.title='添加产品';
          this.id='';
          return;
        }
        this.title='编辑产品';
      }
    },
    mounted(){
      document.querySelector('.el-dialog__close').addEventListener('click',()=>{
        this.cancel();
      })
    }
  }
</script>

<style scoped>

</style>
<style lang="less">
  .dialog{
    .el-dialog{
      min-width: 700px;
      max-height: 78%;
      overflow: hidden;
    }
    .demo-ruleForm{
      width: 80%;
      margin: 0 auto;
    }
    .divide-line{
      text-align: center;
    }
    .is-bordered{
      margin-right: 7px;
      margin-left: 0 !important;
    }
    .goods_price{
      width: 50%;
    }
  }

</style>
