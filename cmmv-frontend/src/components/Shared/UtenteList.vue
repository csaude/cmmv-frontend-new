<template>
        <q-item-section> {{utente.firstNames}} {{utente.lastNames}}
        <q-item-label caption v-if="sended"> {{utente.cellphone}}
          <div>
            <q-icon name="event"/>  {{utente.appointments[0].appointmentDate}}
            <q-icon name="place"/>  {{utente.appointments[0].clinic.name}}
          </div>
        </q-item-label>
        </q-item-section>
        <q-item-section avatar >
          <q-btn flat style="color: #FF0080" color="primary" label="Ligar a US" v-if="associated" @click="showUtenteULinkScreen = true" no-caps/>
          <q-icon name="call" color="primary" v-if="pending" />
        </q-item-section>
        <q-item-section rounded avatar v-if="pending">
              <q-checkbox v-model="checked"  @click="checkUtente"/>
        </q-item-section>
</template>
<script>
import { ref } from 'vue'
export default {
    props: ['utente', 'name'],
    data () {
       let pending, sended, associated
       const checked = false
       return {
         pending,
         sended,
         associated,
         checked,
         showUtenteULinkScreen: ref(false)
      }
    },
    components: {
    //  'utente-us-link': require('components/Utente/SearchSanitaryUnit.vue').default
    },
    methods: {
    showPending () {
    if (this.utente.status === 'PENDENTE') {
        this.pending = true
      } else if (this.utente.status === 'ASSOCIADO') {
         this.associated = true
      } else if (this.utente.status === 'ENVIADO') {
         this.sended = true
      }
    },
    checkUtente () {
      // this.$emit('listenerChild', this.utente)
    }
    },
    mounted () {
      this.showPending()
    },
    computed: {
    setUtenteChecked () {
      if (this.checked === true) {
       return this.utente.selected
      }
      return null
    }
  }
}
</script>
