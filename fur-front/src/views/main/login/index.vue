<template>
       <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
         <el-form-item label="账号" prop="username">
           <img src="../../../assets/user.png" alt="用户名">
           <el-input v-model="ruleForm.username" type="text">
           </el-input>
         </el-form-item>
         <el-form-item label="密码" prop="password">
           <img src="../../../assets/password.png" alt="密码">
           <el-input v-model="ruleForm.password" type="password">
           </el-input>
         </el-form-item>
         <el-form-item label="验证码" prop="valiateWord" class="valiateWord">
           <img src="../../../assets/valiate.png" alt="验证码" />
           <el-input v-model="ruleForm.valiateWord" type="text" class="valiateInput">
           </el-input>
           <div class="valiate-area" id="valiate" @click="getValiateImg">
           </div>
         </el-form-item>
         <el-form-item>
           <el-button type="primary" @click="toLogin">登录</el-button>
           <el-button type="primary" @click="toRegistor">注册</el-button>
         </el-form-item>
         <span class="reset">忘记密码?<a href="#" @click.prevent="toResetPw" class="resetPw">找回密码</a></span>
       </el-form>
</template>

<script>
  import {reqValiateImg,reqLogin} from "../../../api";
  import {Message} from 'element-ui';
  import memoryUntil from '@/untils/memoryUntil';
  import storeUntil from '@/untils/storeUntil';
  export default {
        name: "Login",
        data(){
          return {
              ruleForm:{
              username:'',
              password:'',
              identity:'0',
              valiateWord:''
            },
            rules:{
              username:[
                { required: true, message: '请输入账号！', trigger: 'blur' },
                { min: 3,message: '账号长度不能小于3个字符', trigger: 'blur' },
                /*{pattern:/^[a-zA-Z0-9_]+$/,message: '用户名必须是英文丶数字或下划线组成',trigger: 'blur'}*/
              ],
              password:[
                { required: true, message: '请输入密码！', trigger: 'blur' },
                { min: 3, max: 12, message: '密码长度在 3 到 12 个字符', trigger: 'blur' }
              ],
              valiateWord:[
                {required:true,message:'请输入验证码！',trigger:'blur'}
                ]
            }
          }
        },
      mounted(){
      this.getValiateImg();
      },
      methods:{
        toLogin(){
          this.$refs['ruleForm'].validate((boolean)=>{
            if (boolean==true){
              const {username,password,valiateWord}=this.ruleForm;
              reqLogin({
                username,
                password,
                verify_code:valiateWord
              }).then(res=>{
                const {code,message,token}=res.data;
                if (code===0){
                  Message.success(message);
                  this.$router.push({name:'Admin'});
                  memoryUntil.token=token;
                  storeUntil.setToken(token);
                  setTimeout(()=>{
                    memoryUntil.token=null;
                  },12*60*1000);
                }else {
                  Message.error(message);
                  this.getValiateImg();
                }
              }).catch(err=>{
                Message.error(err);
              })
            }else {
              Message.error('请您输入正确的信息！')
            }
          })
        },
        toRegistor(){
          this.$router.push({name:'Registor'})
        },
        toResetPw(){
          this.$router.push({name:'Reset'})
        },
        getValiateImg(){
          reqValiateImg().then(res=>{
            document.getElementById('valiate').innerHTML=res.data;
      })
        }
      }
    }
</script>

<style>

</style>
