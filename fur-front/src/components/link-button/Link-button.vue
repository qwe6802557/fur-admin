<template>
    <div class="link-button">
      <button>{{title}}</button>
    </div>
</template>
<script>
    export default {
        name: "Link-button",
        props:['title'],
    }
</script>

<style lang="less">
  .link-button{
    button{
      font-size:14px;
      background: transparent;
      color: #3783f8;
      outline: 0;
      border:none;
      cursor: pointer;
      &:hover{
        text-decoration: underline;
      }
    }
    .primary{
      color:#018EED
    }
    .danger{
      color:red;
    }
  }
</style>
