<template>
  <div class="row q-mb-md" v-if="this.showAddButton">
                <combo-field
                    class="col"
                    v-model="province"
                    :options="provinces"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    ref="province"
                    option-value="id"
                    option-label="description"
                    :rules="[ val => ( val != null ) || ' Por favor indique a província']"
                    lazy-rules
                    label="Província" />
                <combo-field
                    class="col q-ml-md"
                     transition-show="flip-up"
                    transition-hide="flip-down"
                    v-model="district"
                    :options="districtsCombo"
                    ref="district"
                    option-value="id"
                    option-label="description"
                    :rules="[ val => ( val != null) || ' Por favor indique a Distrito']"
                    lazy-rules
                    label="Distrito" />
            </div>
    <div class="q-pt-xl">
        <q-table
        title="Unidade Sanitária"
        :rows="clinicos"
        :columns="columns"
        row-key="id"
        :filter="filter"
        binary-state-sort
        >
        <template v-slot:top-right>
            <q-input outlined dense debounce="300" v-model="filter" placeholder="Pesquisa">
            <template v-slot:append>
                <q-icon name="search" />
            </template>
            </q-input>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="type" :props="props">
              <div class="text-pre-wrap">{{ props.row.type}}</div>
            </q-td>
            <q-td key="district" :props="props">
              <div class="text-pre-wrap">{{ props.row.district !== undefined && props.row.district !== null ? props.row.district.description : ''  }}</div>
            </q-td>
            <q-td key="actions" :props="props">
             <div class="q-gutter-sm">
              <q-btn round icon="edit" color="orange" size=sm no-caps @click.stop="editClinic(props.row)">
                <q-tooltip content-class="bg-white text-primary shadow-4"
                          :offset="[10, 10]"
                          transition-show="rotate"
                          transition-hide="rotate">
                </q-tooltip>
                </q-btn>
              <!--q-btn round glossy icon="delete_forever" color="red" size=sm no-caps>
                <q-tooltip content-class="bg-red text-white shadow-4"
                          :offset="[10, 10]"
                          transition-show="rotate"
                          transition-hide="rotate">
                </q-tooltip>
                </q-btn-->
             </div>
            </q-td>
          </q-tr>
        </template>
        </q-table>
        <div class="absolute-bottom">
          <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn size="xl" fab icon="add" @click="addClinic()" no-cap color="primary"  v-if="showAddButton" />
          </q-page-sticky>
        </div>
    <!--q-table title="Unidade Sanitária" :data="this.clinicos" :columns="columns" row-key="name" binary-state-sort :filter="filter">
      <template v-slot:top-right>
      <q-input v-if="show_filter" filled borderless dense debounce="300" v-model="filter" placeholder="Pesquisa">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
      <div class="q-pa-md q-gutter-sm">
      <q-btn class="q-ml-sm" icon="filter_list" @click="show_filter=!show_filter" flat/>
        <q-btn outline rounded color="primary" icon="add" @click="show_dialog = true" no-caps/>
      </div>
      </template>
    </q-table-->
    </div>
   <q-dialog v-model="show_dialog" persistent>
    <q-card  class="q-pt-lg" style="width: 1100px; max-width: 90vw;">
     <q-toolbar>
        <q-toolbar-title class="text-subtitle1 flex-center text-width-strong">Cadastrar Unidade Sanitária</q-toolbar-title>
        <q-btn flat v-close-popup round dense icon="close" @click="show_dialog = false"/>
      </q-toolbar>
        <form @submit.prevent="validateClinic" >
            <q-card-section class="q-px-md">
               <div class="row q-mt-md">
                <input-text-field
                    ref="nome"
                    rounded
                    v-model="newClinic.name"
                    :rules="[ val => val.length >= 3 || 'O nome indicado é inválido']"
                    lazy-rules
                    class="col fild-radius"
                    label="Nome" />
            </div>
              <div class="row q-mt-md">
                <input-text-field
                    ref="code"
                    rounded
                    v-model="newClinic.code"
                    :rules="[ val => (val.length > 0 ) || 'o Codigo indicado ja existe']"
                    lazy-rules
                    class="col fild-radius"
                    label="Codigo" />
            </div>
             <div class="row q-mb-md">
                <combo-field
                    class="col"
                    v-model="newClinic.type"
                    :options="clinicTypes"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    ref="clinicType"
                    :rules="[ val => ( val.length > 0  ) || ' Por favor indique o tipo']"
                    lazy-rules
                    label="Tipo de Unidade Sanitaria" />
            </div>
             <div class="row q-mb-md">
                <combo-field
                    class="col"
                    v-model="newClinic.province"
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
                    v-model="newClinic.district"
                    :options="districts"
                    ref="district"
                    option-value="id"
                    option-label="description"
                    :rules="[ val => ( val != null) || ' Por favor indique a Distrito/Cidade']"
                    lazy-rules
                    label="Distrito/Cidade" />
            </div>
             <div class="row q-mb-md" >
                <div class="col-2">
                    <q-btn push  dense color="white" text-color="black" round icon="my_location" @click="locateMe"/>
                </div>
                <div class="col-4 q-pl-md">
                    <input-text-field v-model="newClinic.latitude" lazy-rules label="Latitude" ref="latitude" :rules="[ val => ( new String(val).length ) > 0 || 'O valor indicado é inválido ']" />
                </div>
                <div class="col-4 q-pl-md">
                    <input-text-field v-model="newClinic.longitude" lazy-rules label="Longitude" ref="longitude" :rules="[ val => new String(val).length > 0 || 'O valor indicado é inválido']" />
                </div>
            </div>
            </q-card-section>
           <q-card-actions align="right" class="q-mb-md">
                <q-btn type="submit" :loading="submitting" label="Submeter" color="primary"/>
            </q-card-actions>
        </form>
    </q-card>
   </q-dialog>
