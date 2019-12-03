<template>
  <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-if="display">
    <el-form-item label="手机号码" prop="mobile" class="mobile" >
      <el-input v-model="ruleForm.mobile" type="text" class="mobile-input" v-focus>
      </el-input>
    </el-form-item>
    <el-form-item label="验证码" prop="mes_code" class="mes_code">
      <el-input v-model="ruleForm.mes_code" type="text" class="mes_code-input">
      </el-input>
      <el-button @click="getMesCode" id="mes_code" :disabled="flag" class="mes_code-button">{{buttonMes}}</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="toReset">确认</el-button>
      <el-button type="primary" @click="toBack">返回</el-button>
    </el-form-item>
  </el-form>
  <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-else="display">
  <el-form-item label="新密码" prop="password" class="password">
    <el-input v-model="ruleForm.password" type="password"></el-input>
  </el-form-item>
  <el-form-item label="确认密码" prop="checkPassword" class="confirmPass_code">
    <el-input v-model="ruleForm.checkPassword" type="password"></el-input>
  </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="reset">重置</el-button>
      <el-button type="primary" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {Message} from 'element-ui';
  import {reqMesCode} from "@/api";
  import {reqValiateMes} from "@/api";
  import {reqReset} from "@/api";

  export default {
        name: "Reset",
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
            flag:false,
            buttonMes:'获取验证码',
            display:true,
            ruleForm:{
            mobile:'',
            mes_code:'',
            password:'',
            checkPassword:''
            },
            rules:{
              mobile:[
                {required:true, message:'请输入手机号！', trigger:'blur'},
                {pattern:/^1[3456789]\d{9}$/,message:'手机号码格式不正确！',trigger:'blur'}
              ],
              mes_code:[
                {required:true,message:'请输入验证码！',trigger:'blur'}
              ],
              password:[
                { required: true, message: '请输入密码!', trigger: 'blur' },
                { min: 3, max: 12, message: '密码长度在 3 到 12 个字符', trigger: 'blur' }
              ],
              checkPassword:[
                { required: true, message: '请确认密码!', trigger: 'blur' },
                { validator: valiatePass, message: '两次密码输入不一致！', trigger: 'blur'}
              ]
            }
          }
        },
      methods:{
        getMesCode(){
         this.$refs['ruleForm'].validateField('mobile',(valid)=>{
            if (!valid){
              let count=60;
              this.buttonMes=count+"s后可重新获取";
              this.flag=true;
              let timer=setInterval(()=>{
                if (count===1){
                  count=60;
                  this.flag=false;
                  this.buttonMes="获取验证码";
                  clearInterval(timer);
                  return;
                }
                count--;
                this.buttonMes=count+"s后可重新获取";
              },1000)
              reqMesCode({
                mobile:this.ruleForm.mobile
              }).then(res=>{
                if (res.data.code!=0){
                 Message.error('获取验证码失败！请重试！');
                 this.buttonMes="获取验证码";
                 this.flag=false;
                 clearInterval(timer);
                 return ;
                }
              })
            }
          })
        },
        toReset(){
            reqValiateMes({
              mes_code:this.ruleForm.mes_code,
              mobile:this.ruleForm.mobile
            }).then(res=>{
               const {code,message}=res.data;
               if (code===0){
                 Message.success(message);
                 this.display=false;
               }else {
                 Message.error(message);
               }
            }).catch(err=>{
              Message.error(err);
            })
        },
        toBack(){
          this.$router.go(-1);
        },
        reset(){
          this.$refs['ruleForm'].validate((boolean,object)=>{
            if (boolean){
              const {password,mobile}=this.ruleForm;
              reqReset({mobile,password}).then(res=>{
                const {code,message}=res.data;
                if (code===0){
                  Message.success(message);
                  this.$router.push({name:'Login'})
                }else {
                  Message.error(message);
                }
              }).catch(err=>{
                Message.error(err);
              })
            }else {
              Message.error('请填入正确的信息！');
            }
          })
        },
        cancel(){
          this.$router.push({name:'Login'})
        }
      },
      directives: {
      // 注册一个局部的自定义指令 v-focus
      focus: {
        // 指令的定义
        inserted: function (el) {
          // 聚焦元素
          el.querySelector('input').focus()
        }
      }
    }
    }
</script>

<style>

</style>
