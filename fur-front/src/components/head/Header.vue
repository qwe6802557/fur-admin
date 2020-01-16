<template>
  <div class="header">
    <h1>
      <span>LOGO</span>
    </h1>
    <div class="announce-box" title="通知消息">
      <el-badge :value="12" class="item">
        <i class="el-icon-s-promotion"></i>
      </el-badge>
    </div>
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
  import { MessageBox } from 'element-ui'
  import { reqLoginOut } from "../../api";

  export default {
        name: "Header",
        data() {
        return {
          isCollapse: true,
          activeIndex: '1',
          circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
          userMes:{}
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
        }
      },
      created(){
          this.getUserMes();
      },
      watch:{
          userMes(val){
            this.userMes=val;
          }
      }
    }
</script>

<style scoped>

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
