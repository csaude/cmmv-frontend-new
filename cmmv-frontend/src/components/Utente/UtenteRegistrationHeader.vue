<template>
  <div class="row items-center q-mb-md bg-deep-orange-3">
        <div class="col">
            <q-btn
                flat
                round
                color="white"
                icon="chevron_left"
               @click="closeRegistration(false)"/>
        </div>
        <div class="col-8 text-center q-mt-md"><p class="col text-white"><slot></slot></p></div>
        <div class="col"><q-space /></div>
    </div>
</template>
<script>
export default {
    props: {
        showUtenteRegistrationScreenProp: Boolean,
        showPreviousButton: Boolean // previously was `value: String`
    },
    emits: ['update:showUtenteRegistrationScreenProp'],
    methods: {
        closeRegistration (close) {
           this.$emit('update:showUtenteRegistrationScreenProp', close)
        }
     }
}
</script>

<style>

</style>
