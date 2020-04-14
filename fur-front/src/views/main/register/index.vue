<template>
    <div id="register">
        <div class="login-center center-width">
            <div class="center-right">
                <h1>用户注册</h1>
                <span>USER &nbsp;&nbsp;REGISTER</span>
                <a-form layout="horizontal" :form="form">
                    <a-form-item>
                        <a-input v-decorator="[
                                              'userName',
                                              { rules: [{ required: true, message: '请输入注册用户名!' }] }
                                            ]"
                                 placeholder="请输入注册用户名">
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
                                              { rules: [{ required: true, message: '请输入注册密码!' }] }
                                            ]"
                                 placeholder="请输入注册密码">
                            <a-icon
                                    slot="prefix"
                                    type="lock"
                                    style="color: rgba(0,0,0,.25)"
                            />
                        </a-input>
                    </a-form-item>
                    <a-form-item>
                        <a-input v-decorator="[
                                              'phone',
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
                                              'eMail',
                                              { rules: [{ required: true, message: '请输入注册邮箱!' }] }
                                            ]"
                                 placeholder="请输入注册邮箱">
                            <a-icon
                                    slot="prefix"
                                    type="mail"
                                    style="color: rgba(0,0,0,.25)"
                            />
                        </a-input>
                        <a-button type="primary" htmlType="submit" class="login-form-button" :loading="loading" @click="this.register">
                            注册
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
    import { Button, Form, Icon, Input} from 'ant-design-vue'
    import Vue from 'vue';
    const Item = Form.Item;
    Vue.prototype.$form = Form;
    Vue.use(Button).use(Icon).use(Input).use(Item).use(Form);
    export default {
        name: "Register",
        data () {
            return {
                loading: false,
                form: this.$form.createForm(this),
            }
        },
        methods: {
            register () {

            }
        },
        mounted() {
            document.querySelector('#register').style.height = document.documentElement.clientHeight + 'px';
        }
    }
</script>

<style scoped>
</style>