</template>

<script>
import Clinic from '../../store/models/clinic/Clinic'
import Province from 'src/store/models/province/Province'
import District from 'src/store/models/district/District'
import { ref } from 'vue'
import { useQuasar, QSpinnerIos } from 'quasar'

export default {
      props: ['clinic', 'backToDashBoard'],
    data () {
    const filter = ref('')
     const $q = useQuasar()
    return {
            filter,
            $q,
            show_dialog: false,
            show_filter: false,
            showAddButton: false,
            submitting: false,
            editedIndex: -1,
            databaseCodes: [],
            listErrors: [],
            currClinic: {},
            district: null,
            province: null,
            initialDistrict: 0,
            newClinic: {
                name: '',
                type: '',
                code: '',
                latitude: '',
                longitude: '',
                province: null,
                district: null
            },
            columns: [
                { name: 'name', align: 'left', label: 'Nome', field: row => row.name, format: val => `${val}`, sortable: true },
                { name: 'type', align: 'left', label: 'Tipo', field: row => row.type, format: val => `${val}`, sortable: true },
                { name: 'district', align: 'left', label: 'Distrito', field: row => row.district, format: val => `${val}`, sortable: true },
                { name: 'actions', label: 'Opções', field: 'actions' }
            ],
            clinico: '',
            clinicTypes: [
              '', 'Unidade fixa', 'Unidade temporária', 'Clínica móvel'
            ]
        }
    },
    created () {
        this.currClinic = Object.assign({}, this.newClinic)
           this.showLoading()
    },
      mounted () {
        const offset = 0
        if (localStorage.getItem('role') === 'ROLE_USER') {
          this.getClinicById()
        } else if (localStorage.getItem('role') === 'ROLE_ADMIN') {
        //  this.getAllClinic(offset)
        } else {
          this.getAllClinicsByDistrictId(localStorage.getItem('idLogin'))
        }
        this.getAllProvinces(offset)
        this.extractDatabaseCodes()
        this.verifyRole()
       // console.log(11 + this.provinces)
    },
    computed: {
     /*    clinicos () {
          return Clinic.query().with('province').with('district')
                   .with('district.province').where('district_id', parseInt(localStorage.getItem('idLogin'))).get()
                     return Clinic.query().with('province').with('district')
                   .with('district.province').get()
        }, */
         clinicos () {
           if (this.district != null) {
          return this.getClinicsByDistrictId()
           } else if (localStorage.getItem('role') === 'ROLE_USER') {
       return Clinic.query().with('province').with('district')
                   .with('district.province').where('id', parseInt(localStorage.getItem('id_clinicUser'))).get()
           } else {
             return []
           }
        },
          provinces () {
            return Province.query().orderBy('code').has('code').get()
        },
        districts () {
        if (this.newClinic.province !== null) {
            return District.query().withAll().where('province_id', this.newClinic.province.id).get()
        } else {
            return null
        }
        },
          districtsCombo () {
        if (this.province !== null) {
            return District.query().withAll().where('province_id', this.province.id).get()
        } else {
            return null
        }
        }
    },
    methods: {
    async getLocation () {
          return new Promise((resolve, reject) => {
            if (!('geolocation' in navigator)) {
              reject(new Error('Localização Geográfica não está disponível.'))
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
        this.newClinic.latitude = this.location.coords.latitude
        this.newClinic.longitude = this.location.coords.longitude
        this.$q.loading.hide()
      } catch (e) {
        this.gettingLocation = false
         this.errorStr = e.message
          this.$q.loading.hide()
          this.$q.dialog({
          title: 'Problema no carregamento da localização',
          message: 'Não tem permissões para aceder a localização do dispositivo ou a função de localização encontra-se desligada.\n Por favor ligue a localização ou dê as permissões de localização'
        }).onOk(() => {
            this.newClinic.latitude = -25.9678239
          this.newClinic.longitude = 32.5864914
          this.$q.loading.hide()
        })
      }
    },
    validateClinic () {
            this.$refs.nome.$refs.ref.validate()
             this.$refs.code.$refs.ref.validate()
            this.$refs.latitude.$refs.ref.validate()
            this.$refs.longitude.$refs.ref.validate()
            console.log(this.$refs.latitude.$refs.ref.validate())
            if (this.$refs.nome.$refs.ref.validate() && this.$refs.latitude.$refs.ref.validate() && this.$refs.longitude.$refs.ref.validate() && this.$refs.code.$refs.ref.validate()) {
                this.submitting = true
                this.submitClinic()
            }
        },
           getClinicsByDistrictId () {
            if (this.district != null && this.initialDistrict !== this.district.id) {
               this.$q.loading.show({
          spinner: QSpinnerIos,
          message: 'Carregando Unidades Sanitarias. Por favor, aguarde...'
        })
              this.initialDistrict = this.district.id
              this.getAllClinicsByDistrictId(this.district.id).then(resp => {
                  this.$q.loading.hide()
              })
            }
              return Clinic.query().with('province').with('district')
                   .with('district.province').where('district_id', parseInt(this.district.id)).get()
        },
        async submitClinic () {
            console.log(this.newClinic)
          if (this.editedIndex !== 0) {
            await Clinic.api().post('/clinic', this.newClinic).then(resp => {
                console.log(resp.response.data)
                this.show_dialog = false
                this.submitting = false
                this.$emit('update:backToDashBoard', true)
              this.$q.notify({
              message: 'Clínica registrada com sucesso.',
              color: 'teal'
          })
            }).catch(error => {
            this.submitting = false
            console.log(error)
            if (error.request.status !== 0) {
            const arrayErrors = JSON.parse(error.request.response)
            if (arrayErrors.total == null) {
              this.listErrors.push(arrayErrors.message)
            } else {
              arrayErrors._embedded.errors.forEach(element => {
                this.listErrors.push(element.message)
              })
            }
              this.$emit('update:backToDashBoard', true)
              this.$q.notify({
              message: 'Error: ' + this.listErrors,
              color: 'red'
              })
            console.log(this.listErrors)
          }
            })
          } else {
            await Clinic.api().patch('/clinic/' + this.newClinic.id, this.newClinic).then(resp => {
              console.log(resp.response.data)
              this.show_dialog = false
              this.submitting = false
              this.$emit('update:backToDashBoard', true)
              this.$q.notify({
              message: 'Clínica actualizada com sucesso.',
              color: 'teal'
          })
            }).catch(error => {
            this.submitting = false
            console.log(error)
            if (error.request.status !== 0) {
            const arrayErrors = JSON.parse(error.request.response)
            if (arrayErrors.total == null) {
              this.listErrors.push(arrayErrors.message)
            } else {
              arrayErrors._embedded.errors.forEach(element => {
                this.listErrors.push(element.message)
              })
            }
              this.$emit('update:backToDashBoard', true)
              this.$q.notify({
              message: 'Error: ' + this.listErrors,
              color: 'red'
              })
            console.log(this.listErrors)
          }
            })
            this.editedIndex = -1
            this.listErrors = []
          }
        },
       async getAllClinicsByDistrictId (districtId) {
           await Clinic.api().get('/clinic/district/' + districtId).then(resp => {
              console.log(resp.response.data)
            }).catch(error => {
                console.log(error)
            })
    },
     getAllClinic (offset) {
       if (this.clinicos.length === 0) {
            if (offset >= 0) {
                Clinic.api().get('/clinic?offset=' + offset + '&max=100').then(resp => {
                this.submitting = false
                offset = offset + 100
                if (resp.response.data.length > 0) {
                    setTimeout(this.getAllClinic(offset), 2)
                }
                }).catch(error => {
                console.log('Erro no code ' + error)
                })
            }
       }
        },
      addClinic () {
           if (localStorage.getItem('role') === 'ROLE_USER_DISTRICT') {
       // this.showLoading()
      this.newClinic.district = District.query().with('province').find(localStorage.getItem('idLogin'))
       this.newClinic.province = this.newClinic.district.province
     }
         this.show_dialog = true
         //  this.editMode = false
      },
    async getClinicById () {
       await Clinic.api().get('/clinic/' + localStorage.getItem('id_clinicUser')).then(resp => {
          console.log(resp.response.data)
        }).catch(error => {
            console.log(error)
        })
     },
    async getAllProvinces (offset) {
        if (offset >= 0) {
            await Province.api().get('/province?offset=' + offset + '&max=100').then(resp => {
              offset = offset + 100
              // if (resp.response.data.length > 0) { setTimeout(this.getAllProvinces(offset), 2) }
            }).catch(error => {
                console.log(error)
            })
        }
    },
    verifyRole () {
      if (localStorage.getItem('role') === 'ROLE_USER_DISTRICT' || localStorage.getItem('role') === 'ROLE_ADMIN') {
        this.showAddButton = true
      }
     },
    editClinic (clinic) {
      this.editedIndex = 0
      this.newClinic = Object.assign({}, clinic)
      this.newClinic.province = Province.query().withAll().find(clinic.district.province_id)
      this.newClinic.district = District.query().withAll().find(clinic.district_id)
      this.show_dialog = true
    },
    validateThis (code) {
      this.clinicos.forEach(element => {
            return element.code === code
             })
    },
    extractDatabaseCodes () {
        this.clinicos.forEach(element => {
            this.databaseCodes.push(element.code)
    })
    },
    navRedirect (e, go) {
      e.preventDefault() // we cancel the default navigation
      go({ query: { tab: '2', noScroll: true } })
    },
     showLoading () {
        this.$q.loading.show({
          spinner: QSpinnerIos,
          message: 'Por favor, aguarde...'
     })
        // hiding in 2s
        this.timer = setTimeout(() => {
         this.$q.loading.hide()
          this.timer = void 0
        }, 2000)
      }
    },
    components: {
        'input-text-field': require('components/Shared/InputFieldText.vue').default,
          'combo-field': require('components/Shared/ComboField.vue').default
      //  'input-number-phone-field': require('components/Shared/InputFieldPhoneNumber.vue').default
    }

}
</script>

<style>
    .fild-radius {
        border-radius: 5px;
    }
</style>
