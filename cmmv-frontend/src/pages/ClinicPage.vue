<template>
    <q-layout view="hHh lpR fFf">
     <div class="q-pa-sm">
            <q-header class="q-py-sm">
                <q-toolbar>
                 <q-toolbar-title>
                    <div class="text-weight- q-mt-md qmr-sr text-weight-bold" v-if="isUser"> Unidade Sanitária CMMV </div>
                    <div class="text-weight-thin " v-if="isUser && this.displayClinic() !== null"> {{ this.displayClinic().name }}</div>
                     <div class="text-weight- q-mt-md qmr-sr text-weight-bold absolute-center" v-if="isAdmin || isAdminDistrict"> Administração </div>
                      <div class="text-weight-thin " v-if="isAdminDistrict"> {{ this.displayDistrict().description }}</div>
                </q-toolbar-title>
                    <div class="absolute-right items-center q-mt-sm">
                        <q-avatar size="lg">
                          <img src="~assets/userLogedIn.jpg" />
                        </q-avatar>
                        <q-btn flat icon="expand_more">
                            <q-menu transition-show="scale" transition-hide="scale">
                            <q-list style="min-width: 120px">
                                <q-item clickable>
                                    <q-item-section @click="showChangePasswordScreen = true" clickable >Alterar Senha</q-item-section>
                                </q-item>
                                <q-item clickable v-if=isUser>
                                    <q-item-section clickable @click="isOnlineChecker(true)">Sincronizar</q-item-section>
                                </q-item>
                                <q-separator/>
                                <q-item to="/" clickable>
                                    <q-item-section>Sair</q-item-section>
                                </q-item>
                            </q-list>
                            </q-menu>
                        </q-btn>
                    </div>
                </q-toolbar>
            </q-header>
            <div class="q-gutter-y-lg">
            <UserMessage :userName="username" />
            </div>
            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="dashboard">
                <AppointmentSchedule />
              </q-tab-panel>
              <q-tab-panel name="consulta" >
                <AppointmentList />
              </q-tab-panel>
              <!--    <q-tab-panel name="clinics" >
                <AddClinic  />
              </q-tab-panel>  -->
              <q-tab-panel name="configuracoes" >
                <Settings  />
              </q-tab-panel>
              <q-tab-panel name="relatorios" >
              <div v-if=isAdminDistrict >
                <ChartsByDistrict  />
              </div>
                <div  >
                <Charts v-if=!isAdminDistrict />
              </div>
              </q-tab-panel>
             <!--  <q-tab-panel name="mobilizer" >
                <MobilizerManagement  />
              </q-tab-panel> -->
          </q-tab-panels>
            <q-footer>
                <q-toolbar>
                    <q-tabs v-model="tab" class="absolute-center">
                     <div v-if=isUser >
                        <q-tab name="dashboard" icon="pie_chart" label="Dashboard" />
                     </div>
                      <div v-if=isUser >
                        <q-tab name="consulta" icon="date_range" label="Consulta" />
                      </div>
                        <div v-if="!isAdmin || isAdminDistrict" >
                         <q-tab name="relatorios" icon="insights" label="Relatorios" />
                         </div>
                        <q-tab name="configuracoes" icon="settings" label="Definições" />
                    </q-tabs>
                </q-toolbar>
            </q-footer>
    </div>
     <q-dialog persistent v-model="showChangePasswordScreen">
          <changePassword
            @close="showChangePasswordScreen = false" />
      </q-dialog>
  </q-layout>
</template>

