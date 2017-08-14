<template>
    <div  class="main">
        <slot name="content"></slot>
    </div>
</template>
<style>
    .main{
      margin-top: -80px;
      padding: 80px 0 120px;
      box-sizing: border-box;
    }
</style>
<script type="text/babel">
    export default {
        name: 'v-content',
        data() {
            return {

            };
        },
        components: {},
        mounted() {

        }
    };
</script>
