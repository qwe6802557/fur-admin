<template>
  <div class="add-dialog">
    <div class="add-dialog-left">
      <div class="left-content">
        <i class="el-icon-search"></i>
        <el-input class="contact-input" v-model="search"  placeholder="search user..." @input="searchList" ></el-input>
      </div>
    </div>
    <div class="add-dialog-right">
      <i class="el-icon-close" @click="addClose"></i>

    </div>
  </div>
</template>

<script>
    export default {
        name: "ContactAddDialog",
        data(){
          return {
            search:''
          }
        },
        methods:{
          addClose(){
            this.$emit('addClose');
          },
          searchList(){

          }
        }
    }
</script>

<style scoped>

</style>
