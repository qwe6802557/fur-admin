<template>
  <div class="left-nav">
    <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;" >
      <el-radio-button :label="collapse" v-col><a-icon type="menu-fold" class="collapse" @click="collapse = !collapse"/></el-radio-button>
    </el-radio-group>
    <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
      <router-link to="/auth/home">
      <el-menu-item index="/auth/home">
        <i class="el-icon-s-home"></i>
       <span slot="title">首页</span>
      </el-menu-item>
      </router-link>
      <!--<el-submenu index="5">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">订单管理</span>
        </template>
        <el-menu-item-group>
          <router-link to="/auth/produce"><el-menu-item index="5-1">订单列表</el-menu-item></router-link>
        </el-menu-item-group>
        <el-menu-item-group>
          <router-link to="/auth/produce"><el-menu-item index="5-2">我的订单</el-menu-item></router-link>
        </el-menu-item-group>
      </el-submenu>-->
      <el-submenu index="1" v-if="this.$store.state.userInfo.authority && this.$store.state.userInfo.authority.includes('产品管理') || this.$store.state.userInfo.identity && this.$store.state.userInfo.identity === 1">
        <template slot="title">
          <i class="el-icon-shopping-bag-1"></i>
          <span slot="title">产品管理</span>
        </template>
        <el-menu-item-group>
          <router-link to="/auth/materialCategory"><el-menu-item index="/auth/materialCategory">原料管理</el-menu-item></router-link>
          <router-link to="/auth/package"><el-menu-item index="/auth/package">配件管理</el-menu-item></router-link>
          <router-link to="/auth/goods"><el-menu-item index="/auth/goods">产品管理</el-menu-item></router-link>
          <router-link to="/auth/machine"><el-menu-item index="/auth/machine">机器管理</el-menu-item></router-link>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2" v-if="this.$store.state.userInfo.authority && this.$store.state.userInfo.authority.includes('生产管理') || this.$store.state.userInfo.identity && this.$store.state.userInfo.identity === 1">
        <template slot="title">
          <i class="el-icon-money"></i>
          <span slot="title">生产管理</span>
        </template>
        <el-menu-item-group>
          <router-link to="/auth/producePackage"><el-menu-item index="/auth/producePackage">配件生产</el-menu-item></router-link>
          <router-link to="/auth/produceGoods"><el-menu-item index="/auth/produceGoods">产品生产</el-menu-item></router-link>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="5" v-if="this.$store.state.userInfo.authority && this.$store.state.userInfo.authority.includes('商家管理') || this.$store.state.userInfo.identity && this.$store.state.userInfo.identity === 1">
        <template slot="title">
          <i class="el-icon-s-marketing"></i>
          <span slot="title">商家管理</span>
        </template>
        <el-menu-item-group>
          <router-link to="/auth/merchant"><el-menu-item index="/auth/merchant">商家列表</el-menu-item></router-link>
          <router-link to="/auth/order"><el-menu-item index="/auth/order">交付管理</el-menu-item></router-link>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="6" v-if="this.$store.state.userInfo.authority && this.$store.state.userInfo.authority.includes('员工管理') || this.$store.state.userInfo.identity && this.$store.state.userInfo.identity === 1">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span slot="title">员工管理</span>
        </template>
        <el-menu-item-group>
          <router-link to="/auth/staff/staffList"><el-menu-item index="/auth/staff/staffList">员工列表</el-menu-item></router-link>
          <router-link to="/auth/staff/group"><el-menu-item index="/auth/staff/group">分组管理</el-menu-item></router-link>
          <router-link to="/auth/staff/authority"><el-menu-item index="/auth/staff/authority">权限管理</el-menu-item></router-link>
        </el-menu-item-group>
      </el-submenu>
      <router-link to="/auth/approve" v-if="this.$store.state.userInfo.authority && this.$store.state.userInfo.authority.includes('审批管理') || this.$store.state.userInfo.identity && this.$store.state.userInfo.identity === 1">
        <el-menu-item index="/auth/approve">
          <i class="el-icon-tickets"></i>
          <span slot="title">审批管理</span>
        </el-menu-item>
      </router-link>
      <router-link to="/auth/picCode" v-if="this.$store.state.userInfo.authority && this.$store.state.userInfo.authority.includes('二维码管理') || this.$store.state.userInfo.identity && this.$store.state.userInfo.identity === 1">
        <el-menu-item index="/auth/picCode">
          <i class="el-icon-picture"></i>
          <span slot="title">二维码管理</span>
        </el-menu-item>
      </router-link>
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
      color: black;
      font-size: 25px;
      transition: .3s all;
      &:hover{
        color: #54B2FE;
      }
    }
    .collapse_active{
      background-color: transparent !important;
      border: none;
    }
    .el-menu-item.is-active{
      background: #54B2FE;
      color: #ffffff;
    }
    .el-radio-button{
      position: absolute;
      top: 17px;
      left: 215px;
    }
    .el-radio-button__orig-radio:checked+.el-radio-button__inner{
      border: none;
    }
    .el-menu-item [class^=el-icon-], .el-submenu [class^=el-icon-]{
      margin-bottom: 3px;
    }
  }
  .el-radio-button__orig-radio:checked+.el-radio-button__inner{
    background: none !important;
  }
</style>
