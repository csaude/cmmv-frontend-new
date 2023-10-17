<template>
  <div class="row">
        <img
            src="img"
            style="width: 100%; height: 300px"
            >
    </div>
</template>

<script>
export default {
    data () {
        return {
            img: '~src/assets/splash_img.png'
        }
    },
    props: ['imgUrl']
}
</script>

<style>

</style>
