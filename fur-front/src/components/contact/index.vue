                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <template>
 <div class="contact">
   <ContactLeftBar @changeId="changeId" @addFriends="addFriends"></ContactLeftBar>
   <ContactMain ref="contactMain" @isChange="isChange" :friend_id="friend_id" :userMes="userMes"></ContactMain>
   <component
     :is="currentComponent"
     @addClose="addClose"
   >
   </component>
 </div>
</template>
<script>
  import ContactLeftBar from '@/components/contact/contact-left-bar'
  import ContactMain from '@/components/contact/contact-main'

  export default {
    name:'Contact',
    props:['userMes'],
    data(){
      return {
        friend_id:0,
        currentComponent:''
      }
    },
    methods:{
      isChange(){
        this.$emit('isChange');
      },
      changeId(id){
        this.friend_id=id;
        this.$refs.contactMain.contentMes=[];
        this.$socket.emit('getMessage',id);
      },
      addFriends(){
        this.currentComponent = 'ContactAdd';
      },
      addClose(){
        this.currentComponent = '';
      }
    },
    components:{
      ContactLeftBar,
      ContactMain,
      ContactAdd(resolve){
        require(['@/components/contact/contact-add-dialog'],resolve);
      }
    },
    mounted() {
      //ESC按键关闭聊天框 && ENTER键发送消息
      $(document).on('keyup', (e)=> {
        if (e.keyCode == 27){
          this.$refs.contactMain.close();
        }else if (e.keyCode == 13){
          this.$refs.contactMain.send();
        }
      })
      //表情插件操作
      $('.container-emoji').css('display','none');
      $('.el-textarea').on('click',()=>{
        $('.container-emoji').css('display','none');
      })
      $('.category').on('click',()=>{
        $('.container-emoji').css('display','block');
      })
    }
  }
