<template>
  <div class="admin">
    <Header></Header>
    <div class="admin-side">
      <div class="admin-left">
        <LeftBar></LeftBar>
      </div>
      <div class="admin-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
    import Header from '@/components/head/Header'
    import LeftBar from '@/components/left-bar/Left-bar'
    export default {
        name: "Admin",
      data(){
          return {
            userMes:{}
          }
      },
      methods:{

      },
      mounted(){
        document.querySelector('.admin-side').style.height=document.documentElement.clientHeight-74+'px';
      },
      components:{
        Header,
        LeftBar
      }
    }
</script>

<style scoped>


</style>
<style lang="less">
  .admin{
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
