<template>
  <div class="q-pa-sm q-gutter-sm">
    <q-dialog v-model="showdialog" persistent>
    <q-layout view="Lhh lpR fff" container class="bg-white">
    <q-header class="bg-primary">
      <q-toolbar>
        <q-toolbar-title class="text-subtitle1 flex-center">Ligar o Utente a uma Unidade Sanitária</q-toolbar-title>
        <q-btn flat v-close-popup round dense icon="close" @click="closeRegistration(false)"/>
      </q-toolbar>
    </q-header>
      <q-page-container>
        <q-page padding>
        <q-card>
        <q-card-section>
         <q-item-section class="flex-center">
          <q-avatar size="100px">
            <q-img src="../../assets/userLogedIn.jpg"/>
          </q-avatar>
        </q-item-section>
        <div class="text-h5 text-center" v-if="utente !== null">
         {{utente.firstNames}} {{utente.lastNames}}
        </div>
        <div class="text-subtitle1 text-grey text-center">
          {{utente.cellNumber}}
        </div>
      </q-card-section>
      </q-card>
      <q-separator/>
        <div class="col q-pa-lg text-subtitle1 text-weight-bolder flex-center ellipsis">
            Associar a Unidade Sanitária Preferida
        </div>
          <q-separator/>
          <div >
              <q-stepper
                v-model="step"
                ref="stepper"
                alternative-labels
                color="primary"
                animated>
                <q-step
                  :name="1"
                  icon="my_location"
                  title="1º Passo"
                  :done="step > 1"
                  v-if=isOn
                  :header-nav="step > 1">
                  <div class="col text-subtitle1 text-weight-bolder ellipsis">
                          Minha localização e Raio de Pesquisa de US
                  </div>
                  <q-separator/>
                  <div class="row q-pa-sm q-gutter-sm">
                        <q-btn push flat color="white" text-color="black" round icon="my_location" @click="locateMe"/>
                        <q-input readonly v-model="myLocation.latitude" label="Latitude" />
                        <q-input readonly v-model="myLocation.longitude" label="Longitude" />
                  </div>
                  <div class="q-gutter-md">
                        <q-select v-model="myLocation.distance" :disable="myLocation.longitude.length <= 0" :options="rangekm" label="Raio de Pesquisa" />
                  </div>
                  <q-stepper-navigation class="row justify-center">
                    <q-btn flat icon-right="navigate_next" :disable="myLocation.distance.length <= 0" @click="() => { this.getClinicInRange ('K'); done1 = true; step = 2 }" color="primary" label="Próximo" />
                  </q-stepper-navigation>
                </q-step>
                <q-step
                  :name="2"
                  title="2º Passo"
                  icon="place"
                  :done="step > 2"
                  :header-nav="step > 2">
                  <q-list v-if="this.clinics.length > 0" bordered padding class="rounded-borders text-primary">
                    <q-item v-for="clinic in this.clinics" :key="clinic.id"
                      clickable
                      v-ripple
                      :active="link === clinic"
                      @click="link = clinic"
                      active-class="my-menu-link">
                      <q-item-section avatar>
                        <q-icon name="place" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{clinic.name}}</q-item-label>
                        <q-item-label caption>{{clinic.type}}</q-item-label>
                      </q-item-section>
                      <q-item-section side top  v-if=isOn>
                        <q-item-label>{{clinic.distance}}Km</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                  <q-list v-else separator>
                      <q-item v-ripple>
                        <q-item-section avatar>
                          <q-icon color="red" name="mood_bad" />
                        </q-item-section>
                      <q-item-section class="text-left">Sem resultados na lista</q-item-section>
                    </q-item>
                  </q-list>
                  <q-stepper-navigation class="row justify-center">
                    <q-btn flat icon="chevron_left" @click="step = 1" color="primary" label="voltar" class="q-ml-sm"  v-if=isOn />
                    <q-btn flat icon-right="chevron_right" :disable="this.link.length >= 0" @click="() => { done2 = true; step = 3 }" color="primary" label="Próximo" />
                  </q-stepper-navigation>
                </q-step>
                <q-step
                  :name="3"
                  title="3º Passo"
                  icon="book_online"
                  :header-nav="step > 3">
                   <div class="col text-subtitle1 text-weight-bolder ellipsis">
                          Marcação da Consulta
                   </div>
                    <q-separator/>
                        <div class="q-pa-sm q-gutter-md row items-start justify-center">
                        <q-input v-model="appointment.appointmentDate" label="Data da Consulta">
                            <template v-slot:prepend>
                              <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy transition-show="scale" transition-hide="scale" ref="qDateProxy">
                                  <q-date
                                    v-model="appointment.appointmentDate"
                                    :options="blockDataPassado"
                                    mask="DD-MM-YYYY">
                                    <div class="row items-center justify-end">
                                      <q-btn v-close-popup label="Fechar" color="primary" flat />
                                    </div>
                                  </q-date>
                                </q-popup-proxy>
                              </q-icon>
                            </template>
                          </q-input>
                        </div>
                  <q-stepper-navigation class="row justify-center">
                    <q-btn flat icon="chevron_left" @click="step = 2" color="primary" label="Back" class="q-ml-sm" />
                    <q-btn rounded color="primary" :loading="this.submitting" :disable="appointment.appointmentDate.length <=0" @click="() => { this.associar(); done3 = true; this.submitting = true}" label="Associar" />
                  </q-stepper-navigation>
                </q-step>
              </q-stepper>
            </div>
        </q-page>
    </q-page-container>
    </q-layout>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import { date, useQuasar, QSpinnerIos } from 'quasar'
