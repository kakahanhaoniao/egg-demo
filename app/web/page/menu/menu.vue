<template>
<menuLayout>
    <transition name="fade" mode="out-in">
        <div v-loading="gloable.loading" element-loading-text="数据请求中">
            <router-view></router-view>
        </div>
    </transition>
</menuLayout>
</template>
<script type="text/babel">
import { mapGetters } from 'vuex';
export default {
    computed: {
        ...mapGetters({
            gloable: 'gloable/gloable'
        })
    },
    mounted() {

    }
}
</script>
