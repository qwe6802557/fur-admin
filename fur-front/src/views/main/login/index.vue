<template>
    <div id="login">
      <div class="login-center center-width">
        <div class="center-right">
          <h1>用户登录</h1>
          <span>USER &nbsp;&nbsp;LOGIN</span>
          <a-form layout="horizontal" :form="form">
            <a-form-item>
              <a-input v-decorator="[
                                              'username',
                                              { rules: [{ required: true, message: '请输入用户名/手机号/邮箱' }] }
                                            ]"
                       placeholder="请输入用户名/手机号/邮箱">
                <a-icon
                  slot="prefix"
                  type="user"
                  style="color: rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input v-decorator="[
                                              'password',
                                              { rules: [{ required: true, message: '请输入密码!' }] }
                                            ]"
                       type="password"
                       placeholder="请输入密码">
                <a-icon
                  slot="prefix"
                  type="lock"
                  style="color: rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input v-decorator="[
                                              'verify_code',
                                              { rules: [{ required: true, message: '请输入验证码!' }] }
                                            ]"
                       placeholder="请输入验证码">
                <a-icon
                  slot="prefix"
                  type="safety-certificate"
                  style="color: rgba(0,0,0,.25)"
                />
              </a-input>
              <div id="validate" @click="getValidateCode"/>
            </a-form-item>
            <a-form-item >
              <a-checkbox :checked="checkStatus" @change="handleChange">
                记住此次登录
              </a-checkbox>
              <!--<span @click="$router.push('/validate')" class="reset">忘记密码?</span>-->
            </a-form-item>
            <a-form-item>
              <a-button type="primary" htmlType="submit" class="login-form-button" :loading="loading" @click="login">
                登录
              </a-button>
              <div class="register">
                还没有账号?<span @click="toRegister">立即注册</span>
              </div>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
</template>

<script>
  import { reqValidateImg, reqLogin } from "@/api/login";
  import storeUntil from "@/untils/storeUntil";
  import { mapMutations } from 'vuex';
  export default {
        name: "Login",
        data () {
            return {
                loading: false,
                form: this.$form.createForm(this),
                checkStatus: true
            }
        },
        methods: {
            getValidateCode () {
              reqValidateImg().then( res => {
                const { data } = res;
                  document.querySelector('#validate').innerHTML = data;
              })
            },
            toRegister () {
                this.$router.push({path: '/register'})
            },
            login () {
              this.loading = true;
              this.form.validateFields( (err , values) => {
                if (err) {
                  this.loading = false;
                  return false;
                }
                reqLogin(values).then( res => {
                  const { code, message, token } = res.data;
                  if (code === 0){
                    this.$message.success(message);
                    storeUntil.setToken(token);
                    this.changeToken(token);
                    this.$router.push('/auth/home');
                  } else {
                    this.$message.error(message);
                    this.getValidateCode();
                  }
                  this.loading = false;
                })
              })
            },
            reset () {

            },
            handleChange (e) {
              this.checkStatus = e.target.checked;
            },
          ...mapMutations(['changeToken']),
        },
        mounted() {
            document.querySelector('#login').style.height = document.documentElement.clientHeight + 'px';
            this.getValidateCode();
        }
    }
</script>

<style scoped>
</style>
