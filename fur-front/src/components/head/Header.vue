<template>
  <div class="header">
    <h1>
      <span>LOGO</span>
    </h1>
    <el-popover
      placement="bottom"
      width="160"
      trigger="click"
      v-model="visible">
      <div class="announce-content">
        <div class="content-title">
          <div class="title">系统消息:<span style="color: red;">{{originMessage}}</span>条</div>
          <LinkButton :title="'查看'" v-if="originMessage !== 0"></LinkButton>
        </div>
        <div class="content-title">
          <div class="title">好友申请:<span style="color: red;">{{friendMessage}}</span>条</div>
          <LinkButton :title="'查看'" v-if="friendMessage !== 0"></LinkButton>
        </div>
      </div>
    <div class="announce-box" title="通知消息" slot="reference">
      <el-badge :value="mainMessage" class="item">
        <i class="el-icon-s-promotion"></i>
      </el-badge>
    </div>
    </el-popover>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#fff"
      text-color="black"
      active-text-color="#ffd04b">
        <el-submenu index="2">
          <template slot="title">
            <span class="header-myself"><el-avatar :size="40" :src="circleUrl" class="avatar"></el-avatar>{{this.userMes.username}}</span>
            </template>
          <el-menu-item index="2-1">个人资料</el-menu-item>
          <el-menu-item index="2-2" @click="toContact">在线交流</el-menu-item>
          <el-menu-item index="2-3" @click="loginOut">退出系统</el-menu-item>
        </el-submenu>
    </el-menu>
  </div>

</template>
<script>
  import {reqLoginMes} from "../../api";
  import {Message} from 'element-ui'
  import memoryUntil from '@/untils/memoryUntil';
  import storeUntil from '@/untils/storeUntil';
  import { MessageBox, Popover } from 'element-ui';
  import LinkButton from '@/components/link-button/link-button';
  import { reqLoginOut, reqMainMessage } from "../../api";

  export default {
        name: "Header",
        props:['value'],
        data() {
        return {
          isCollapse: true,
          activeIndex: '1',
          circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
          userMes:{},
          mainMessage:'',
          visible:false,
          originMessage:0,
          friendMessage:0,
        };
      },
      methods: {
        handleSelect(key, keyPath) {
          console.log(key, keyPath);
        },
        //加载在线交流聊天框
        toContact(){
          this.$emit('contactChange');
        },
        //通过token获取用户信息
        getUserMes(){
          return reqLoginMes().then(res=>{
            const {code,data,message}=res.data;
              if (code===0){
                this.userMes=data.data;
                this.$emit('getUserMes',this.userMes);
                return true;
              }else {
                Message.error(message);
                return false;
              }
          }).catch(err=>{
            Message.error(err);
          })
        },
        //退出
        loginOut(){
          MessageBox.confirm('您确定要退出系统么？','退出',{
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            type:"warning"
          }).then(() => {
            reqLoginOut().then(res=>{
              const {code, message} = res.data;
              if (code == 0){
                memoryUntil.token = null;
                storeUntil.delToken();
                Message.success(message);
                this.$router.push({name:'Main'});
              }else{
                Message.error(message);
              }
            }).catch(err=>{
              Message.error(err);
            })
          }).catch(err => {});
        },
        //获取未处理消息列表
        getMainMessage(){
          reqMainMessage().then(res => {
            const { code, message, data } = res.data;
            code === 0? this.mainMessage = data.length || '' : Message.error(message);
          }).catch(err => {
            Message.error(err);
          })
        },
      },
    components:{
      LinkButton
    },
      created(){
          this.getUserMes();
          this.getMainMessage();
      },
      watch:{
          userMes(val){
            this.userMes=val;
          },
          value(val){
            this.mainMessage = val;
          }
      }
    }
</script>

<style scoped>
.content-title{
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  font-style: italic;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-top: 5px;
}
</style>
<style lang="less">
  .header{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    min-width:718px;
    width: 100%;
    position: relative;
    background: #ffffff;
    .announce-box{
      .el-icon-s-promotion{
        font-size: 25px;
        cursor: pointer;
        transition: .5s color;
        &:hover{
          color: #54B2FE;
        }
      }
      position: absolute;
      right: 180px;
      top: 50%;
      transform: translateY(-50%);
    }
    .avatar{
      margin-right: 10px;
    }
    h1{
      line-height: 74px;
      span{
        display: inline-block;
        width: 200px;
        height: 74px;
      }
      .collapse{
        width: 20px;
        height: 20px;
        background: url("../../assets/col.png");
        display: inline-block;
        margin-left: 38px;
      }
    }
    .el-submenu__title{
      color: #54B2FE !important;
      border-bottom-color:#54B2FE !important;
    }
    .el-submenu__title:hover{
      background: #EDF5FF!important;
    }
    .el-menu--horizontal>.el-submenu .el-submenu__title{
      height: 74px;
      line-height: 74px;
    }
  }
  .el-menu--horizontal .el-menu .el-menu-item.is-active{
    color:#54B2FE !important;
  }
  .el-menu--horizontal .el-menu .el-menu-item:hover{
    background:#EDF5FF !important;
  }
</style>
