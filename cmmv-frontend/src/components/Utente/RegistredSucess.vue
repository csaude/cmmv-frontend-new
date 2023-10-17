<template>
  <q-page class=" absolute full-width full-height column">
  <pageHeader :showPreviousButton="false" @previousScreen="$emit('previousScreen')" />
   <div class="q-px-sm">
        <div class="row text-center q-my-xl">
            <q-icon class="col" name="task_alt" size="200px" color="primary"/>
        </div>
        <div class="row text-center q-my-xl">
            <p class="col text-centertext-weight-medium ">Parabens!<br/>
            O Seu Registo Foi Enviado com sucesso
            </p>
        </div>
        <div class="row">
            <p class="col text-center text-subtitle1">
                Dentro de instantes o utente recebera uma mensagem com as credenciais de acesso.
            </p>
        </div>
    </div>
    <div class="absolute-bottom q-px-sm q-mb-lg">
            <div class="text-center q-mb-md">
                <buttone  label="Feito!" @click="$emit('procced', utente)" />
            </div>
        </div>
  </q-page>
</template>
<script>
export default {
    props: ['utente'],
  components: {
    pageHeader: require('components/Utente/UtenteRegistrationHeader.vue').default,
    buttone: require('components/Shared/Button.vue').default
  }
}
</script>
