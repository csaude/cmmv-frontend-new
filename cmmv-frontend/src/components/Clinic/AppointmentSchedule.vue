<template>
  <transition-group
        appear
        enter-active-class="animated zoomIn"
        leave-active-class="animated zoomOut absolute-top">

        <div key="app-to-accept">
            <UserMessage />
            <div class="row q-mt-md text-bold">
                Marcação de Consultas ({{appointmentsPending.length}})
            </div>
                <q-input filled v-model="searchText" label="Pesquisar"/>
             <q-scroll-area style="height: 300px; max-width: auto;">
            <q-list
                bordered
                separator
                class="rounded-borders q-mt-md"
                 v-for="appointment in appointmentsPending"
                :key="appointment.id" >
                <PendingApp :appointment="appointment" />
            </q-list>
             </q-scroll-area>
            <div class="row q-mt-lg text-bold">
                Consultas Marcadas ({{appointmentsConfirmed.length}})
            </div>
              <q-input filled v-model="searchTextConfirmed" label="Pesquisar"  />
            <q-scroll-area style="height: 350px; max-width: auto;">
            <q-list
                bordered
                separator
                class="rounded-borders q-mt-md"
                virtual-scroll
                 v-for="appointment in appointmentsConfirmed"
                :key="appointment.id" >
                <AcceptedApp :appointment="appointment"/>
            </q-list>
              </q-scroll-area>
        </div>
    </transition-group>
</template>

<script>
import { date, QSpinnerIos } from 'quasar'
import Appointment from '../../store/models/appointment/Appointment'
import Utente from '../../store/models/utente/Utente'
import Clinic from '../../store/models/clinic/Clinic'
import db from 'src/store/localbase'
import { ref } from 'vue'
export default {
  data () {
    return {
      searchText: ref(''),
      searchTextConfirmed: ref(''),
      appointmentsBD: [],
      showEdit: false,
      appointmentsPendingToFilter: []
    }
  },
 computed: {
        appointmentsPending () {
          if (this.searchText.length === 0) {
         return Appointment.query()
                           .with('utente')
                           .with('clinic.province')
                           .with('clinic.district.province')
                           .with('utente.address')
                           .with('utente.province')
                           .with('utente.district.province')
                           .with('utente.communityMobilizer')
                            .with('utente.clinic')
                           .where((appointment) => {
                                  return appointment.status === 'PENDENTE' && appointment.appointmentDate !== '' && appointment.clinic_id === Number(localStorage.getItem('id_clinicUser'))
                                  })
                          .orderBy('appointmentDate', 'desc')
                          .get()
          } else {
            // this.appointmentsPendingToFilter = this.appointmentsPending
           return Appointment.query()
                           .with('utente')
                           .with('clinic.province')
                           .with('clinic.district.province')
                           .with('utente.address')
                           .with('utente.province')
                           .with('utente.district.province')
                           .with('utente.communityMobilizer')
                            .with('utente.clinic')
                           .where((appointment) => {
                                  return appointment.status === 'PENDENTE' && appointment.appointmentDate !== '' && appointment.clinic_id === Number(localStorage.getItem('id_clinicUser'))
                            }).whereHas('utente', (query) => {
                              query.where((utente) => {
                               return utente.systemNumber.toLowerCase().includes(this.searchText.toLowerCase()) || utente.firstNames.toLowerCase().includes(this.searchText.toLowerCase()) || utente.lastNames.toLowerCase().includes(this.searchText.toLowerCase())
                              })
                              })
                          .orderBy('appointmentDate', 'desc')
                          .get()
          }
      },
      appointmentsConfirmed () {
          if (this.searchTextConfirmed.length === 0) {
         return Appointment.query()
                           .with('utente')
                           .with('clinic.province')
                           .with('clinic.district.province')
                           .with('utente.address')
                           .with('utente.province')
                           .with('utente.district.province')
                           .with('utente.communityMobilizer')
                            .with('utente.clinic')
                           .where((appointment) => { return appointment.status === 'CONFIRMADO' && !appointment.hasHappened && appointment.appointmentDate !== '' && appointment.clinic_id === Number(localStorage.getItem('id_clinicUser')) }).orderBy('appointmentDate', 'desc')
                           .get()
          } else {
           return Appointment.query()
                           .with('utente')
                           .with('clinic.province')
                           .with('clinic.district.province')
                           .with('utente.address')
                           .with('utente.province')
                           .with('utente.district.province')
                           .with('utente.communityMobilizer')
                            .with('utente.clinic')
                           .where((appointment) => {
                             return appointment.status === 'CONFIRMADO' && !appointment.hasHappened && appointment.appointmentDate !== '' && appointment.clinic_id === Number(localStorage.getItem('id_clinicUser'))
                           }).whereHas('utente', (query) => {
                              query.where((utente) => {
                                return utente.systemNumber.toLowerCase().includes(this.searchText.toLowerCase()) || utente.firstNames.toLowerCase().includes(this.searchText.toLowerCase()) || utente.lastNames.toLowerCase().includes(this.searchText.toLowerCase())
                              })
                              })
                           .orderBy('appointmentDate', 'desc')
                           .get()
          }
      },
        UtenteBD () {
         return Utente.all()
      },
        clinicDB () {
         return Clinic.find(localStorage.getItem('id_clinicUser'))
      }
  },
    methods: {
    async getAppointments () {
       // Buscar as consults pelo id da clinica logada
    await Appointment.api().get('/appointment/clinic/' + localStorage.getItem('id_clinicUser')).then(resp => {
      console.log(resp)
            let appointmentApiList = []
             appointmentApiList = resp.response.data
             appointmentApiList.forEach(appointment => {
             if (appointment.status === 'CONFIRMADO') {
               appointment.syncStatus = 'S'
             }
                Appointment.localDbAdd(appointment)
                Appointment.update({
        where: (appointmentVuex) => {
    return appointmentVuex.id === appointment.id
  },
        data: appointment
      })
             })
          }).catch(error => {
            console.log('Erro no code ' + error)
        })
        this.$q.loading.hide()
       },
      handlerEdit () {
        this.showEdit = true
      },
       formatDate (value) {
            return date.formatDate(value, 'YYYY/MM/DD')
        }
       },
       mounted () {
         if (localStorage.getItem('role') === 'ROLE_USER') {
        db.newDb().collection('appointments').get().then(appointments => {
          if (appointments.length === 0) {
            this.$q.loading.show({
            spinner: QSpinnerIos,
            message: 'Por favor, aguarde...'
          })
          this.getAppointments()
          } else {
              Appointment.deleteAll()
              Appointment.insert({
              data: appointments
              })
            }
    })
      } //  this.fillUtenteOnAppointment()
    },
    created () {
    },
    components: {
      // reschedule: require('pages/Reschedule.vue').default,
        PendingApp: require('components/Clinic/PendingAppointment.vue').default,
        UserMessage: require('components/Clinic/UserMessage.vue').default,
        AcceptedApp: require('components/Clinic/AcceptedAppointment.vue').default
       }
}
</script>

