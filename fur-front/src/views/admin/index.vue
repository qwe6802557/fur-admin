<template>
  <div class="admin">
    <Header @contactChange="contactChange" @getUserMes="getUserMes" :value="value"></Header>
    <div class="admin-side">
      <div class="admin-left">
        <LeftBar></LeftBar>
      </div>
      <div class="admin-content">
        <router-view/>
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
    import Header from '@/components/head/Header';
    import LeftBar from '@/components/left-bar/Left-bar';
    import storeUntil from '@/untils/storeUntil';
    import { mapMutations } from 'vuex';
    import Store from '@/vuex/store';
    import { reqMainMessage } from "@/api/login";
    import Vue from "vue";
    import VueSocketIO from "vue-socket.io";
    import { Message } from 'element-ui'
    Vue.use(
      new VueSocketIO({
        debug: true,
        connection: `http://127.0.0.1:7001`,
        options:{
          autoConnect:false,
          query:`token=Bear ${Store.state.token}`
        }
      }));
    export default {
        name: "Admin",
        data(){
          return {
            userMes:{},
            currentComponent:'',
            value:'',
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
          this.userMes = val;
        },
        ...mapMutations(['changeToken'])
      },
      mounted(){
          document.querySelector('.admin-side').style.height = document.documentElement.clientHeight-74+'px';
          this.$socket.io.opts.query = `token=Bear ${Store.state.token}`;
          this.$socket.connect();
          /*this.$socket.disconnected === true && this.$socket.connect();*/
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
          if (!code || code === 0){
            return false;
          }
          this.$message.destroy() && this.$message.error(message);
          this.changeToken('');
          storeUntil.delToken();
          this.$router.push({name:'Main'});
        },
        handelEvent(val){
          const { code, message } = val;
          if (!code || code === 0){
            return false;
          }
          this.$message.destroy() && this.$message.error(message);
          this.changeToken('');
          storeUntil.delToken();
          this.$router.push({name:'Main'});
        },
        online(val){
          console.log(val);
        },
        outline(val){
          console.log(val);
        },
        addMessages(){
          reqMainMessage().then(res => {
            const { code, message, data } = res.data;
            code === 0? this.value = data.length : Message.error(message);
          }).catch( () => {
            this.$message.destroy() && this.$message.error('请求异常');
          });
        },
        disconnect(val){
          console.log(val);
        }
      },
      beforeDestroy() {
        this.$socket.disconnect();
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
      background: #F4F6F9;
      padding: 15px 15px;
    }
  }
</style>
