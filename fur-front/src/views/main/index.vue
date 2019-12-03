<template>
      <div class="login">
        <div class="login-form">
          <div class="login-form-title">
            <h1>用户后台管理系统</h1>
          </div>
          <div class="login-form-content">
          <router-view></router-view>
          </div>
        </div>
      </div>
</template>

<script>
    import memoryUntil from '@/untils/memoryUntil';
    export default {
        name: "Main",
        beforeMount() {
          if (!memoryUntil.token){
            return;
          }
          this.$router.push({name:'Admin'});
        }
    }
</script>

<style lang="less">
  .login{
    width: 100%;
    height: 100%;
    background: url("../../assets/bg.png") center no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  img{
    position: absolute;
    z-index: 99;
    top: 50%;
    left:8px;
    transform: translateY(-50%);
  }
  .login-form{
    width: 788px;
    height: 528px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: url("../../assets/form.png") center no-repeat;
  .login-form-title{
    text-align: center;
    font-size: 30px;
    margin-top: 78px;
  }
  .login-form-content{
    width: 40%;
    height: 40%;
    margin-top: 40px;
  .el-form-item__content{
    margin-left: 50px !important;
  }
  .el-input__inner{
    padding: 0 27px;
  }
  .el-form-item__label{
    text-align: right;
    width: auto !important;
  }
  button{
    margin-left: 35px;
  }
  .valiateWord{
    margin-left: -14px;
  .valiateInput{
    width: 40%;
  }
  }
  .valiateWord .el-form-item__error{
    margin-left: 14px;
  }
    .valiateWord img{
      left: 23px;
    }
    .confirmPass label{
      margin-left: -28px;
    }
    a{
      margin-left: 20px;
    }
    a:hover{
      text-decoration: underline;
    }
    .valiateWord .valiate-area{
      width: 130px;
      height: 40px;
      float: right;
      cursor: pointer;
    }
  }
  }
    .reset{
      font-size:14px;
      padding-left: 50px;
      .resetPw{
      margin-left: 10px !important;
      }
    }
    .mobile{
      position: relative;
      .el-form-item__content{
         position: absolute;
         left: 30px;
       }
      input{
        padding: 0 8px !important;
        width: 200px;
      }
    }
    .mes_code{
      position: relative;
      .el-form-item__content{
        position: absolute;
        left: 30px;
      }
      input{
        padding: 0 8px !important;
        width: 90px;
      }
      .mes_code-button{
        position: absolute;
        left: 68px;
        top: 0;
        padding: 12px 12px;
      }
    }
    .password{
      position: relative;
      .el-form-item__content{
        position: absolute;
        left: 30px;
      }
      input{
        padding: 0 8px !important;
        width: 200px;
      }
    }
    .confirmPass_code{
      position: relative;
      .el-form-item__content{
        position: absolute;
        left: 30px;
      }
      input{
        padding: 0 8px !important;
        width: 200px;
      }
    }
  }
</style>
