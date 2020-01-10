<template>
  <div class="admin">
    <Header @contactChange="contactChange" @getUserMes="getUserMes"></Header>
    <div class="admin-side">
      <div class="admin-left">
        <LeftBar></LeftBar>
      </div>
      <div class="admin-content">
        <router-view></router-view>
      </div>
    </div>
   <div class="contact-dialog">
     <transition name="el-fade-in">
     <component
       :is="currentComponent"
       @isChange="isChange"
       :userMes="userMes"
     >
     </component>
     </transition>
   </div>
  </div>
</template>

<script>
    import Header from '@/components/head/Header'
    import LeftBar from '@/components/left-bar/Left-bar'
    import memoryUntil from '@/untils/memoryUntil';
    import storeUntil from '@/untils/storeUntil';
    import Vue from 'vue'
    import VueSocketIO from 'vue-socket.io'
    import { Message } from 'element-ui'

    Vue.use(
      new VueSocketIO({
        debug: true,
        connection: `http://127.0.0.1:7001?token=Bear ${memoryUntil.token}`
      }));
    export default {
        name: "Admin",
        data(){
          return {
            userMes:{},
            currentComponent:''
          }
      },
      methods:{
        contactChange(){
          this.currentComponent='Contact';
          $('.contact-dialog').css('display','block');
        },
        isChange(){
          this.currentComponent='';
          $('.contact-dialog').css('display','none');
        },
        getUserMes(val){
          this.userMes=val;
        }
      },
      mounted(){
        document.querySelector('.admin-side').style.height=document.documentElement.clientHeight-74+'px';
      },
      components:{
        Header,
        LeftBar,
        Contact(resolve){
          require(['@/components/contact/index.vue'],resolve);
        }
      },
      sockets:{
        customEmit:function (val) {
          const { code, message } = val;
          if (!code || code == 0){
            return false;
          }
          Message.error(message);
          memoryUntil.token=null;
          storeUntil.delToken();
          this.$router.push({name:'Main'});
        },
        handelEvent(val){
          const { code, message } = val;
          if (!code || code == 0){
            return false;
          }
          Message.error(message);
          memoryUntil.token=null;
          storeUntil.delToken();
          this.$router.push({name:'Main'});
        },
        online(val){
          console.log(val);
        },
        outline(val){
          console.log(val);
        }
      }
    }
</script>

<style scoped>


</style>
<style lang="less">
  .admin{
    position: relative;
    .contact-dialog{
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(0,0,0,.5);
      z-index: 99;
      display: none;
    }
    .admin-side{
      display: flex;
      flex-direction: row;
    }
    .admin-content{
      flex: 1;
      background: #eeeeee;
      padding: 15px 15px;
    }
  }
</style>
