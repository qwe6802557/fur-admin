<template>
    <div id="content-title">
        <div :class="'content-title' + (hasTriangle ? ' triangle' : '')">
            <h1>{{title}}</h1>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Title",
        props: ['hasTriangle', 'title']
    }
</script>

<style scoped lang="less">
    .content-title {
        position: relative;
        min-width: 112px;
        max-width: 136px;
        height: 24px;
        text-align: left;
        padding-left: 24px;
        background-image: linear-gradient(90deg,
        rgba(55, 131, 248, .1) 0%,
        rgba(255, 255, 255, .1) 100%);
        background-blend-mode: normal,
        normal;
        margin-bottom: 15px;

        &::before {
            content: '';
            width: 4px;
            height: 100%;
            background: #3783F8;
            position: absolute;
            left: 0;
            top: 0;
        }

        h1 {
            font-size: 16px;
            color: #6b747a;
            opacity: 1;
            font-weight: bold;
        }
    }

    .content-title.triangle::after {
        content: '';
        position: absolute;
        width: 4px;
        height: 4px;
        left: 0;
        bottom: -4px;
        background: url('./triangle.png') no-repeat center top/100% 100%;
    }
</style>