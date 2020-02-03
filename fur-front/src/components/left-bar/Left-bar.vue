<template>
  <div class="left-nav">
    <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;" >
      <el-radio-button :label="collapse" v-col><i class="collapse" @click="collapse=!collapse"></i></el-radio-button>
    </el-radio-group>
    <el-menu default-active="0" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
      <router-link to="/admin/home">
      <el-menu-item index="0">
        <i class="el-icon-setting"></i>
       <span slot="title">首页</span>
      </el-menu-item>
      </router-link>
      <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">订单管理</span>
        </template>
        <el-menu-item-group>
          <router-link to="/admin/produce"><el-menu-item index="5-1">订单列表</el-menu-item></router-link>
        </el-menu-item-group>
        <el-menu-item-group>
          <router-link to="/admin/produce"><el-menu-item index="5-2">我的订单</el-menu-item></router-link>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">产品管理</span>
        </template>
        <el-menu-item-group>
          <router-link to="/admin/product"><el-menu-item index="1-1">产品列表</el-menu-item></router-link>
          <router-link to="/admin/material"><el-menu-item index="1-2">配件列表</el-menu-item></router-link>
          <router-link to="/admin/product"><el-menu-item index="1-3">机器列表</el-menu-item></router-link>
        </el-menu-item-group>
        <el-submenu index="1-4">
          <span slot="title">选项4</span>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">生产管理</span>
        </template>
        <el-menu-item-group>
          <router-link to="/admin/produce"><el-menu-item index="2-1">生产列表</el-menu-item></router-link>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">审批管理</span>
        </template>
        <el-menu-item-group>
          <router-link to="/admin/produce"><el-menu-item index="3-1">流程审批</el-menu-item></router-link>
        </el-menu-item-group>
        <el-menu-item-group>
          <router-link to="/admin/produce"><el-menu-item index="3-2">订单审批</el-menu-item></router-link>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title">导航四</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isCollapse: true,
        collapse:true
      };
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    },
    directives:{
      col:{
        inserted(el){
          el.addEventListener('click', function (){
            this.collapse=false;
          })
        }
      }
    },
    mounted() {
      let inner=document.querySelector('.el-radio-button__inner');
      inner.classList.add('collapse_active');
    }
  }
</script>

<style  scoped>
</style>
<style lang="less">
  .left-nav{
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
      min-height: 400px;
    }
    .collapse{
      display: block;
      width: 20px;
      height: 20px;
      background: url("../../assets/col.png") no-repeat;
    }
    .collapse_active{
      background-color: transparent !important;
      border: none;
    }
    .el-menu-item.is-active{
      background: #54B2FE;
      color: #ffffff;
    }
    .el-radio-button:hover{
      background:#EDF5FF!important;
    }
    .el-radio-button{
      position: absolute;
      top: 17px;
      left: 215px;
    }
    .el-radio-button__orig-radio:checked+.el-radio-button__inner{
      border: none;
    }
  }
</style>