</script>
<style lang="less">
.contact{
  width: 800px;
  height: 600px;
  margin: 90px auto;
  font-size: 16px;
  color: #ffffff;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  position: relative;
  .contact-left-bar{
    width: 200px;
    height: 100%;
    background-color: #2e3238;
    .contact-avatar{
      padding: 15px;
      display: flex;
      flex-direction: row;
      align-items: center;
      img{
        width: 40px;
        height: 40px;
      }
      p{
        margin: 0 0 0 15px;
      }
    }
    .contact-search{
      text-align: center;
      position: relative;
      .el-icon-search,.el-icon-circle-plus-outline{
        position: absolute;
        left: 20px;
        z-index: 1;
        top: 50%;
        transform: translateY(-50%);
      }
      .el-icon-circle-plus-outline{
        left: 165px;
        cursor: pointer;
      }
      .el-input__inner{
        padding: 0 28px;
        width: 100%;
        font-size: 9pt;
        color: #fff;
        height: 30px;
        line-height: 30px;
        border: 1px solid #3a3a3a;
        border-radius: 4px;
        outline: 0;
        background-color: #26292e;
        width: 176px;
        height: 30px;
      }
    }
    //好友列表样式
    .contact-list{
      margin-top: 16px;
      li{
        padding: 9pt 15px;
        display: flex;
        flex-direction: row;
        align-items: center;
        transition: .3s linear all;
        cursor: pointer;
        img{
          width: 30px;
          height: 30px;
        }
        p{
          margin: 0 0 0 15px;
        }
      }
      .active{
        background-color: hsla(0,0%,100%,.1);
      }
      .hover{
        background-color: hsla(0,0%,100%,.03);
      }
      .my-scroll-bar{
        height: 484px;
      }

    }
  }
  .contact-main-area{
    display: flex;
    flex-direction: column;
    flex: 1;
    .main-top{
      padding: 10px 15px;
      background-color: #eee;
      height: 100%;
      .main-message{
        text-align: center;
        margin-bottom: 15px;
        span {
          font-size: 9pt;
          color: #fff;
          border-radius: 2px;
          background-color: #dcdcdc;
          box-sizing: border-box;
          padding: 2px 18px;
          display: inline-block;
          margin: 7px 0;
      }
        .message-box{
          display: flex;
          flex-direction: row;
          img{
            width: 30px;
            height: 30px;
            margin-right: 10px;
          }
          .right{
            margin-right: 0;
          }
          .message-text{
            padding: 0 10px;
            max-width: calc(100% - 40px);
            min-height: 30px;
            line-height: 2.5;
            font-size: 9pt;
            text-align: left;
            word-break: break-all;
            background-color: #FAFAFA;
            border-radius: 4px;
            color: black;
            position: relative;
            &:before{
              content: "";
              position: absolute;
              top: 9px;
              right: 100%;
              border: 6px solid transparent;
              border-right-color: #fafafa;
            }
          }
          .message-text-right{
            margin-right: 15px;
            background: #b2e281;
            &:before{
              left: 100%;
              border-right-color: transparent;
              border-left-color: #b2e281;
            }
          }
        }
        .message-box-right{
          justify-content: flex-end;
        }
      }
    }
    .main-bottom{
      background: #ffffff;
      height: 159px;
      position: relative;
      .emoji-area{
        width: 100%;
        background:#f0f0f0;
        #EmojiPicker{
          overflow: auto;
          border: none;
          outline: none;
        }
        .container-emoji{
          position: absolute;
          left: 0;
          bottom: 100%;
          height: 200px;
          width: 325px;
        }
      }
      .bottom-button{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        button{
          margin-right: 10px;
        }
      }
      .el-textarea__inner{
        border: none;
        outline: none;
        color: black;
        max-height: 90px;
        font-size: 9pt;
      }
    }
    .gm-scroll-view{
      background: #eee;
    }
  }
  /**
  添加好友样式
   */
  .add-dialog{
    width: 550px;
    height: 550px;
    background: #ffffff;
    display: flex;
    flex-direction: row;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%,-50%,0);
    z-index: 99;
    .add-dialog-left{
      flex: 1;
      border-right: 1px #eeeeee solid;
      box-sizing: border-box;
      .left-content{
        text-align: center;
        position: relative;
        box-sizing: border-box;
        .el-icon-search{
          position: absolute;
          left: 40px;
          top: 15px;
          color: gray;
          z-index: 99;
        }
        .contact-input{
          margin-top: 10px;
          padding: 0 35px;
             .el-input__inner{
               height: 25px;
               padding: 0 25px;
               outline: none;
               background:#E8E8E8;
               font-size: 12px;
               border: 1px #E8E8E8 solid;
               &:focus{
                 background: #FAFAFA;
               }
             }
        }
        ul{
          li{
            position: relative;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            height: 60px;
            padding: 0 35px;
            img{
              width: 35px;
              height: 35px;
            }
            .el-checkbox__inner{
              width: 20px;
              height: 20px;
              border-radius: 10px;
              &:after{
                height: 9px;
                left: 8px;
                top: 3px;
              }
            }
            .el-checkbox__label{
             position: absolute;
              right: 20px;
              display: inline-block;
              width: 150px;
              padding-right: 10px;
              text-align: left;
              overflow: hidden;
              text-overflow:ellipsis;
            }
          }
        }
      }
    }
    .add-dialog-right{
      flex: 1;
      position: relative;
      border: none;
      ul{
        li{
          position: relative;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          padding: 0 35px;
          img{
            width: 35px;
            height: 35px;
          }
          .el-checkbox__label{
            position: absolute;
            right: 20px;
            display: inline-block;
            width: 150px;
            padding-right: 10px;
            text-align: left;
            overflow: hidden;
            text-overflow:ellipsis;
          }
        }
      }
      .title{
        padding: 12px 35px 0 35px;
      }
      .btn-area{
        position: absolute;
        bottom: 10px;
        right: 5px;
      }
    }
  }
}
</style>
