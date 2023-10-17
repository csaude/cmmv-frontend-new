<template>
<div class="row items-start">
    <q-card style="width: 100%; max-width:100vw; border-radius: 3%">
          <q-card-section>
            <q-list v-if="utentes.length > 0" separator>
             <q-scroll-area :visible="false" style="height: 280px; width: 100%; max-width:100vw;">
             <q-slide-item v-for="utente in utentes" :key="utente.id" left-color="orange" right-color="red" bottom-color="red" @left="opt => onLeft(opt, utente)" @right="opt => onRight(opt,utente)" @bottom="opt => onBottom(opt, utente)">
                <template v-slot:right v-if="utente.status === 'ENVIADO'">
                  <q-icon name="highlight_off" color="white" />
                </template>
                <template v-slot:left v-if="utente.status === 'ASSOCIADO'">
                  <q-icon name="edit" color="white" />
                </template>
                 <template v-slot:bottom v-if="utente.status !== 'ENVIADO' && utente.syncStatus === 'P'">
                  <q-icon name="delete" color="white" />
                </template>
                <q-item>
                    <q-item-section side avatar>
                      <q-avatar color="grey-6" text-color="white" :v-slot="utente">
                        {{ utente.firstNames.charAt(0).toUpperCase() }}
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-bold">{{ utente.firstNames }} {{ utente.lastNames }}</q-item-label>
                      <q-item-label caption lines="1">{{ utente.cellNumber }}</q-item-label>
                    </q-item-section>
                    <q-item-section side v-if="utente.status === 'ASSOCIADO'">
                     <div class="text-orange">
                      <q-btn dense flat style="color: #FF0080" color="primary" label="Ligar a US" @click="activeUSForm(true, utente)" no-caps/>
                      <q-icon name="arrow_forward_ios" />
                    </div>
                  </q-item-section>
                    <q-item-section side v-else-if="utente.status === 'ENVIADO' && utente.appointments.length > 0">
                      <q-item-label class="text-bold">
                        Consulta
                          <span class="span-pendente" v-if="utente.appointments[0].status ==='PENDENTE'"> {{utente.appointments[0].status}} </span>
                          <span class="text-green-9" v-else> {{utente.appointments[0].status}} </span>
                      </q-item-label>
                     <div class="">
                      <q-icon name="event"/> {{this.displayDate(utente.appointments[0].appointmentDate)}}
                     </div>
                      <div class="" v-if="utente.appointments[0].clinic !== null">
                      <q-icon name="place"/> {{utente.appointments[0].clinic.name}}
                    </div>
                  </q-item-section>
                </q-item>
              </q-slide-item>
             </q-scroll-area>
            </q-list>
            <q-list v-else separator>
                <q-item v-ripple>
                  <q-item-section avatar>
                    <q-icon color="red" name="mood_bad" />
                  </q-item-section>
                <q-item-section class="text-left">Sem resultados na lista</q-item-section>
              </q-item>
          </q-list>
          </q-card-section>
    </q-card>
    <utente-us-link v-model:showUtenteULinkScreen="show_dialog" v-model:utente="utente" :activeUSForm="activeUSForm" :isOn=isOn />
</div>
</template>

<script>
import { ref } from 'vue'
import { useQuasar, QSpinnerIos } from 'quasar'
// import Appointment from 'src/store/models/appointment/Appointment'
import Utente from 'src/store/models/utente/Utente'
import CommunityMobilizer from 'src/store/models/mobilizer/CommunityMobilizer'
 import db from 'src/store/localbase'
