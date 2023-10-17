<template>
    <transition-group
        appear
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutLeft absolute-top">
    <div key="main" class="row bg-light-green-2 absolute full-width full-height column">
        <div class="q-gutter-md row items-start">
            <q-img src="~src/assets/01MainScreen.jpg" fit="cover"/>
        </div>
    </div>
    <div class="absolute-bottom flex flex-center q-my-lg">
    <q-fab
        v-model="fab"
        vertical-actions-align="center"
        color="primary"
        icon="keyboard_arrow_up"
        direction="up">
        <q-fab-action color="primary" @click="$emit('login')" icon="lock_open" label="Entrar" />
        <q-fab-action color="secondary" @click="$emit('nextScreen')" icon="chevron_right" label="Apresentação" />
      </q-fab>
    </div>
    <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
    >
     <main-screen-instruction/>
    </transition>
</transition-group>
</template>
<script>
    import { ref } from 'vue'
        export default {
              setup () {
                return {
                    fab: ref(false),
                    slide: ref(1),
                    autoplay: ref(true)
                }
            },
            components: {
                'main-screen-instruction': require('components/UserInstructions/MainScreenInstruction.vue').default
             },
            computed: {
                computedTitleClass () {
                    return this.$q.platform.is.desktop ? 'text-h1-xl' : 'text-h5'
                },
                computedSubTitleClass () {
                    return this.$q.platform.is.desktop ? 'text-h2-xl' : 'text-h5'
                }
            },
            methods: {
            }
        }
</script>
