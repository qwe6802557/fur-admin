<template>
  <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="账号" prop="username">
      <img src="../../../assets/user.png" alt="用户名">
      <el-input v-model="ruleForm.username" type="text"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <img src="../../../assets/password.png" alt="密码">
      <el-input v-model="ruleForm.password" type="password"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPassword" class="confirmPass">
      <img src="../../../assets/password.png" alt="确认密码">
      <el-input v-model="ruleForm.checkPassword" type="password"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="eMail">
      <img src="../../../assets/password.png" alt="邮箱">
      <el-input v-model="ruleForm.eMail" type="text"></el-input>
    </el-form-item>
    <el-form-item label="手机号码" prop="mobile" class="confirmPass">
      <img src="../../../assets/password.png" alt="手机号">
      <el-input v-model="ruleForm.mobile" type="text"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="toRegistor">注册</el-button>
      <a href="#" @click.prevent="backLogin">返回登录</a>
    </el-form-item>
  </el-form>
</template>

<script>
  import {reqRegistor} from "@/api";
  import {Message} from 'element-ui'
  import memoryUntil from '@/untils/memoryUntil'
  import storeUntil from '@/untils/storeUntil'
  export default {
        name: "Registor",
        data(){
          var valiatePass=(rule, value, callback)=>{
            let {password,checkPassword}=this.ruleForm;
            if (value===''){
              callback(new Error('请确认密码！'));
            }else if(checkPassword!==password){
              callback(new Error('两次输入的密码不一致！'));
            }else {
              callback();
            }
          }
          return {
            ruleForm:{
              username:'',
              password:'',
              checkPassword:'',
              eMail:'',
              mobile:''
            },
            rules:{
              username:[
                { required: true, message: '请输入账号!', trigger: 'blur' },
                { min: 3,message: '账号长度不能小于3个字符', trigger: 'blur' },
                {pattern:/^[a-zA-Z0-9_]+$/,message: '用户名必须是英文丶数字或下划线组成',trigger: 'blur'}
              ],
              password:[
                { required: true, message: '请输入密码!', trigger: 'blur' },
                { min: 3, max: 12, message: '密码长度在 3 到 12 个字符', trigger: 'blur' }
              ],
              checkPassword:[
                { required: true, message: '请确认密码!', trigger: 'blur' },
                { validator: valiatePass, message: '两次密码输入不一致！', trigger: 'blur'}
              ],
              eMail:[
                {required: true, message: '请输入邮箱地址！', trigger: 'blur' },
                {pattern:/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,message: '邮箱只允许英文字母、数字、下划线、英文句号、以及中划线组成',trigger: 'blur'}
              ],
              mobile:[
                {required:true, message:'请输入手机号！', trigger:'blur'},
                {pattern:/^1[3456789]\d{9}$/,message:'手机号码格式不正确！',trigger:'blur'}
              ]
            }
          }
        },
       methods:{
          backLogin(){
            this.$router.push({name:'Login'})
          },
         toRegistor(){
           this.$refs['ruleForm'].validate((boolean,object)=>{
             if (boolean===true){
               const {username,password,eMail,mobile}=this.ruleForm;
               reqRegistor({
                 username,
                 password,
                 e_mail:eMail,
                 mobile
               }).then(res=>{
                const {code,message,token}=res.data;
                if (code===0){
                  Message.success(message);
                  this.$router.push({name:'Admin'})
                  memoryUntil.token=token;
                  storeUntil.setToken(token);
                  setTimeout(()=>{
                    memoryUntil.token=null;
                  },12*60*1000);
                }else {
                  Message.error(message);
                }
               }).catch(err=>{
                Message.error(err);
               })
             }else {
               Message.error('请您输入正确的信息！')
             }
           })
         }
       }
    }
</script>

<style>

</style>
