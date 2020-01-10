<template>
    <div class="contact-main-area">
      <el-scrollbar wrap-class="main-top-scroll" :native="false" wrap-style="height:458px;background:#eee;" view-style="" view-class="view-box" ref="scrollBar">
      <div class="main-top">
          <transition-group name="el-zoom-in-center">
          <div v-for="(item,index) in contentMes" :key="item.id">
            <div class="main-message message-right" v-if="item.is_mine">
            <span class="message-date" v-if="spanFlag(item,index,contentMes)">{{item.date_time}}</span>
            <div class="message-box message-box-right">
              <div class="message-text message-text-right">
                {{item.content}}
              </div>
              <img src="../../../../static/images/logo.png" alt="" class="right">
            </div>
            </div>
          <div class="main-message"  v-else>
            <span class="message-date" v-if="spanFlag(item,index,contentMes)">{{item.date_time}}</span>
            <div class="message-box">
              <img src="../../../../static/images/logo.png" alt="">
              <div class="message-text">
                {{item.content}}
              </div>
            </div>
          </div>
          </div>
          </transition-group>
      </div>
      </el-scrollbar>
      <div class="main-bottom">
        <div class="emoji-area">
          <VEmojiPicker @select="selectEmoji"></VEmojiPicker>
        </div>
        <div class="input-area">
          <el-input type="textarea" v-model="myText" rows="5" resize="none"></el-input>
        </div>
        <div class="bottom-button">
          <el-button size="mini" @click="close">关闭(esc)</el-button>
          <el-button type="danger" size="mini" @click="send">发送(enter)</el-button>
        </div>
      </div>
    </div>
</template>

<script>
    import storeUntil from '@/untils/storeUntil';
    import Memory from '@/untils/memoryUntil'
    import VEmojiPicker from 'v-emoji-picker';
    import packEmoji from "v-emoji-picker/dist/v-emoji-picker.common";;//引入表情包控件
    import { Message } from 'element-ui'
    export default {
        name: "ContactMain",
        props:['friend_id','userMes'],
        data(){
          return {
            myText:'',
            contentMes:[]
          }
        },
        methods:{
          selectEmoji(data){
            this.myText+=data.data;
          },
          close(){
              this.$emit('isChange');
          },
          send(){
              this.$socket.emit('sendMessage',{friend_id:this.friend_id,content:this.myText,is_mine: true});
          },
          /**
           * el-scrollbar滚动条置底
           * @type {Vue | Element | Vue[] | Element[]}
           */
          toBottom(){
            let scroll = this.$refs.scrollBar.$refs["wrap"];
            this.$nextTick(()=>{
              scroll.scrollTop = scroll.scrollHeight;
            })
          }
        },
        computed:{
          //判断是否同一分钟内发送的消息来进行渲染
          spanFlag(){
            return function (item,index,contentMes) {
              if (index===0 ||(index>=1 && item.date_time!==contentMes[index-1].date_time)) {
                return true;
              }else {
                return false;
              }
            }
          }
        },
        components:{
          VEmojiPicker
        },
        mounted() {
          //删除表情控件搜索框
          $('#InputSearch').remove();
          //定义发送消息服务器回复监听
          this.sockets.subscribe('inChat', (data) => {
            const {code,message,userMes} = data;
            if (code === 0){
              userMes.date_time=userMes.date_time.split(' ')[1];
              if (userMes.user_id == this.userMes.id){
                userMes.is_mine = true;
              }else {
                userMes.is_mine = false;
              }
              this.contentMes.push(userMes);
              this.myText='';
              this.toBottom();
            }else{
              Message.error(message);
              this.$router.push({name:'Main'});
            }
          });
          //定义聊天记录服务器回复监听
          this.sockets.subscribe('getMessage',(data)=>{
            data.map((item)=>{
              item.date_time = item.date_time.split(' ')[1];
              if (item.user_id == this.userMes.id){
                item.is_mine = true;
              }else {
                item.is_mine = false;
              }
              return item;
            })
            this.contentMes = data;
            this.toBottom();
          })

        },
      beforeDestroy(){
        //销毁组件取消监听 以免发生事件回调的重复调用 **
        this.sockets.unsubscribe('inChat');
        this.sockets.unsubscribe('getMessage');
      }
    }
</script>

<style scoped>

</style>
