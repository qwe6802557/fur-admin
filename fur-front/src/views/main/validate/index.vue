<template>
  <div id="validate">
    <div class="login-center center-width">
      <div class="center-right">
        <h1>找回密码</h1>
        <span>PASSWORD &nbsp;&nbsp;RESET</span>
        <a-form layout="horizontal" :form="form">
          <a-form-item>
            <a-input v-decorator="[
                                              'mobile',
                                              { rules: [{ required: true, message: '请输入注册手机号!' }] }
                                            ]"
                     placeholder="请输入注册手机号">
              <a-icon
                slot="prefix"
                type="phone"
                style="color: rgba(0,0,0,.25)"
              />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input v-decorator="[
                                              'mes_code',
                                              { rules: [{ required: true, message: '请输入验证码!' }] }
                                            ]"
                     placeholder="请输入验证码">
              <a-icon
                slot="prefix"
                type="safety-certificate"
                style="color: rgba(0,0,0,.25)"
              />
            </a-input>
            <a-button class="verify" @click="sendCode" :disabled="disabled" :loading="loading_code">{{validateText}}</a-button>
          </a-form-item>
          <a-form-item>
            <!--<a-input v-decorator="[
                                              'eMail',
                                              { rules: [{ required: true, message: '请输入注册邮箱!' }] }
                                            ]"
                     placeholder="请输入注册邮箱">
              <a-icon
                slot="prefix"
                type="mail"
                style="color: rgba(0,0,0,.25)"
              />
            </a-input>-->
            <a-button type="primary" htmlType="submit" class="login-form-button" :loading="loading">
              立即找回
            </a-button>
            <div class="back">
              <a-icon type="arrow-left" :style="{ color: 'rgba(0,0,0,.25)' }" />
              <span @click="$router.push({path:'/login'})">返回登录</span>
            </div>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
  import { reqMesCode /*reqValidateMes*/ } from "../../../api/login";

  export default {
    name: "Validate",
    data () {
      return {
        loading: false,
        form: this.$form.createForm(this),
        disabled: false,
        loading_code: false,
        validateText: '点击发送验证码'
      }
    },
    methods: {
      sendCode () {
        this.loading_code = true;
        this.form.validateFields(['mobile'], (err, value) => {
          if (err){
            this.loading_code = false;
            return false;
          }
          reqMesCode(value).then( res => {
            console.log(res.data);
          });
        });
      },
      resetCode () {
        this.validateText = '60s后可再次发送';
        this.disabled = true;
        let count = 60;
        const timer = setInterval( () => {
          count--;
          if (count === 0){
            this.disabled = false;
            this.validateText = '点击可发送验证码';
            return clearInterval(timer);
          }
          this.validateText = `${count}s后可再次发送`;
        }, 1000);
      }
    },
    mounted() {
      document.querySelector('#validate').style.height = document.documentElement.clientHeight + 'px';
    }
  }
</script>

<style scoped>

</style>
