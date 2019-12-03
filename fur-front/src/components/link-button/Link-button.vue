<template>
    <div class="link-button">
      <button :class="color">{{name}}</button>
    </div>
</template>
<script>
    export default {
        name: "Link-button",
        props:{
          name:{
            type:String,
            default:''
          },
          color:{
            type:String,
            default: 'primary'
          }
        }
    }
</script>

<style lang="less">
  .link-button{
    button{
      background: transparent;
    }
    .primary{
      color:#018EED
    }
    .danger{
      color:red;
    }
  }
</style>
