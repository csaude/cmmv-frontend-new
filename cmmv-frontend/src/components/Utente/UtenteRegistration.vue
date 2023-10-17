<template>
  <q-page >
    <div class="row items-center q-mb-md bg-deep-orange-3">
        <div class="col q-my-sm">
            <q-btn
                flat
                round
                color="white"
                icon="chevron_left"
                @click="closeRegistrationVerification()"/>
        </div>
         <div class="row text-white text-weight-bolder justify-center">
            Registar Utente
        </div>
        <div class="col"><q-space /></div>
    </div>
    <form @submit.prevent="validateUtente">
        <div class="q-px-sm">
            <div class="row q-my-lg">Dados Pessoais</div>
            <div class="row">
                <input-text-field
                    class="col"
                    ref="nome"
                    v-model="utente.firstNames"
                    :rules="[ val => val.length >= 3 || 'O nome indicado é inválido']"
                    lazy-rules
                    label="Nome" />
            </div>
            <div class="row">
                <input-text-field
                    class="col"
                    ref="apelido"
                    v-model="utente.lastNames"
                    :rules="[ val => val.length >= 2 || 'O apelido indicado é inválido']"
                    lazy-rules
                    label="Apelido" />
            </div>
            <div class="row">
              <input-phone-code
                dense
                rounded
                  outlined
                    class="col-2">
            </input-phone-code>
                <input-number-phone-field
                    class="col"
                    ref="phone"
                    mask="#########"
                    :rules="[ val => phoneRules (val)]"
                    v-model="utente.cellNumber"
                      lazy-rules
                    label="Número de Telefone" />
            </div>
            <div class="row">
            <input-phone-code
                dense
                rounded
                  outlined
                    class="col-2">
            </input-phone-code>
                <input-number-phone-field
                    class="col"
                    ref="whatsapp"
                    mask="#########"
                      :rules="[ val => whatsapNumberRules(val)]"
                    v-model="utente.whatsappNumber"
                    label="Número de Telemovel com Whatsapp" />
            </div>
            <div class="column inline items-start example-container q-mr-sm">
                <div class="example-cell" tabindex="0"> Tem Parceira(o) ?
                    <q-radio keep-color color="orange" v-model="utente.haspartner" val="true" label="Sim" ref="hasPartnerYes" />
                    <q-radio keep-color color="orange" v-model="utente.haspartner" val="false" label="Não" ref="hasPartner"/>
                </div>
            </div>
            <div class="row q-mt-md" >
                <div class="col-8 q-pr-sm">
                    <q-input
                        dense
                        rounded outlined
                        v-model="utente.birthDate"
                        ref="birthDate"
                        label="Data de Nascimento"
                        @update:model-value="idadeCalculator(utente.birthDate)">
                        <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                 <q-date
                                    mask="DD-MM-YYYY"
                                    v-model="utente.birthDate"
                                    :options="blockDataFutura"
                                    @update:model-value="idadeCalculator(utente.birthDate)"
                                >
                                    <div class="row items-center justify-end">
                                      <q-btn v-close-popup label="Fechar" color="primary" flat />
                                    </div>

                                 </q-date>
                            </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                </div>
                <br>
                <div class="col-4 q-pl-sm">
                    <q-input
                        dense
                        label="Idade"
                        type="number"
                        ref="age"
                        rounded outlined
                        v-model="utente.age"
                        :rules="[val => (val > 14 && val < 100) || 'Digite uma idade real e maior que 14 anos de idade']"
                        lazy-rules>
                        <template v-slot:append>
                            <q-icon
                            name="autorenew"
                            class="cursor-pointer"
                            @click="birthDateCalculator (utente.age)"/>
                        </template>
                    </q-input>
                </div>
            </div>
            <div class="row q-my-lg">Endereço</div>
            <div class="row q-mb-md">
                <combo-field
                    class="col"
                    v-model="address.province"
                    :options="provinces"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    ref="province"
                    option-value="id"
                    option-label="description"
                    :rules="[ val => ( val != null ) || ' Por favor indique a província']"
                    lazy-rules
                    label="Província" />
            </div>
            <div class="row q-mb-md">
                <combo-field
                    class="col"
                     transition-show="flip-up"
                    transition-hide="flip-down"
                    v-model="address.district"
                    :options="districts"
                    ref="district"
                    option-value="id"
                    option-label="description"
                    :rules="[ val => ( val != null) || ' Por favor indique a Distrito/Cidade']"
                    lazy-rules
                    label="Distrito" />
            </div>
             <div class="row q-mb-md">
                <q-input
                    outlined
                    rounded
                    dense
                    class="col"
                    ref="bairro"
                    v-model="address.neighboorhood"
                    label="Bairro" />
            </div>
            <div class="row q-mb-md">
                <q-input
                    class="col"
                    v-model="address.residence"
                    :rules="[ val => (val.length > 0) || 'Por favor indique a residência']"
                    lazy-rules
                    outlined
                    dense
                    ref="morada"
                    type="textarea"
                    label="Residência"
                    />
            </div>
            <div class="row q-my-lg">Minha localização</div>
            <q-separator/>
            <div class="row q-mb-md">
                <q-btn push flat color="white" text-color="black" round icon="my_location" @click="locateMe"/>
                <q-input readonly v-model="address.latitude" label="Latitude" ref="latitude" />
                <q-input readonly v-model="address.longitude" label="Longitude" ref="longitude" />
            </div>
        </div>
          <div class="absolute-bottom">
          <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn size="xl" fab icon="save" type="submit" color="primary" />
          </q-page-sticky>
        </div>
    </form>
  </q-page>
