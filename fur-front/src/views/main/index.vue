<template>
  <div id="main">
    <div class="login-center center-width">
      <transition name="el-fade-in-linear" mode="out-in">
      <router-view/>
      </transition>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Main"
    }
</script>

<style lang="less">
  #main{
    background: url("../../public/images/login-bg.png") no-repeat;
    background-size: cover;
    min-width: 1200px;
    #login{
      /deep/ .ant-btn{
        span{
          font-size: 16px;
        }
      }
      .center-width{
        width: 1300px;
        margin: 0 auto;
      }
      .login-center{
        padding-top: 250px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        .center-right{
          width: 400px;
          height: 400px;
          text-align: left;
          h1{
            font-size: 24px;
            color: #4452D5;
            font-weight: normal;
          }
          span{
            font-size: 14px;
            color: #B5B5B5;
          }
          .ant-input{
            width: 300px;
            height: 40px;
          }
          span{
            color:#B5B5B5;
          }
          /deep/ .ant-btn{
            width: 300px;
            height: 40px;
            margin-top: 5px;
            span{
              font-size: 17px;
              color: white;
            }
          }
          /deep/ .ant-form-item{
            margin-top: 25px;
            input{
              padding-left: 40px;
            }
          }
          /deep/ .ant-form-item:first-child{
            margin-top: 25px;
          }
          /deep/ .ant-form-item:nth-child(2){
            margin-bottom: 25px;
          }
          /deep/.ant-form-item:nth-child(3){
            margin-top: 0;
            input{
              width: 170px;
            }
          }
          .register{
            margin-top: 0px;
            span{
              color: #1C93FF;
              cursor: pointer;
              margin-left: 5px;
              &:hover{
                text-decoration: underline;
              }
            }
          }
          .has-success{
            line-height: 0px;
          }
          /deep/ .ant-input-affix-wrapper{
            width: 300px;
            height: 40px;
          }
          /deep/ .ant-form-item{
            &:nth-child(3){
              margin-bottom: 0px;
              .ant-input-affix-wrapper{
                width: 150px;
                height: 40px;
              }
            }
            &:nth-child(4){
              margin-top: 5px;
              margin-bottom: 5px;
            }
            &:nth-child(5){
              margin-top: 0;
            }
          }
          #validate{
            height: 40px;
            width: 90px;
            position: absolute;
            top: -12px;
            left: 123%;
            cursor:pointer;
          }
        }
        /deep/ .ant-input-prefix{
          font-size: 16px !important;
          left: 10px;
        }
      }
    }
    #register{
      .center-width{
        width: 1200px;
        margin: 0 auto;
      }
      .login-center{
        padding-top: 250px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        .center-right{
          width: 400px;
          height: 400px;
          text-align: left;
          h1{
            font-size: 24px;
            color: #4452D5;
            font-weight: normal;
          }
          span{
            font-size: 14px;
            color: #B5B5B5;
          }
          /deep/ .ant-input{
            width: 300px;
            height: 40px;
          }
          span{
            color:#B5B5B5;
          }
          /deep/ .ant-btn{
            width: 300px;
            height: 40px;
            margin-top: 25px;
            span{
              font-size: 17px;
              color: white;
            }
          }
          /deep/ .ant-form-item{
            margin-top: 25px;
            input{
              padding-left: 40px;
            }
          }
          /deep/ .ant-form-item:first-child{
            margin-top: 25px;
          }
          /deep/ .ant-form-item:nth-child(2){
            margin-bottom: 10px;
          }
          .register{
            span{
              color: #1C93FF;
              cursor: pointer;
              margin-left: 5px;
              &:hover{
                text-decoration: underline;
              }
            }
          }
        }
        /deep/ .ant-input-prefix{
          font-size: 18px !important;
        }
        .back{
          margin-top: 3px;
          cursor: pointer;
          color: #1C93FF;
          &:hover{
            text-decoration: underline;
          }
          span{
            color: #1C93FF;
            font-size: 15px;
          }
          i{
            color: #1C93FF !important;
          }
        }
      }
    }
    .reset{
      color: #6b747a !important;
      float: right;
      margin-right: 100px;
      &:hover{
        text-decoration: underline;
        cursor: pointer;
      }
    }
    .verify{
      height: 40px;
      margin-left: 10px;
    }
    #validate{
        /deep/ .ant-btn{
          span{
            font-size: 16px;
          }
        }
        .center-width{
          width: 1200px;
          margin: 0 auto;
        }
        .login-center{
          padding-top: 250px;
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          .center-right{
            width: 400px;
            height: 400px;
            text-align: left;
            h1{
              font-size: 24px;
              color: #4452D5;
              font-weight: normal;
            }
            span{
              font-size: 14px;
              color: #B5B5B5;
            }
            .ant-input{
              width: 300px;
              height: 40px;
            }
            span{
              color:#B5B5B5;
            }
            /deep/ .login-form-button{
              width: 300px;
              height: 40px;
              margin-top: 5px;
              span{
                font-size: 17px !important;
                color: white;
              }
            }
            /deep/ .ant-form-item{
              margin-top: 25px;
              input{
                padding-left: 40px;
              }
            }
            /deep/ .ant-form-item:first-child{
              margin-top: 25px;
            }
            /deep/ .ant-form-item:nth-child(2){
              margin-bottom: 25px;
            }
            /deep/.ant-form-item:nth-child(3){
              margin-top: 0;
              input{
                width: 170px;
              }
            }
            .back{
              margin-top: 3px;
              cursor: pointer;
              color: #1C93FF;
              &:hover{
                text-decoration: underline;
              }
              span{
                color: #1C93FF;
                font-size: 15px;
              }
              i{
                color: #1C93FF !important;
              }
            }
            .has-success{
              line-height: 0px;
            }
            /deep/ .ant-input-affix-wrapper{
              width: 300px;
              height: 40px;
            }
            /deep/ .ant-form-item{
              &:nth-child(2){
                margin-bottom: 25px;
                .ant-input-affix-wrapper{
                  width: 150px;
                  height: 40px;
                  input{
                    width: 150px;
                  }
                }
              }
              &:nth-child(4){
                margin-top: 0;
              }
            }
            .verify{
              height: 40px;
              margin-left: 10px;
              span{
                color: rgba(0, 0, 0, .6);
              }
            }
            /deep/ .ant-btn{
              span{
                font-size: 14px;
              }
            }
          }
          /deep/ .ant-input-prefix{
            font-size: 16px !important;
            left: 10px;
          }
        }
    }
    #reset{
      /deep/ .ant-btn{
        span{
          font-size: 16px;
        }
      }
      .center-width{
        width: 1200px;
        margin: 0 auto;
      }
      .login-center{
        padding-top: 250px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        .center-right{
          width: 400px;
          height: 400px;
          text-align: left;
          h1{
            font-size: 24px;
            color: #4452D5;
            font-weight: normal;
          }
          span{
            font-size: 14px;
            color: #B5B5B5;
          }
          .ant-input{
            width: 300px;
            height: 40px;
          }
          span{
            color:#B5B5B5;
          }
          /deep/ .login-form-button{
            width: 300px;
            height: 40px;
            margin-top: 5px;
            span{
              font-size: 17px !important;
              color: white;
            }
          }
          /deep/ .ant-form-item{
            margin-top: 25px;
            input{
              padding-left: 40px;
            }
          }
          /deep/ .ant-form-item:first-child{
            margin-top: 25px;
          }
          /deep/ .ant-form-item:nth-child(2){
            margin-bottom: 25px;
          }
          /deep/.ant-form-item:nth-child(3){
            margin-top: 0;
            input{
              width: 170px;
            }
          }
          .back{
            margin-top: 3px;
            cursor: pointer;
            color: #1C93FF;
            &:hover{
              text-decoration: underline;
            }
            span{
              color: #1C93FF;
              font-size: 15px;
            }
            i{
              color: #1C93FF !important;
            }
          }
          .has-success{
            line-height: 0px;
          }
          /deep/ .ant-input-affix-wrapper{
            width: 300px;
            height: 40px;
          }
          /deep/ .ant-form-item{
            &:nth-child(2){
              margin-bottom: 25px;
            }
            &:nth-child(4){
              margin-top: 0;
            }
          }
          /deep/ .ant-btn{
            span{
              font-size: 14px;
            }
          }
        }
        /deep/ .ant-input-prefix{
          font-size: 16px !important;
          left: 10px;
        }
      }
    }
  }
</style>
