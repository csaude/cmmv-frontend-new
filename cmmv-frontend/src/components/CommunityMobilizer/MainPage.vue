<template>
  <!-- @detected-condition fires when the connectivity status of the device changes -->
    <!-- Only renders when the device is offline -->
  <q-layout view="hHh lpR fFf">
  <offline detected-condition="handleConnectivityChange">
  <div class="q-pa-sm">
  <utente-registration
                v-if="showUtenteRegistrationScreen"/>
   </div>
   <div v-if="!showUtenteRegistrationScreen">
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
      <q-card class="bg-primary" v-if="mobilizer !== null && mobilizer !== undefined">
        <q-card-section class="flex flex-center q-ma-lg" avatar>
          <q-avatar class="q-py-lg" size="90px">
            <img src="../../assets/User-Profile.png">
          </q-avatar>
        </q-card-section>
          <div class="text-h6 text-white text-weight-bolder text-center" >{{mobilizer.firstNames}} {{mobilizer.lastNames}}</div>
          <div class="text-subtitle2 text-white text-center">{{ mobilizer.cellNumber }}</div>
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
        <div class="text-h5 text-center" v-if="mobilizer !== null">
         {{mobilizer.firstNames}} {{mobilizer.lastNames}}
        </div>
        <div class="text-h6 text-grey text-center">
          Mobilizador Comunitário
        </div>
      </q-card-section>
    </q-card>
    <q-space/>
    <div class="q-pt-xl q-gutter-xl flex flex-center" style="row" v-if="optionButtons">
          <q-btn
            outline
            push
            wait-for-ripple
            dense
            color=“primary”
            padding="xl"
            class="text-primary"
            @click="optionButtons = false, docsDisplay = false, clientsManager = true">
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
              @click="optionButtons = false, clientsManager = false, docsDisplay = true">
              <div class="">
              <q-icon name="snippet_folder" size="100px"/>
              <div>MATERIAL EDUCATIVO</div>
              </div>
        </q-btn>
    </div>
     <div class="q-pa-md" style="max-width: 100%" v-if="clientsManager">
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
                        v-if="mobilizer"
                        :utentes="utentesAssociados"
                        />
                    <q-page-sticky position="bottom-left" :offset="[18, 18]">
                      <q-btn flat round color="primary" icon="west" @click="optionButtons = true, clientsManager = false, docsDisplay = false" />
                    </q-page-sticky>
                    <q-page-sticky position="bottom-right" :offset="[18, 18]">
                      <q-btn size="xl" fab icon="add" @click="addUtente()" color="primary" />
                    </q-page-sticky>
                </q-tab-panel>
                <q-tab-panel name="enviados">
                <utentes-view-list :utentes="utentesEnviados"/>
                </q-tab-panel>
              </q-tab-panels>
            </div>
     </div>
    <div class="q-pa-md" style="max-width: 100%" v-if="docsDisplay">
      <q-separator />
        <view-docs :showDownload=true />
        <q-page-sticky position="bottom-left" :offset="[18, 18]">
          <q-btn flat round color="primary" icon="west" @click="optionButtons = true, clientsManager = false, docsDisplay = false" />
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
<script setup>
import { ref,onMounted,computed,onBeforeUnmount,provide } from 'vue'
import { useQuasar, QSpinnerIos } from 'quasar'
import Utente from '../../stores/models/utente/Utente';
import CommunityMobilizer from '../../stores/models/mobilizer/CommunityMobilizer'
import Clinic from '../../stores/models/clinic/Clinic'
import Province from '../../stores/models/province/Province'
import District from '../../stores/models/district/District'
// import SyncronizingService from '../../services/SyncronizingService'
import db from 'src/stores/localbase'
import isOnline from 'is-online'
import Appointment from '../../stores/models/appointment/Appointment'
import communityMobilizerService from '../../services/api/mobilizer/CommunityMobilizerService';
import utenteService from '../../services/api/utente/UtenteService'
import { useRouter,useRoute } from 'vue-router';
import utenteRegistration from 'components/Utente/UtenteRegistration.vue';
import utentesViewList from 'components/Shared/ViewUtenteList.vue';
 import viewDocs from 'components/Home/MaterialEducativo.vue';
import { useLoading } from 'src/composables/shared/loading/loading';
// import addMobilizer from 'components/Clinic/AddMobilizer.vue';
// import changePassword from 'components/Shared/ChangePassword.vue';
import { Notify } from 'quasar'
import provinceService from 'src/services/api/province/provinceService';
import districtService from 'src/services/api/district/districtService';

const { closeLoading, showloading } = useLoading();

const tab = ref('');
const leftDrawerOpen = ref(false);
const showUtenteRegistrationScreen = ref(false);
const showUtenteULinkScreen = ref(false);
const clientList = ref(false);
const optionButtons = ref(true);
const clientsManager = ref(false);
const docsDisplay = ref(false);
const indexEdit =  ref(1);
const showMobilizerRegistrationScreen = ref(false);
const showChangePasswordScreen = ref(false)
const editMode = ref(false);
const timerToSyncronizeConst = ref(0);
const $q = useQuasar();
const router = useRouter();
const route = useRoute();

const utenteToEdit = ref();
/*
const utente = ref({ firstNames: '',
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
            communityMobilizer: {}})
            */
