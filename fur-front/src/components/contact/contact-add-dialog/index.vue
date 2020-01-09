<template>
  <div class="add-dialog">
    <div class="add-dialog-left">
      <div class="left-content">
        <i class="el-icon-search"></i>
        <el-input class="contact-input" v-model="search"  placeholder="search user..." @input="searchList" ></el-input>
        <el-scrollbar wrap-class="main-top-scroll" :native="false" wrap-style="height:500px;" view-style="" view-class="view-box" ref="scrollBar">
        <div class="left-list">
          <el-checkbox-group v-model="checkedGroupList" @change="handleCheckedListChange">
            <ul>
              <li v-for="item in boxList">
                <img src="../../../../static/images/logo.png" alt="">
                <el-checkbox  :label="item.id"  :key="item.id">{{item.username}}</el-checkbox>
              </li>
            </ul>
          </el-checkbox-group>
        </div>
        </el-scrollbar>
      </div>
    </div>
    <div class="add-dialog-right" style="color: black;">
      <i class="el-icon-close" @click="addClose"></i>
      <div class="title">请勾选需要添加的好友</div>
      <el-scrollbar wrap-class="main-top-scroll" :native="false" wrap-style="height:470px;" view-style="" view-class="view-box" ref="scrollBar">
      <div class="add-dialog-list-all">
        <transition-group name="el-zoom-in-bottom" mode="in-out">
          <div class="add-dialog-list" v-for="item in checkedList" :key="item.id" >
            <el-tag closable :hit="true"  @close="removeList(item.id)">
              <img src="../../../../static/images/logo.png" alt="" width="30" height="100%">
              <span class="user-name">{{item.username}}</span>
            </el-tag>
          </div>
        </transition-group>
      </div>
      </el-scrollbar>
      <div class="btn-area">
        <el-button type="primary" round style="padding: 8px 18px;" @click="addSubmit">提交</el-button>
        <el-button style="padding: 8px 18px;" round @click="addClose">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { tag } from 'element-ui'
  import { Message } from 'element-ui'
    export default {
        name: "ContactAddDialog",
        data(){
          const list = ['上海','北京','北京','北京']
          return {
            search:'',
            boxList:[],
            checkedList:[],
            checkedGroupList: []
          }
        },
        methods:{
          addClose(){
            this.$emit('addClose');
          },
          searchList(){

          },
          handleCheckedListChange(val){
            let checkedList = [];
            //选择添加好友过滤
            val.forEach((item)=>{
              checkedList.push(this.boxList.filter((cItem)=>{
                return cItem.id == item;
              })[0]);
            })
            this.checkedList = checkedList;
          },
          //取消选择过滤
          removeList(val){
            this.checkedList = this.checkedList.filter((item)=>{
              return item.id != val;
            })
            this.checkedGroupList = this.checkedGroupList.filter((item)=>{
              return item != val;
            })
          },
          //添加列表提交
          addSubmit(){
            this.$socket.emit('addSubmit',this.checkedList);
          }
        },
      mounted() {
          //初始化可添加好友列表
          this.$socket.emit('getUserList');
          this.sockets.subscribe('getUserList',(data)=>{
            this.boxList = data;
          })
          this.sockets.subscribe('addSubmit',(data)=>{
            /*const { code,message } = data;*/
            /*code === 0 && Message.success('message') || Message.error(message);*/
            console.log(data);
          })
      },
      beforeDestroy(){
        //销毁组件取消监听 以免发生事件回调的重复调用 **
        this.sockets.unsubscribe('getUserList');
      }
    }
</script>

<style scoped lang="less">
  .contact{
    .add-dialog{
      .add-dialog-right{
        .el-icon-close{
          padding: 5px 8px;
          display: inline-block;
          position: absolute;
          right: 0px;
          top: 0px;
          color: gray;
          cursor: pointer;
          text-align: center;
          line-height: 20px;
          transition: .3s all;
          &:before{
            display: inline-block;
          }
          &:hover{
            background: red;
            color: #ffffff;
          }
        }
      }
    }
  }
  .add-dialog-list{
    padding: 0 35px;
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .el-tag{
      width: 100%;
      height: 80%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      img{
        width: 35px;
        height: 35px;
      }
      span{
        font-size: 14px;
      }
    }
  }
</style>
