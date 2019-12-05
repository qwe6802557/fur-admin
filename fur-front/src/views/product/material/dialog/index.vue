<template>
  <div class="dialog">
    <el-dialog
      :title="title"
      :visible.sync="FormVisible"
      width="30%"
      center>
      <span>
        <el-form :model="categoryForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-if="!showFlag">
          <el-form-item label="列表名称" prop="category_name">
              <el-input v-model="categoryForm.category_name"></el-input>
          </el-form-item>
            <el-form-item label="列表说明" prop="category_info">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                :autosize="{ minRows:6,maxRows: 6}"
                v-model="categoryForm.category_info">
              </el-input>
            </el-form-item>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-else>
          <el-form-item label="配件名称" prop="material_name">
              <el-input v-model="ruleForm.material_name"></el-input>
          </el-form-item>
          <el-form-item label="配件单价" prop="material_price" >
              <el-input v-model="ruleForm.material_price" class="goods_price"></el-input>
          </el-form-item>
          <el-form-item label="配件库存" prop="material_num" >
            <el-input-number v-model="ruleForm.material_num" :min="0">
          </el-input-number>
          </el-form-item>
            <el-form-item label="配件说明" prop="material_info">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                :autosize="{ minRows:6,maxRows: 6}"
                v-model="ruleForm.material_info">
              </el-input>
            </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="confirm">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
    import {Message} from 'element-ui';
    export default {
        name: "MaterialDialog",
        data(){
          return {
              id:'',
              showFlag:false,
              title:'添加列表',
              FormVisible:false,
              ruleForm:{
                material_name:'',
                material_info:'',
                material_price:'',
                material_num:''
              },
              categoryForm:{
                category_name:'',
                category_info:''
              },
              rules:{
                material_name:[{
                required:true,
                message:'请输入配件名称！'
              }],
                material_price:[{
                  required:true,
                  message:'请输入配件单价！'
              }],
                material_num:[{
                  required:true,
                  message:'请输入配件数量！'
              }],
                material_info:[
                  {
                    required:true,
                    message:'请输入配件说明！'
                  }
                ],
                category_name:[
                  { required:true,
                    message:'请输入列表名称！'}
                ],
                category_info:[
                  {
                    required:true,
                    message:'请输入列表说明！'
                  }
                ]
            }
          }
        },
      methods:{
        //取消按钮点击函数
        cancel(){
          this.FormVisible=false;
         },
        //确定按钮点击函数
         confirm(){
           this.$refs['ruleForm'].validate((boolean)=>{
             if (boolean===true){
               if (!this.showFlag){
                 this.$emit('tableChange',this.categoryForm);
               }else{
                 this.$emit('tableChange',this.ruleForm,this.id);
               }

             }else{
               Message.error('请您输入正确的信息！');
             }
           })
        },
        //重置表单数据函数
        resetFields(){  //重置表单内容操作 传给父组件执行
           this.$refs['ruleForm'].resetFields();
        }
      },
      watch:{
          //检测单个编辑数据变化
       /*singleData(val){
         let newForm={}
         for(let item in val){
          if (item!=='id'){
            newForm[item]=val[item];
          }
         }
         this.id=val.id;
         this.ruleForm=newForm;
        },*/
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