import Clinic from '../../store/models/clinic/Clinic'
// import Appointment from 'src/store/models/appointment/Appointment'
import CommunityMobilizer from 'src/store/models/mobilizer/CommunityMobilizer'
import moment from 'moment'
import Utente from '../../store/models/utente/Utente'
import Appointment from '../../store/models/appointment/Appointment'
// import District from '../../store/models/district/District'
// import { UserLogin } from '../../store/models/userLogin/UserLoginHierarchy'
import { v4 as uuidv4 } from 'uuid'
import isOnline from 'is-online'
// import db from 'src/store/localbase'
export default {
    props: ['utente', 'showUtenteULinkScreen', 'activeUSForm', 'isOn', 'showDialog'],
    emits: ['update:showUtenteULinkScreen', 'update:utente', 'update:utente.appointments'],
    data () {
        const $q = useQuasar()
        return {
            filter: ref(''),
            selected: ref([]),
            step: ref(1),
            link: ref(''),
            clinics: [],
            submitting: false,
            $q,
            location: null,
            gettingLocation: false,
            errorStr: null,
            hourOptionsTime1: [8, 9, 10, 11, 12, 13, 14],
            minuteOptionsTime1: [0, 15, 30, 45],
            myLocation: {
                latitude: '',
                longitude: '',
                distance: ''
            },
            rangekm: [
              '<1km', '1km - 5km', '5km - 10km', '>10km'
            ],
            appointment: {
                appointmentDate: '',
                time: '',
                clinic: {},
                utente: {},
                status: ''
            },
            optionsFn (newDate) {
                return newDate >= date.formatDate(new Date(), 'YYYY-MM-DD HH:mm')
            },
            isOnline,
            columns: [
            {
              name: 'name',
              required: true,
              label: 'Unidade Sanitária',
              align: 'left',
              field: row => row.name,
              format: val => `${val}`,
              sortable: true
            },
            {
              name: 'distance',
              align: 'center',
              label: 'Distancia',
              field: row => row.distance,
              format: val => `${val}`,
              sortable: true
            }
          ]
        }
    },
    computed: {
         showdialog: {
          get () {
            return this.showUtenteULinkScreen
          },
          set (showUtenteULinkScreen) {
            this.$emit('update:showdialog', showUtenteULinkScreen)
        }
      },
      relatedUtente: {
        get () {
            return this.utente
          },
          set (utente) {
            Utente.update(utente)
            this.$emit('update:utente', utente)
        }
      },
      mobilizer: {
      get () {
        return CommunityMobilizer.query().with('utentes').find(this.$route.params.id)
      },
      set (mobilizer) {
        CommunityMobilizer.update(mobilizer)
      }
    }
    },
    methods: {
      moment,
        date: ref(moment(date).format('YYYY/MM/DD')),
        blockDataPassado (date) {
            return date >= moment(new Date()).format('YYYY/MM/DD')
        },
     async associar () {
            const newDate = new Date(this.appointment.appointmentDate, 'DD-MM-YYYY')
            this.relatedUtente.clinic = this.link
            this.relatedUtente.status = 'ENVIADO'
            if (this.relatedUtente.syncStatus === 'S' || this.relatedUtente.syncStatus === 'U' || this.relatedUtente.syncStatus === null) {
                  this.relatedUtente.syncStatus = 'U'
             } else {
                  this.relatedUtente.syncStatus = 'P'
             }
          this.appointment.id = uuidv4()
          this.appointment.clinic = this.link
          this.appointment.status = 'PENDENTE'
          this.appointment.hasHappened = false
          this.appointment.orderNumber = 1
          this.appointment.visitDate = null
          this.appointment.appointmentDate = moment(this.appointment.appointmentDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
          this.appointment.time = newDate.getHours() + ':' + newDate.getMinutes()
          this.appointment.utente = this.relatedUtente
          this.appointment.utente.id = this.relatedUtente.id
          const appointmentLocalBase = JSON.parse(JSON.stringify(this.appointment))
          this.relatedUtente.appointments.push(appointmentLocalBase)
          const relatedUtenteLocalBase = JSON.parse(JSON.stringify(this.relatedUtente))
          Appointment.localDbAdd(appointmentLocalBase)
          Utente.localDbUpdate(relatedUtenteLocalBase)
          Appointment.insert({ data: this.appointment })
          this.submitting = false
          this.closeRegistration(false)
          this.$emit('update:utente', this.relatedUtente)
        },
        closeRegistration (close) {
          this.showdialog = ref(close)
          this.step = 1
          this.appointment = {}
          this.submitting = false
          this.$emit('update:showDialog', false)
           this.activeUSForm(close, this.utente)
          this.$emit('update:showUtenteULinkScreen', close)
        },
        async getLocation () {
          return new Promise((resolve, reject) => {
            if (!('geolocation' in navigator)) {
              reject(new Error('Localização Geográfica não está disponível.' +
                                'Por favor, ligue a Localização Geográfica no seu dispositivo.'))
        }
        navigator.geolocation.getCurrentPosition(pos => {
          resolve(pos)
        }, err => {
          reject(err)
        })
      })
    },
    async locateMe () {
        this.$q.loading.show({
          spinner: QSpinnerIos,
          message: 'Carregando a sua localização. Por favor, aguarde...'
        })
      this.gettingLocation = true
      try {
        this.gettingLocation = false
        this.location = await this.getLocation()
         this.myLocation.latitude = this.location.coords.latitude
         this.myLocation.longitude = this.location.coords.longitude
        this.$q.loading.hide()
      } catch (e) {
        this.gettingLocation = false
         this.errorStr = e.message
          this.$q.loading.hide()
          this.$q.dialog({
          title: 'Problema no carregamento da localização',
          message: 'Não tem permissões para aceder a localização do dispositivo ou a função de localização encontra-se desligada.\n Por favor ligue a localização ou dê as permissões de localização \n O sistema vai assumir coordenadas padrão!'
        }).onOk(() => {
          this.myLocation.latitude = -25.967845 // -25.967845
          this.myLocation.longitude = 32.586704 // 32.586704
          this.$q.loading.hide()
        })
      }
    },
    getDistance (lat1, lon1, lat2, lon2, unit) {
      if ((lat1 === lat2) && (lon1 === lon2)) {
        return 0
      } else {
        const radlat1 = Math.PI * lat1 / 180
        const radlat2 = Math.PI * lat2 / 180
        const theta = lon1 - lon2
        const radtheta = Math.PI * theta / 180
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
        if (dist > 1) {
          dist = 1
        }
        dist = Math.acos(dist)
        dist = dist * 180 / Math.PI
        dist = dist * 60 * 1.1515
        if (unit === 'K') { dist = dist * 1.609344 }
        if (unit === 'N') { dist = dist * 0.8684 }
        return dist
      }
    },
    round (value, precision) {
    const multiplier = Math.pow(10, precision || 0)
    return Math.round(value * multiplier) / multiplier
    },
    getClinicInRange (unit) {
      let calcDist = 0
      let clinic = {}
      this.clinics = []
      console.log(this.myLocation.distance)
      for (clinic of Clinic.query().with('province.*').with('district.*').where('district_id', this.mobilizer.district_id).get()) {
         console.log(clinic)
        if (clinic.longitude !== undefined && clinic.longitude !== null) {
        if (this.myLocation.distance.includes('<1km')) {
          calcDist = this.getDistance(this.myLocation.latitude, this.myLocation.longitude, clinic.latitude, clinic.longitude, unit)
          if (calcDist <= 1000) {
            clinic.distance = this.round(calcDist / 1000, 3)
            this.clinics.push(clinic)
          }
        } else {
              if (this.myLocation.distance.includes('1km - 5km')) {
                 calcDist = this.getDistance(this.myLocation.latitude, this.myLocation.longitude, clinic.latitude, clinic.longitude, unit)
                  if (calcDist > 1000 && calcDist <= 5000) {
                    clinic.distance = this.round(calcDist / 1000, 2)
                    this.clinics.push(clinic)
                  }
              } else {
                if (this.myLocation.distance.includes('5km - 10km')) {
                    calcDist = this.getDistance(this.myLocation.latitude, this.myLocation.longitude, clinic.latitude, clinic.longitude, unit)
                     console.log(calcDist)
                    if (calcDist > 5000 && calcDist <= 10000) {
                      clinic.distance = this.round(calcDist / 1000, 2)
                      this.clinics.push(clinic)
                    }
                  } else {
                      calcDist = this.getDistance(this.myLocation.latitude, this.myLocation.longitude, clinic.latitude, clinic.longitude, unit)
                      if (calcDist > 10000) {
                          clinic.distance = this.round(calcDist / 100, 2)
                          this.clinics.push(clinic)
                    }
                  }
                }
              }
          }
        }
        return this.clinics
      }
    },
    created () {
    },
 mounted () {
 },
  watch: {
        showUtenteULinkScreen: function (newVal, oldVal) {
          console.log('Prop changed: ', newVal, ' | was: ', oldVal)
           if (!this.isOn) {
             this.getClinicInRange('K')
      this.done1 = true
       this.step = 2
           } else {
               this.done1 = false
       this.step = 1
           }
           if (this.myLocation.latitude !== undefined && this.myLocation.latitude !== null) {
      this.myLocation.latitude = ''
      this.myLocation.longitude = ''
      this.myLocation.distance = ''
      this.link = ref('')
      this.appointment.appointmentDate = ''
      this.submitting = false
     }
        }
        },
    components: {
        // buttone: require('components/Shared/Button.vue').default
        // pageHeader: require('components/Utente/UtenteRegistrationHeader.vue').default
    }
}
</script>
<style lang="sass">
.my-menu-link
  color: white
  background: #f5997a
</style>