import Appointment from '../../store/models/appointment/Appointment'
import moment from 'moment'
import isOnline from 'is-online'
export default {
    props: ['indexEdit', 'utentes', 'utenteEdit', 'name', 'value', 'showUtenteULinkScreenProp', 'showUtenteRegistrationScreen'],
    emits: ['update:showUtenteULinkScreenProp', 'update:utentes', 'update:indexEdit', 'update:utenteEdit', 'update:showUtenteRegistrationScreen', 'update:isOn'],
    setup () {
       const $q = useQuasar()
       let timer
        let isOn
      return {
        show_dialog: ref(false),
        utente: {},
        $q,
        timer,
          isOn,
           isOnline,
        confirm: ref(false)
      }
    },
    methods: {
      finalize (reset) {
        this.timer = setTimeout(() => {
          reset()
        }, 100)
      },
      onLeft ({ reset }, utenteOld) {
        utenteOld.age = this.idadeCalculator(utenteOld.birthDate)
        this.$q.dialog({
              title: 'Confirmação',
              message: 'Pretende editar os dados do Utente?',
              ok: {
              label: 'OK',
              push: true,
              color: 'blue'
              },
              cancel: {
              label: 'Cancelar',
              push: true,
              color: 'negative'
              },
              persistent: true
          }).onOk(() => {
                this.$emit('update:utenteEdit', utenteOld)
                this.$emit('update:indexEdit', 0)
                this.$emit('update:showUtenteRegistrationScreen', true)
          }).onCancel(() => {
              // console.log('>>>> Cancel')
               this.finalize(reset)
          }).onDismiss(() => {
            // this.finalize(reset)
              // console.log('I am triggered on both OK and Cancel')
          })
        // native Javascript event
        // console.log(evt)
      },
      onBottom ({ reset }, utenteOld) {
        this.$q.dialog({
              title: 'Confirmação',
              message: 'Pretende apagar os dados do Utente?',
              ok: {
              label: 'OK',
              push: true,
              color: 'blue'
              },
              cancel: {
              label: 'Cancelar',
              push: true,
              color: 'negative'
              },
              persistent: true
          }).onOk(() => {
               db.newDb().collection('utentes').doc({ id: utenteOld.id }).delete()
               Utente.delete(utenteOld.id)
                this.$emit('update:utente', utenteOld)
            //   this.finalize(reset)
          }).onCancel(() => {
              // console.log('>>>> Cancel')
               this.finalize(reset)
          }).onDismiss(() => {
            // this.finalize(reset)
              // console.log('I am triggered on both OK and Cancel')
          })
        // native Javascript event
        // console.log(evt)
      },
      async onRight ({ reset }, utente) {
        if (utente.syncStatus === 'S') {
        this.$q.dialog({
              title: 'Informação',
              message: 'Não Pode Editar a consulta uma vez que esta já foi sincronizada',
              ok: {
              label: 'OK',
              push: true,
              color: 'blue'
              },
              persistent: true
          }).onOk(() => {
              this.finalize(reset)
          })
        } else {
         this.$q.loading.show({
          spinner: QSpinnerIos,
          message: 'Por favor, aguarde...'
         })
         utente.appointments = []
         utente.status = 'ASSOCIADO'
         utente.communityMobilizer = CommunityMobilizer.find(localStorage.getItem('id_mobilizer'))
         utente.communityMobilizer_id = Number(localStorage.getItem('id_mobilizer'))
       /*  await Utente.api().patch('/utente/' + utente.id, utente).then(resp => {
         this.$emit('update:utente', utente)
          this.$q.loading.hide()
              this.$q.notify({
                  message: 'O utente ' + utente.firstNames + ' ' + utente.lastNames + ' foi removido da lista.',
                  color: 'teal'
              })
         }).catch(error => {
          this.$q.loading.hide()
           this.$q.notify({
                  message: 'Aconteceu um erro inesperado.',
                  color: 'red'
          })
          this.finalize(reset)
          this.$q.loading.hide()
          console.log('Erro no code ' + error)
        }) */
        const appointment = Appointment.query().where('utente_id', utente.id).get()
       // const appointmentId = appointment.id
      //   console.log(db.newDb().collection('appointments'))
           db.newDb().collection('appointments').doc({ id: appointment[0].id }).delete()
             db.newDb().collection('utentes').doc({ id: utente.id }).set(
utente
)
Utente.update({
        where: (utenteVue) => {
    return utenteVue.id === utente.id
  },
        data: utente
      })
      Appointment.delete(appointment[0].id)
       //   this.finalize(reset)
          this.$q.loading.hide()
          this.$emit('update:utente', utente)
      }
      },
      displayDate (newDate) {
      //  moment(date).format('YYYY/MM/DD'))
        return moment(newDate).format('DD-MM-YYYY')
      },
     async activeUSForm (open, utente) {
        if (open) {
          this.isOnlineChecker()
        }
        Utente.update(utente)
        this.show_dialog = open
        this.utente = utente
       this.$emit('update:showUtenteULinkScreenProp', open)
        this.$emit('update:utente', utente)
      },
      idadeCalculator (birthDate) {
            if (moment(birthDate).isValid()) {
               const utentBirthDate = moment(birthDate)
               const todayDate = moment(new Date())
               const idade = todayDate.diff(utentBirthDate, 'years')
               return idade
            }
      },
       async isOnlineChecker () {
          this.$q.loading.show({
         spinner: QSpinnerIos,
         message: 'Por favor, aguarde...'
    })
      await isOnline().then(resp => {
        if (resp === true) {
         this.isOn = true
          this.$q.loading.hide()
        } else {
           this.isOn = false
          this.$q.loading.hide()
        }
      }).catch(error => {
        this.$q.loading.hide()
        console.log(error)
      })
    }
    },
     components: {
      'utente-us-link': require('components/Utente/SearchSanitaryUnit.vue').default
  },
   mounted () {
      this.isOnlineChecker()
 }
}
</script>
<style scoped>
.span-pendente {
font-size: 15x;
font-weight: bold;
color: rgb(252, 4, 4);
animation: blink 1s linear infinite;
}
@keyframes blink {
0%{opacity: 0.1;}
50%{opacity: .5;}
100%{opacity: 1;}
}
</style>
