<template>
    <div class="contact-left-bar">
      <div class="contact-avatar">
        <img src="../../../assets/logo.png" alt="avatar">
        <p class="avatar-name">VueAdmin</p>
      </div>
     <div class="contact-search">
       <span>
         <i class="el-icon-search"></i>
         <el-input class="contact-input" v-model="search"  placeholder="search user..." @input="searchList" ></el-input>
         <i class="el-icon-circle-plus-outline" @click="addFriends"></i>
       </span>
     </div>
      <div class="contact-list">
        <ul>
          <GeminiScrollbar
            class="my-scroll-bar" :autoshow="true">
            <transition-group name="el-zoom-in-center">
            <li :class="classChange(index)" v-for="(item,index) in newFriendList" :key="item.id" @click="listClick(item.friend_id,index)" @mouseover="hoverFlag=index" @mouseout="hoverFlag=''">
              <img src="../../../../static/images/logo.png" alt="friendAvatar">
              <p>{{item.friend_name}}</p>
            </li>
            </transition-group>
          </GeminiScrollbar>
        </ul>
      </div>
    </div>
</template>

<script>
    export default {
        name: "ContactLeftBar",
        data(){
          return {
            search:'',
            clickFlag:'',
            hoverFlag:'',
            friendList:[],
            newFriendList:[],
            friend_id:0
          }
        },
      methods:{
          //列表好友点击事件
          listClick(id,index){
            this.clickFlag=index;
            //将点击对象ID通过父组件传给兄弟组件
            this.$emit("changeId",id);
          },
        //搜索框模糊搜索
          searchList(){
          this.newFriendList=this.friendList.filter((item)=>{
              if (item.friend_name.includes(this.search)){
                return item;
              }
            });
          },
        /**
         * 添加好友
         */
        addFriends(){
          this.$emit('addFriends');
        }
      },
      computed:{
          classChange(){
            return function (index) {
              if (this.clickFlag==index && (this.hoverFlag==index || this.hoverFlag!=index)){
                  return 'active';
              }else if(this.clickFlag!=index && this.hoverFlag==index){
                  return 'hover';
                }else {
                return '';
              }
              }
            }
          },
      mounted() {
        //初始化获取好友列表
        this.$socket.emit('getList');
        //初始化绑定好友列表服务器回复监听
        this.sockets.subscribe('getList',data=>{
          this.friendList = this.newFriendList = data;
          this.friend_id=this.friendList[0].friend_id;
          //初始化默认选择好友列表第一个对象ID
          this.$emit("changeId",this.friend_id);
          //初始化获取第一个好友聊天记录
          this.$socket.emit('getMessage',this.friend_id);
        })
      },
      beforeDestroy() {
          this.sockets.unsubscribe('getList');
      }
    }
</script>

<style scoped>

</style>