</template>

<script>
 import Utente from 'src/store/models/utente/Utente'
// import Address from 'src/store/models/address/Address'
import Province from 'src/store/models/province/Province'
import District from 'src/store/models/district/District'
import { useQuasar, QSpinnerIos, date } from 'quasar'
import { ref } from 'vue'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import Localbase from 'localbase'
import Address from '../../store/models/address/Address'
 const db = new Localbase('db')
export default {
    setup () {
        return {
        }
    },
  data () {
    const $q = useQuasar()
    return {
        ageText: '',
        hoje: String(this.formatDateDDMMYYYY(new Date())),
        birthMinDate: new Date(),
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
            registerDate: '',
            addresses: [],
            communityMobilizer: {}
        },
        currUtente: {},
        selectedProvince: '',
        editedIndex: '',
        address: {
            city: '',
            residence: ' ',
            neighboorhood: '',
            latitude: '',
            longitude: '',
            district: null,
            province: null
        },
        $q,
        location: null,
        gettingLocation: false,
        errorStr: null,
        myLocation: {
            latitude: '',
            longitude: '',
            distance: ''
        }
      //  db
    }
  },
    props: ['indexEdit', 'utenteUpdate', 'mobilizer', 'showUtenteRegistrationScreenProp', 'numbers'],
    emits: ['update:showUtenteRegistrationScreenProp'],
    components: {
        'combo-field': require('components/Shared/ComboField.vue').default,
        'input-text-field': require('components/Shared/InputFieldText.vue').default,
        'input-number-phone-field': require('components/Shared/InputFieldPhoneNumber.vue').default,
        'input-phone-code': require('components/Shared/IconPhoneCode.vue').default
        // 'input-number-field': require('components/Shared/InputNumberField.vue').default
        // buttone: require('components/Shared/Button.vue').default,
        // pageHeader: require('components/Utente/UtenteRegistrationHeader.vue').default
    },
    created () {
        this.currUtente = Object.assign({}, this.utente)
        console.log(this.utenteUpdate)
        if (this.indexEdit === 0) {
            this.utente = Object.assign({}, this.utenteUpdate)
            this.utente.birthDate = moment(this.utenteUpdate.birthDate).format('DD-MM-YYYY')
            this.idadeCalculator(this.utente.birthDate) // Calculo da idade do utente
           if (this.utente.haspartner === true) {
             this.utente.haspartner = ref('true')
           } else {
               this.utente.haspartner = ref('false')
           }
            if (this.utente.addresses.length > 0) {
                this.address = this.utente.addresses[0]
                this.address.district = District.query().with('province').find(this.address.district_id)
                this.address.province = this.address.district.province
                this.address.province_id = this.address.district.province.id
            }
        } else {
           this.utente = {
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
    mounted () {
        console.log()
        if (this.address.latitude === null & this.address.longitude === null) {
            this.locateMe()
        }
    },
    computed: {
         provinces () {
           return Province.query().orderBy('code').has('code').get()
        },
        districts () {
        if (this.address.province !== null) {
            return District.query().has('code').withAll().where('province_id', this.address.province.id).get()
        } else {
            return null
        }
        }
    },
    watch: {
    },
    methods: {
        moment,
        idadeCalculator (birthDate) {
            if (moment(birthDate, 'DD/MM/YYYY').isValid()) {
               const utentBirthDate = moment(birthDate, 'DD/MM/YYYY')
               const todayDate = moment(new Date())
               const idade = todayDate.diff(utentBirthDate, 'years')
               console.log(idade)
               this.utente.age = idade
            }
        },
        birthDateCalculator (age) {
            const today = moment(new Date())
            const birthDate = moment(today).subtract(age, 'years')
            this.utente.birthDate = moment(birthDate).format('DD-MM-YYYY')
        },
        formatDateDDMMYYYY (value) {
            return date.formatDate(value, 'DD-MM-YYYY')
        },
        date: ref(moment(date).format('YYYY/MM/DD')),
        blockDataFutura (date) {
            return date <= moment(new Date()).format('YYYY/MM/DD')
        },
        closeRegistration (close) {
        this.$q.loading.show({
            spinner: QSpinnerIos,
            message: 'Por favor, aguarde...'
         })
            setTimeout(() => {
                this.$q.loading.hide()
                this.$emit('update:showUtenteRegistrationScreenProp', close)
            }, 100)
        },
        closeRegistrationVerification () {
            if ((this.address.province !== null && this.address.province !== undefined && this.address.province !== '') ||
                (this.address.residence !== null && this.address.residence !== undefined && this.address.residence.trim().length > 0) ||
                (this.utente.firstNames.length > 0) || (this.utente.lastNames.length > 0)) {
                    this.verificationDialog()
                } else {
                    this.$q.loading.show({
                    spinner: QSpinnerIos,
                    message: 'Por favor, aguarde...'
                    })
                    setTimeout(() => {
                        this.$q.loading.hide()
                        this.$emit('update:showUtenteRegistrationScreenProp', false)
                    }, 100)
            }
        },
        verificationDialog () {
            this.$q.dialog({
                title: 'Confirmação',
                message: 'Pretende voltar ao ecrã anterior?',
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
                 this.utente = {}
                 this.$emit('update:showUtenteRegistrationScreenProp', false)
            }).onCancel(() => {
                // console.log('>>>> Cancel')
            }).onDismiss(() => {
                // console.log('I am triggered on both OK and Cancel')
            })
        },

        validateUtente () {
            this.$refs.nome.$refs.ref.validate()
            this.$refs.apelido.$refs.ref.validate()
            this.$refs.phone.$refs.ref.validate()
            this.$refs.age.validate()
            this.$refs.province.$refs.ref.validate()
            this.$refs.district.$refs.ref.validate()
            this.$refs.morada.validate()
            if (!this.$refs.nome.$refs.ref.hasError && !this.$refs.apelido.$refs.ref.hasError &&
                !this.$refs.phone.$refs.ref.hasError && !this.$refs.age.hasError &&
                !this.$refs.province.hasError && !this.$refs.district.hasError && !this.$refs.morada.hasError) {
                this.saveOrUpdateUtente()
            } else {
                this.$q.loading.hide()
            }
        },
        saveOrUpdateUtente () {
            this.address.city = this.address.district.description
            this.address.province_id = this.address.province.id
            this.address.district_id = this.address.district.id
            console.log(this.address.latitude)
            console.log(this.address.longitude)
            this.utente.addresses.splice(0, 1, this.address)
            this.utente.birthDate = moment(this.utente.birthDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
            this.utente.communityMobilizer = this.mobilizer
            this.utente.communityMobilizer_id = this.mobilizer.id
             this.utente.selected = ''
             this.utente.clinic_id = ''
             this.utente.clinic = null
             if (this.utente.syncStatus === 'S' || this.utente.syncStatus === 'U') {
                  this.utente.syncStatus = 'U'
             } else {
                  this.utente.syncStatus = 'P'
             }
            if (this.utente.communityMobilizer !== null) {
                this.utente.status = 'ASSOCIADO'
            }
            if (this.utente.haspartner === 'true') {
                this.utente.haspartner = true
            } else {
                this.utente.haspartner = false
            }
            if (this.indexEdit === 1) {
            this.utente.addresses[0].id = uuidv4()
                this.utente.id = uuidv4()
                this.utente.registerDate = new Date()
                const utenteLocalBase = JSON.parse(JSON.stringify(this.utente))
                db.collection('utentes').add(utenteLocalBase)
                this.closeRegistration(false)
                Utente.insert({
                    data: utenteLocalBase
                })
            } else {
               if (this.utente.syncStatus === 'S') {
                   this.utente.syncStatus = 'U'
            }
            const utenteLocalBase = JSON.parse(JSON.stringify(this.utente))
            db.collection('utentes').doc({ id: this.utente.id }).set(utenteLocalBase)
            Utente.update({
                data: utenteLocalBase
            })
            Address.update({
                data: utenteLocalBase.addresses[0]
            })
            this.$q.notify({
                message: 'O utente ' + this.utente.firstNames + ' ' + this.utente.lastNames + ' foi actualizado com sucesso.',
                color: 'teal'
            })
            this.closeRegistration(false)
        }
    },
     phoneRules (val) {
       if (val.length === 0 || val.length < 9) {
      return 'O Número é invalido. Deve conter 9 dígitos.'
       } else if (this.validatePhonePrefix(parseInt(val.substring(0, 2)))) {
           return 'O Número é invalido. O codigo da operadora não existe'
       }
    },
    whatsapNumberRules (val) {
       if (val.length !== 0 && val.length < 9) {
      return 'O Número é invalido. Deve conter 9 dígitos.'
      } else if (val.length !== 0 && this.validatePhonePrefix(parseInt(val.substring(0, 2)))) {
           return 'O Número é invalido. O codigo da operadora não existe'
      }
    },
    validatePhonePrefix (val) {
         if ((val !== 82) && (val !== 83) && (val !== 84) && (val !== 85) && (val !== 86) && (val !== 87)) {
             return true
         }
    },
    editaUtente (utente) {
      this.editedIndex = 0
      this.utente = Object.assign({}, utente)
      console.log(utente)
    //   this.address.city = this.address.district.description
    //   this.utente.addresses.push(this.address)
    //   this.utente.birthDate = new Date(this.utente.birthDate)
    //   this.utente.communityMobilizer = this.mobilizer
    //   this.utente.communityMobilizer_id = this.mobilizer.id
    },
    async getLocation () {
          return new Promise((resolve, reject) => {
            if (!('geolocation' in navigator)) {
              reject(new Error('Localização Geográfica não está disponível. Por favor, ligue a Localização Geográfica no seu dispositivo.'))
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
        this.address.latitude = this.location.coords.latitude
        this.address.longitude = this.location.coords.longitude
        this.$q.loading.hide()
      } catch (e) {
        this.gettingLocation = false
         this.errorStr = e.message
          this.$q.loading.hide()
          this.$q.dialog({
          title: 'Problema no carregamento da localização',
          message: 'Não tem permissões para aceder a localização do dispositivo ou a função de localização encontra-se desligada.\n Por favor ligue a localização ou dê as permissões de localização'
        }).onOk(() => {
            this.address.latitude = -25.9678239
          this.address.longitude = 32.5864914
          this.$q.loading.hide()
        })
      }
    }
  }
}
</script>
