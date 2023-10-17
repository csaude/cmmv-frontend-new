<template>
  <!-- @detected-condition fires when the connectivity status of the device changes -->
    <!-- Only renders when the device is offline -->
  <q-layout view="hHh lpR fFf">
  <offline detected-condition="handleConnectivityChange">
  <div class="q-pa-sm">
  <utente-registration
                v-if="this.showUtenteRegistrationScreen" :mobilizer="mobilizer" v-model:utenteUpdate="utente" v-model:indexEdit="indexEdit"
                v-model:showUtenteRegistrationScreenProp="showUtenteRegistrationScreen"/>
   </div>
   <div v-if="!this.showUtenteRegistrationScreen">
    <q-card :square="false" class="q-mt-sm qmr-sr">
    <div class="column bg-primary" style="height: 190px">
        <q-toolbar>
          <div class="col-auto q-py-sm">
              <q-btn color="black-7" round flat icon="more_vert"  @click="leftDrawerOpen = !leftDrawerOpen">
              </q-btn>
          </div>
        </q-toolbar>
    </div>
      <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="text-gray-8" >
      <q-card class="bg-primary" v-if="this.mobilizer !== null">
        <q-card-section class="flex flex-center q-ma-lg" avatar>
          <q-avatar class="q-py-lg" size="90px">
            <img src="../../assets/User-Profile.png">
          </q-avatar>
        </q-card-section>
          <div class="text-h6 text-white text-weight-bolder text-center">{{this.mobilizer.firstNames}} {{this.mobilizer.lastNames}}</div>
          <div class="text-subtitle2 text-white text-center">{{ this.mobilizer.cellNumber }}</div>
      </q-card>

      <q-list padding class="q-my-lg">
      <q-item @click="editMobilizer" active-class="q-item-no-link-highlighting" clickable>
        <q-item-section avatar>
          <q-icon name="manage_accounts" class="round"/>
        </q-item-section>
        <q-item-section>
          <q-item-label>Perfil</q-item-label>
        </q-item-section>
      </q-item>
      <q-item @click="changePassword" active-class="q-item-no-link-highlighting" clickable>
        <q-item-section avatar>
          <q-icon name="vpn_key" class="round"/>
        </q-item-section>
        <q-item-section>
          <q-item-label>Alterar Senha</q-item-label>
        </q-item-section>
      </q-item>
        <q-item @click="isOnlineChecker(true)" active-class="q-item-no-link-highlighting" clickable>
        <q-item-section avatar>
          <q-icon name="cloud_upload" class="round"/>
        </q-item-section>
        <q-item-section>
          <q-item-label>Sincronizar</q-item-label>
        </q-item-section>
      </q-item>
        <q-separator/>
            <q-item active-class="absolute q-item-no-link-highlighting" clickable v-close-popup @click="onItemClick" to="/">
            <q-item-section avatar>
                <q-icon color="red" name="power_settings_new"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Sair</q-item-label>
              </q-item-section>
            </q-item>
        </q-list>
    </q-drawer>
    <q-card-section>
      <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center justify-center">
              <q-btn
                  round
                  size="50px"
                  class="absolute bg-white"
                  style="middle: 12px; transform: translateY(-30%);">
                  <q-avatar size="150px">
                    <q-img src="../../assets/User-Profile.png"/>
                  </q-avatar>
              </q-btn>
      </div>
    </q-card-section>
     <q-card-section class="q-pt-xl">
        <div class="text-h5 text-center" v-if="this.mobilizer !== null">
         {{this.mobilizer.firstNames}} {{this.mobilizer.lastNames}}
        </div>
        <div class="text-h6 text-grey text-center">
          Mobilizador Comunitário
        </div>
      </q-card-section>
    </q-card>
    <q-space/>
    <div class="q-pt-xl q-gutter-xl flex flex-center" style="row" v-if="this.optionButtons">
          <q-btn
            outline
            push
            wait-for-ripple
            dense
            color=“primary”
            padding="xl"
            class="text-primary"
            @click="this.optionButtons = false, this.docsDisplay = false, this.clientsManager = true">
             <div class="">
             <q-icon name="group" size="100px"/>
             <div>UTENTES</div>
             </div>
       </q-btn>
        <q-btn
              outline
              push
              wait-for-ripple
              dense
              color=“primary”
              padding="xl"
              class="text-primary"
              @click="this.optionButtons = false, this.clientsManager = false, this.docsDisplay = true">
              <div class="">
              <q-icon name="snippet_folder" size="100px"/>
              <div>MATERIAL EDUCATIVO</div>
              </div>
        </q-btn>
    </div>
     <div class="q-pa-md" style="max-width: 100%" v-if="this.clientsManager">
            <q-tabs
              v-model="tab"
                active-color="white"
                indicator-color="primary"
                align="justify"
                active-bg-color="primary"
                narrow-indicator
                style="border-radius: 2em; border-style: solid;border-color: #EE764E;"
                class="text-grey q-mb-lg">
              <!--q-tab name="pendentes" label="Pendentes"/-->
              <q-tab style="border-radius: 2em; border-style: solid; border-color: white;" name="associados" label="Associados"/>
              <q-tab style="border-radius: 2em; border-style: solid; border-color: white;" name="enviados" label="Enviados" />
            </q-tabs>
            <div class="q-gutter-y-sm">
              <q-tab-panels
                v-model="tab"
                animated
                transition-prev="slide-right"
                transition-next="slide-left"
                class="text-dark text-left"
                style="border-radius: 5%">
                <q-tab-panel name="pendentes">
                  <div class="text-h6">Pendentes</div>
                  <utentes-view-list :utentes="utentesPendente"/>
                </q-tab-panel>
                <q-tab-panel name="associados">
                  <utentes-view-list
                        v-if="this.mobilizer"
                        :mobilizer="mobilizer"
                        :utentes="utentesAssociados"
                        v-model:indexEdit="indexEdit"
                        v-model:utenteEdit="utente"
                        v-model:showUtenteULinkScreenProp="showUtenteULinkScreen"
                        v-model:showUtenteRegistrationScreen="showUtenteRegistrationScreen" />
                    <q-page-sticky position="bottom-left" :offset="[18, 18]">
                      <q-btn flat round color="primary" icon="west" @click="this.optionButtons = true, this.clientsManager = false, this.docsDisplay = false" />
                    </q-page-sticky>
                    <q-page-sticky position="bottom-right" :offset="[18, 18]">
                      <q-btn size="xl" fab icon="add" @click="editUtente()" color="primary" />
                    </q-page-sticky>
                </q-tab-panel>
                <q-tab-panel name="enviados">
                <utentes-view-list :utentes="utentesEnviados"/>
                </q-tab-panel>
              </q-tab-panels>
            </div>
     </div>
    <div class="q-pa-md" style="max-width: 100%" v-if="this.docsDisplay">
      <q-separator />
        <view-docs :showDownload=true />
        <q-page-sticky position="bottom-left" :offset="[18, 18]">
          <q-btn flat round color="primary" icon="west" @click="this.optionButtons = true, this.clientsManager = false, this.docsDisplay = false" />
        </q-page-sticky>
    </div>
      </div>
      <q-dialog persistent v-model="showMobilizerRegistrationScreen">
          <addMobilizer
            :selectedMobilizer="mobilizer"
             :editModeMobilizer=editModeMobilizer
            @close="showMobilizerRegistrationScreen = false" />
      </q-dialog>
       <q-dialog persistent v-model="showChangePasswordScreen">
          <changePassword
            @close="showChangePasswordScreen = false" />
      </q-dialog>
        </offline>
  </q-layout>
