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
     <mainScreenInstruction/>
    </transition>
</transition-group>
</template>
<script setup>
import { ref } from 'vue'
import mainScreenInstruction from 'components/UserInstructions/MainScreenInstruction.vue'
// import { Platform } from 'quasar';

const fab = ref(false);
/*
const slide = ref(1);
const autoplay = ref(true);

const computedTitleClass = computed(() => {
  return Platform.is.desktop ? 'text-h1-xl' : 'text-h5'
});

const computedSubTitleClass = computed(() => {
  return Platform.is.desktop ? 'text-h1-xl' : 'text-h5'
});
*/
</script>
