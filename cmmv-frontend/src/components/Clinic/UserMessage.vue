<template>
    <div class="row q-mt-xl text-bold">
        Bem Vindo <span class="text-primary q-mx-sm"> {{username}}</span>
    </div>
</template>

<script>
export default {
    data () {
        return {
            username: {}
        }
    },
    components: {
    },
    methods: {
        getUserName () {
            this.username = localStorage.getItem('username')
        }
    },
    computed: {
    },
    mounted () {
        this.getUserName()
    }
}
</script>

<style>

</style>