</template>
<script>
import { ref } from 'vue'
import { useQuasar, Notify, QSpinnerIos } from 'quasar'
import Utente from 'src/store/models/utente/Utente'
import CommunityMobilizer from 'src/store/models/mobilizer/CommunityMobilizer'
import Clinic from 'src/store/models/clinic/Clinic'
import Province from 'src/store/models/province/Province'
import District from 'src/store/models/district/District'
import SyncronizingService from '../../services/SyncronizingService'
import db from 'src/store/localbase'
import isOnline from 'is-online'
import Appointment from '../../store/models/appointment/Appointment'
// import Appointment from '../../store/models/appointment/Appointment'
export default {
  setup () {
    const $q = useQuasar()
    const timerToSyncronizeConst = 0
    localStorage.setItem('isProcessing', 'false')
   // const isProcessingSync = ref(0)
    return {
       tab: ref('associados'),
       leftDrawerOpen: ref(false),
       showUtenteRegistrationScreen: ref(false),
       showUtenteULinkScreen: ref(false),
       clientList: ref(false),
       optionButtons: ref(true),
       clientsManager: ref(false),
       docsDisplay: ref(false),
       indexEdit: 1,
       showMobilizerRegistrationScreen: ref(false),
       showChangePasswordScreen: ref(false),
       editMode: false,
     //  isProcessingSync,
       timerToSyncronizeConst,
       $q,
       isOnline,
       utente: {
            firstNames: '',
            lastNames: '',
            birthDate: '',
            cellNumber: '',
            whatsappNumber: '',
            preferedLanguage: '',
            documentType: '',
            documentNumber: '',
            systemNumber: '',
            haspartner: '',
            age: '',
            status: 'PENDENTE',
            addresses: [],
            communityMobilizer: {}
        }
      }
  },
  computed: {
     mobilizer: {
      get () {
        return CommunityMobilizer.query().with('utentes').find(this.$route.params.id)
      },
      set (mobilizer) {
        CommunityMobilizer.update(mobilizer)
      },
      allUtente: {
        get () {
          return Utente.query().all
        },
        set (utente) {
        Utente.update(utente)
      }
      }
    },
    getAllNewClinics () {
      return Clinic.query().get()
    },
    utentesPendente () {
      return Utente.query()
                   .with('clinic.province')
                   .with('clinic.district.province')
                   .with('communityMobilizer')
                   .with('appointments.clinic.province')
                   .with('appointments.clinic.district.province')
                   .with('addresses.district')
                   .where('status', 'PENDENTE')
                   .orderBy('firstNames')
                   .get()
    },
     utentesAssociados () {
       return Utente.query()
                   .with('clinic.province')
                   .with('clinic.district.province')
                   .with('communityMobilizer')
                   .with('appointments.clinic.province')
                   .with('appointments.clinic.district.province')
                   .with('addresses.district')
                   .with('addresses.district.province')
                   .where('status', 'ASSOCIADO')
                   .orderBy('firstNames')
                   .get()
    },
     utentesEnviados () {
      return Utente.query()
                   .with('clinic.province')
                   .with('clinic.district.province')
                   .with('communityMobilizer')
                   .with('appointments.clinic')
                   .with('appointments.clinic.province')
                   .with('appointments.clinic.district.province')
                   .with('addresses.district')
                   .with('addresses.district.province')
                   .where('status', 'ENVIADO')
                   .orderBy('firstNames')
                   .get()
    }
  },
  methods: {
     async getAllUtente (offset) {
      let utentesApiList = []
      await Utente.api().get('/utente/communityMobilizer/' + this.$route.params.id).then(resp => {
             offset = offset + 100
             utentesApiList = resp.response.data
             Utente.localDbGetAll().then(utentes => {
               if (utentes.length === 0) {
                  utentesApiList.forEach(utente => {
                    utente.communityMobilizer = this.mobilizer
                    if (utente.syncStatus === undefined || utente.syncStatus === null) {
                        utente.syncStatus = 'S'
                    }
                  Utente.localDbAddWithKey(utente)
                 })
               }
             })
              this.$q.loading.hide()
        }).catch(error => {
           this.$q.loading.hide()
            console.log(error)
        })
     },
     async getAllClinics (offset) {
        await Clinic.api().get('/clinic?offset=' + offset + '&max=100').then(resp => {
            offset = offset + 100
             this.$q.loading.hide()
            // if (resp.response.data.length > 0) {
            //   setTimeout(this.getAllClinics(offset), 2)
            // }
            }).catch(error => {
                console.log(error)
                this.$q.loading.hide()
            })
    },
    async getAllProvinces (offset) {
        await Province.api().get('/province?offset=' + offset + '&max=100').then(resp => {
            offset = offset + 100
            // if (resp.response.data.length > 0) {
            //   setTimeout(this.getAllClinics(offset), 2)
            // }
            }).catch(error => {
                console.log(error)
            })
    },
    async getAllDistricts (offset) {
        await District.api().get('/district?offset=' + offset + '&max=100').then(resp => {
            offset = offset + 100
            this.$q.loading.hide()
            }).catch(error => {
               this.$q.loading.hide()
                console.log(error)
            })
    },
     async getMobilizer () {
       await CommunityMobilizer.api().get('/communityMobilizer/' + localStorage.getItem('id_mobilizer')).then(resp => {
         const mobilizer = resp.response.data
               mobilizer.utentes = []
             CommunityMobilizer.localDbAdd(mobilizer)
      }).catch(error => {
          console.log(error)
      })
     },
     async getDataLocalBase () {
      Utente.deleteAll()
      Appointment.deleteAll()
      const utentesList = await Utente.localDbGetAll()
      utentesList.forEach(utente => {
        utente.communityMobilizer = this.mobilizer
        Utente.insert({
          data: utente
        })
      })
      Province.localDbGetAll().then(provinces => {
        Province.insert({
          data: provinces
        })
      })
      District.localDbGetAll().then(districts => {
        District.insert({
          data: districts
        })
      })
      Clinic.localDbGetAll().then(clinics => {
        Clinic.insert({
          data: clinics
        })
      })
    },
    timerToSyncronize () {
    this.timerToSyncronizeConst = setInterval(() => {
    this.checkOnlineToSync1()
      }, 3600000) // 3600000 timer to sycronize hour to hour
    },
     editUtente () {
       this.showUtenteRegistrationScreen = true
       this.indexEdit = 1
     },
     editMobilizer (mobilizer) {
        this.mobilizer = Object.assign({}, mobilizer)
         this.showMobilizerRegistrationScreen = true
         this.editModeMobilizer = true
      },
      changePassword () {
         this.showChangePasswordScreen = true
      },
      setMobilizerLocalBase () {
        const mobilizer = this.mobilizer
        db.newDb().collection('mobilizer').add({
          mobilizer
          })
      },
      setClinics () {
        db.newDb().collection('clinics').get().then(clinics => {
          Clinic.insert({
            data: clinics
          })
        })
      },
      handleConnectivityChange (status) {
      console.log(status)
    },
    async isOnlineChecker (sync) {
      await isOnline().then(resp => {
        if (resp === true && sync === true) {
          this.verificationDialog()
        } else if (resp === false && sync === true) {
           Notify.create({
                    icon: 'announcement',
                    message: 'Nao Possui conectividade com a internet , Sincronização nao efectuda',
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
   sendUtente () {
     SyncronizingService.sendUtentes()
      // SyncronizingService.sendMobilizerData()
      // SyncronizingService.sendUserDataPassUpdated()
     },
  checkOnlineToSync1 () {
      isOnline().then(resp => {
      if (resp === true) {
        this.sendUtente()
        return true
      } else if (resp === false) {
        return false
      }
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
               db.newDb().collection('utentes').get({ keys: true }).then(utentes => {
                    const utentesToSend = []
                    utentes.forEach(utente => {
                        if (utente.data.syncStatus === 'P') {
                            utentesToSend.push(utente.data)
                        } else if (utente.data.syncStatus === 'U') {
                            utente.data.idServer = utente.key.toString()
                            utentesToSend.push(utente.data)
                        }
                    })
                    alert(utentesToSend.length)
                     if (utentesToSend.length === 0) {
                        Notify.create({
                          icon: 'announcement',
                          message: 'Não existem registos a serem sincronizados.',
                          type: 'negative',
                          progress: true,
                          timeout: 3000,
                          position: 'top',
                          color: 'negative',
                          textColor: 'white',
                          classes: 'glossy'
                        })
                     } else if (localStorage.getItem('isProcessing') === 'true') {
                        Notify.create({
                            icon: 'announcement',
                            message: 'Já Existe uma sincronização em curso.',
                            type: 'warning',
                            progress: true,
                            timeout: 3000,
                            position: 'top',
                            color: 'warning',
                            textColor: 'white',
                            classes: 'glossy'
                          })
                } else {
                   this.sendUtente()
                // this.$emit('update:showUtenteRegistrationScreenProp', false)
                }
                })
            }).onCancel(() => {
                // console.log('>>>> Cancel')
            }).onDismiss(() => {
                // console.log('I am triggered on both OK and Cancel')
            })
        }
  },
  mounted () {
   this.$q.loading.show({
         spinner: QSpinnerIos,
         message: 'Por favor, aguarde...'
    })
    const offset = 0
    this.isOnlineChecker(false)
    this.getDataLocalBase()
    this.timerToSyncronize()
    CommunityMobilizer.localDbGetAll().then(mobilizers => {
      if (mobilizers.length === 0) {
        this.getMobilizer()
        this.getAllUtente(offset)
      } else {
        console.log(mobilizers)
        mobilizers.utentes = []
        CommunityMobilizer.deleteAll()
        CommunityMobilizer.insert({
          data: mobilizers
        })
      }
       this.$q.loading.hide()
    })
  },
  created () {
  },
   beforeUnmount () {
   clearInterval(this.timerToSyncronizeConst)
  },
  components: {
     'utente-registration': require('components/Utente/UtenteRegistration.vue').default,
     'utentes-view-list': require('components/Shared/ViewUtenteList.vue').default,
     'view-docs': require('components/Home/MaterialEducativo.vue').default,
      addMobilizer: require('components/Clinic/AddMobilizer.vue').default,
      changePassword: require('components/Shared/ChangePassword.vue').default
    }
}
</script>
<style>
.scroll-area{
display : flex;
flex-grow: 1;
}
.offline {
  background-color: #fc9842;
  background-image: linear-gradient(315deg, #fc9842 0%, #fe5f75 74%);
}
.online {
  background-color: #00b712;
  background-image: linear-gradient(315deg, #00b712 0%, #5aff15 74%);
}
</style>
