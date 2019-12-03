<template>
  <div class="header">
    <h1>
      <span>LOGO</span>
    </h1>

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
          <el-menu-item index="2-1">选项1</el-menu-item>
          <el-menu-item index="2-2">选项2</el-menu-item>
          <el-menu-item index="2-3">选项3</el-menu-item>
          <el-submenu index="2-4">
            <template slot="title">选项4</template>
            <el-menu-item index="2-4-1">选项1</el-menu-item>
            <el-menu-item index="2-4-2">选项2</el-menu-item>
            <el-menu-item index="2-4-3">选项3</el-menu-item>
          </el-submenu>
        </el-submenu>

    </el-menu>
  </div>

</template>
<script>
  import {reqLoginMes} from "../../api";
  import {Message} from 'element-ui'
  import {valiateToken} from "../../untils/valiateUntil";
  import memoryUntil from '@/untils/memoryUntil';
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
        //通过token获取用户信息
        getUserMes(){
          return reqLoginMes().then(res=>{
            const {code,data,message}=res.data;
            const result=valiateToken(code,message,this.$router);
            if (result){
              if (code===0){
                this.userMes=data.data;
                return true;
              }else {
                Message.error(message);
                return false;
              }
            }
          }).catch(err=>{
            Message.error(err);
          })
        }
      },
      created(){
        if (memoryUntil.token){
          this.getUserMes();
        }
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
    background: #ffffff;
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