<script>
import { ref } from 'vue'
import Clinic from 'src/store/models/clinic/Clinic'
import District from 'src/store/models/district/District'
import SyncronizingService from '../services/SyncronizingService'
import { Notify, useQuasar } from 'quasar'
import isOnline from 'is-online'
import Appointment from 'src/store/models/appointment/Appointment'
import Utente from 'src/store/models/utente/Utente'
export default {
    data () {
      const $q = useQuasar()
       const timerToSyncronizeConst = 0
        return {
            tab: ref('dashboard'),
            backToDashBoard: ref(true),
            showChangePasswordScreen: ref(false),
            username: {},
             isOnline,
            isAdmin: ref(false),
            isAdminDistrict: ref(false),
            isUser: ref(false),
             $q,
             timerToSyncronizeConst
        }
    },
    components: {
        // Footer: require('components/Clinic/Footer.vue').default,
        AppointmentSchedule: require('components/Clinic/AppointmentSchedule.vue').default,
        AppointmentList: require('components/Clinic/ClinicAppointments.vue').default,
   //     AddClinic: require('components/Clinic/AddClinic.vue').default,
        Settings: require('components/Clinic/Settings.vue').default,
      //      MobilizerManagement: require('components/Clinic/MobilizerManagement.vue').default,
        UserMessage: require('components/Clinic/UserMessage.vue').default,
        changePassword: require('components/Shared/ChangePassword.vue').default,
         Charts: require('components/ApexCharts/Charts.vue').default,
          ChartsByDistrict: require('components/ApexCharts/ChartsDistrict.vue').default
    },
    methods: {
        displayClinic () {
            return Clinic.query().find(localStorage.getItem('id_clinicUser'))
        },
         displayDistrict () {
            return District.query().find(localStorage.getItem('idLogin'))
        },
         async getAllUtentesByDistrictId (districtId) {
           await Utente.api().get('/utente/address/' + districtId).then(resp => {
                console.log(resp.response.data)
            }).catch(error => {
                console.log(error)
            })
        },
 async getAllAppointmentsByDistrictId (districtId) {
           await Appointment.api().get('/appointment/district/' + districtId).then(resp => {
                console.log(resp.response.data)
            }).catch(error => {
                console.log(error)
            })
        },
        getUserName () {
            this.username = localStorage.getItem('username')
        },
     async isOnlineChecker (sync) {
          await isOnline().then(resp => {
        if (resp === true && sync === true) {
          this.verificationDialog()
        } else if (resp === false && sync === true) {
           Notify.create({
                    icon: 'announcement',
                    message: 'Nao Possui conectividade com a internet , sincronização nao efectuda',
                    type: 'negative',
                    progress: true,
                    timeout: 3000,
                    position: 'top',
                    color: 'negative',
                    textColor: 'white',
                    classes: 'glossy'
                  })
        } else if (resp === true && sync === false) {
           Notify.create({
                    icon: 'announcement',
                    message: 'Aplicativo Online',
                    type: 'positive',
                    progress: true,
                    timeout: 5000,
                    position: 'top',
                    color: 'positive',
                    textColor: 'white',
                    classes: 'glossy'
                  })
        } else if (resp === false && sync === false) {
           Notify.create({
                    icon: 'announcement',
                    message: 'Aplicativo offline',
                    type: 'negative',
                    progress: true,
                    timeout: 5000,
                    position: 'top',
                    color: 'negative',
                    textColor: 'white',
                    classes: 'glossy'
                  })
        }
      }).catch(error => {
        this.$q.loading.hide()
        console.log(error)
      })
      },
      verificationDialog () {
            this.$q.dialog({
                title: 'Confirmação',
                message: 'Tem a certeza que deseja efectuar a sincronização? Os dados enviados já não poderão ser editados após a sincronização',
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
               // this.sendUtente()
                // this.$emit('update:showUtenteRegistrationScreenProp', false)
                SyncronizingService.sendAppointmentsClinicData()
                SyncronizingService.getAppointmentsClinicData()
            }).onCancel(() => {
                // console.log('>>>> Cancel')
            }).onDismiss(() => {
                // console.log('I am triggered on both OK and Cancel')
            })
        },
        checkOnlineToSync1 () {
      isOnline().then(resp => {
      if (resp === true) {
         SyncronizingService.sendAppointmentsClinicData()
         SyncronizingService.getAppointmentsClinicData()
      } else if (resp === false) {
        return false
      }
      })
    },
    timerToSyncronize () {
   this.timerToSyncronizeConst = setInterval(() => {
    this.checkOnlineToSync1()
      }, 3600000) // 3600000 timer to sycronize hour to hour
    }
    },
     beforeUnmount () {
   clearInterval(this.timerToSyncronizeConst)
  },
    computed: {
    },
    mounted () {
        this.getUserName()
        this.isOnlineChecker(false)
         if (localStorage.getItem('role') === 'ROLE_ADMIN') {
          this.tab = 'configuracoes'
          this.isAdmin = true
            this.isAdminDistrict = false
         } else if (localStorage.getItem('role') === 'ROLE_USER_DISTRICT') {
           this.tab = 'configuracoes'
          this.isAdmin = false
           this.isAdminDistrict = true
          this.getAllUtentesByDistrictId(localStorage.getItem('idLogin'))
       this.getAllAppointmentsByDistrictId(localStorage.getItem('idLogin'))
         } else if (localStorage.getItem('role') === 'ROLE_USER') {
          this.isUser = true
         this.isAdmin = false
           this.isAdminDistrict = false
            this.timerToSyncronize()
         }
    }
}
</script>

<style>

</style>
