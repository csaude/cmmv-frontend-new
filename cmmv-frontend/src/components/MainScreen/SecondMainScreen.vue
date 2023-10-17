<template>
    <transition-group
        appear
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutLeft absolute-top">
        <q-slide-item @left="$emit('previousScreen')" @right="$emit('nextScreen')" left-color="white" right-color="white">
        <template v-slot:left>
          <q-icon name="reply" />
        </template>
        <template v-slot:right>
          <q-icon name="arrow_forward_ios" />
        </template>
            <q-item>
                <div key="secondScreen" class="q-gutter-md row items-start">
                    <img src="~src/assets/02Definicao.png"
                        style="height: auto; max-width: 100%"/>
                    <page-content
                        title="O que é a circuncisão"
                        content="Circuncisão masculina médica é uma pequena cirurgia que consiste na retirada da pele que cobre a cabeça do pénis (prepúcio)."
                        />
                </div>
            </q-item>
        </q-slide-item>
         <navigation-buttons
                            @nextScreen="$emit('nextScreen')"
                            @previousScreen="$emit('previousScreen')" />
        <transition
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
        >
        <second-screen-instruction/>
    </transition>
    </transition-group>
</template>

<script>
export default {
    components: {
        'second-screen-instruction': require('components/UserInstructions/SecondMainScreenInstruction.vue').default,
        'navigation-buttons': require('components/MainScreen/NavigationButtons.vue').default,
        'page-content': require('components/MainScreen/Content.vue').default
    }
}
</script>

<style>

</style>
