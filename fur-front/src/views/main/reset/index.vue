<template>
    <div id="reset">
      <div class="login-center center-width">
        <div class="center-right">
          <h1>找回密码</h1>
          <span>PASSWORD &nbsp;&nbsp;RESET</span>
          <a-form layout="horizontal" :form="form">
            <a-form-item>
              <a-input v-decorator="[
                                              'password',
                                              { rules: [{ required: true, message: '请输入新密码!' }] }
                                            ]"
                       placeholder="请输入新密码">
                <a-icon
                  slot="prefix"
                  type="lock"
                  style="color: rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input v-decorator="[
                                              'confirmPass',
                                              { rules: [{ required: true, message: '请确认新密码!' }] }
                                            ]"
                       placeholder="请确认新密码">
                <a-icon
                  slot="prefix"
                  type="lock"
                  style="color: rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" htmlType="submit" class="login-form-button" :loading="loading" @click="reset">
                重置密码
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
    export default {
        name: "index",
        data () {
          return {
            loading: false,
            form: this.$form.createForm(this)
          }
        },
      methods: {
        reset () {

        }
      },
      mounted() {
          document.querySelector('#reset').style.height = document.documentElement.clientHeight + 'px';
      }
    }
</script>

<style scoped>

</style>