// const utente = ref(new Utente())
 localStorage.setItem('isProcessing', 'false')

const mobilizer = computed(() => {
  console.log(communityMobilizerService.getMobilizerById(route.params.id))
  return communityMobilizerService.getMobilizerById(route.params.id)
});

const utentesPendente =  computed(() => {
  return utenteService.getLocalPendingUtentes();
});

const utentesAssociados =  computed(() => {
  return utenteService.getLocalUtentesAssociados();
});

const utentesEnviados =  computed(() => {
  return utenteService.getLocalUtentesEnviados();
});

const getAllUtente = async () => {
  /*
 let utentesApiList = []
      await Utente.api().get('/utente/communityMobilizer/' + route.params.id).then(resp => {
             offset = offset + 100
             utentesApiList = resp.response.data
             Utente.localDbGetAll().then(utentes => {
               if (utentes.length === 0) {
                  utentesApiList.forEach(utente => {
                    utente.communityMobilizer = mobilizer
                    if (utente.syncStatus === undefined || utente.syncStatus === null) {
                        utente.syncStatus = 'S'
                    }
                  Utente.localDbAddWithKey(utente)
                 })
               }
             })
              $q.loading.hide()
        }).catch(error => {
           $q.loading.hide()
            console.log(error)
        }) 
        */
        utenteService.apiFetchByMobilizer(route.params.id)
}
const getAllClinics = async (offset) => {
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
}
const getAllProvinces = async (offset) => {
    await Province.api().get('/province?offset=' + offset + '&max=100').then(resp => {
            offset = offset + 100
            // if (resp.response.data.length > 0) {
            //   setTimeout(getAllClinics(offset), 2)
            // }
            }).catch(error => {
                console.log(error)
            })
}

const getAllDistricts = async (offset) => {
    await Province.api().get('/province?offset=' + offset + '&max=100').then(resp => {
            offset = offset + 100
            // if (resp.response.data.length > 0) {
            //   setTimeout(getAllClinics(offset), 2)
            // }
            }).catch(error => {
                console.log(error)
            })
}

const getMobilizer = async () => {
  return communityMobilizerService.apiFetchById(route.params.id)
}

const getDataLocalBase = async () => {
  utenteService.getMobile()
  /*  
  Utente.deleteAll()
      Appointment.deleteAll()
      const utentesList = await Utente.localDbGetAll()
      utentesList.forEach(utente => {
        utente.communityMobilizer = mobilizer
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
      */
}

const timerToSyncronize = () => {
  timerToSyncronizeConst.value = setInterval(() => {
    checkOnlineToSync1()
      }, 3600000) //
}

const addUtente = () => {
  showUtenteRegistrationScreen.value = true
      indexEdit.value = 1
}

const editMobilizer = () => {
  mobilizer.value = Object.assign({}, mobilizer)
  showMobilizerRegistrationScreen.value = true
  editModeMobilizer.value = true
}

const changePassword = () => {
  showChangePasswordScreen.value = true
}

const setMobilizerLocalBase = () => {
     const mobilizer = mobilizer
        db.newDb().collection('mobilizer').add({
          mobilizer
          })
}

const setClinics = () => {
     db.newDb().collection('clinics').get().then(clinics => {
          Clinic.insert({
            data: clinics
          })
        })
}

const handleConnectivityChange = (status) => {
     console.log(status)
}

const isOnlineChecker = async (sync) => {
      await isOnline().then(resp => {
        if (resp === true && sync === true) {
          verificationDialog()
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
          closeLoading();
        console.log(error)
      })
}

const sendUtente = (status) => {
  // SyncronizingService.sendUtentes()
}

const checkOnlineToSync1 = (status) => {
   isOnline().then(resp => {
      if (resp === true) {
        sendUtente()
        return true
      } else if (resp === false) {
        return false
      }
      })
}

const verificationDialog = () => {
      $q.dialog({
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
                   sendUtente()
                // $emit('update:showUtenteRegistrationScreenProp', false)
                }
                })
            }).onCancel(() => {
                // console.log('>>>> Cancel')
            }).onDismiss(() => {
                // console.log('I am triggered on both OK and Cancel')
            })
        }

onMounted(() => {
//  showloading();
  getMobilizer();
       provinceService.get(0);
   districtService.get(0);
  init();
});

const init = () => {
     // showloading();
    const offset = 0
    isOnlineChecker(false)
    getAllUtente()
    getDataLocalBase()
   timerToSyncronize()
   /*
    CommunityMobilizer.localDbGetAll().then(mobilizers => {
      if (mobilizers.length === 0) {
        getMobilizer()
        getAllUtente(offset)
      } else {
        console.log(mobilizers)
        mobilizers.utentes = []
        CommunityMobilizer.deleteAll()
        CommunityMobilizer.insert({
          data: mobilizers
        })
      }
       closeloading()
    })
    */
}

onBeforeUnmount(() => {
  clearInterval(timerToSyncronizeConst)
});


provide('showUtenteULinkScreen', showUtenteULinkScreen);
provide('showUtenteRegistrationScreen', showUtenteRegistrationScreen);
provide('mobilizer', mobilizer);
provide('indexEdit',indexEdit)
provide('utenteToEdit',utenteToEdit)
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
