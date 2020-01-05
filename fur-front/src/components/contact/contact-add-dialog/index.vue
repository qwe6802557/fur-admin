<template>
  <div class="add-dialog">
    <div class="add-dialog-left">
      <div class="left-content">
        <i class="el-icon-search"></i>
        <el-input class="contact-input" v-model="search"  placeholder="search user..." @input="searchList" ></el-input>
        <div class="left-list">
          <el-checkbox-group v-model="checkedList" @change="handleCheckedListChange">
            <ul>
              <li v-for="(item,index) in boxList">
                <img src="../../../../static/images/logo.png" alt="">
                <el-checkbox  :label="item.id" :key="item.id">{{item.user_name}}</el-checkbox>
              </li>
            </ul>
          </el-checkbox-group>
        </div>
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
          const list = ['上海','北京','北京','北京']
          return {
            search:'',
            boxList:[{id:1,img:'',user_name:'张三'},{id:2,img:'',user_name:'李四'},{id:3,img:'',user_name:'王五'}],
            checkedList:[]
          }
        },
        methods:{
          addClose(){
            this.$emit('addClose');
          },
          searchList(){

          },
          handleCheckedListChange(val){
            console.log(val);
          }
        }
    }
</script>

<style scoped>

</style>
