<template>
<div class="row q-mb-md">
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
                    :options="districts"
                    ref="district"
                    option-value="id"
                    option-label="description"
                    :rules="[ val => ( val != null) || ' Por favor indique a Distrito']"
                    lazy-rules
                    label="Distrito" />
            </div>
<div class="q-pt-xl">
        <q-table
        title="Mobilizadores"
        :rows="mobilizers"
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
            <q-td key="firstNames" :props="props">
              {{ props.row.firstNames }}
            </q-td>
            <q-td key="lastNames" :props="props">
              <div class="text-pre-wrap">{{ props.row.lastNames}}</div>
            </q-td>
             <q-td key="cellNumber" :props="props">
              <div class="text-pre-wrap">{{ props.row.cellNumber}}</div>
            </q-td>
            <q-td key="actions" :props="props">
             <div class="q-gutter-sm">
              <q-btn round icon="edit" color="orange" size=sm no-caps @click.stop="editMobilizer(props.row)">
                <q-tooltip class="bg-grey-5">Editar</q-tooltip>
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
            <q-btn size="xl" fab icon="add" @click="addMobilizer" no-cap color="primary" />
          </q-page-sticky>
        </div>
          <q-dialog persistent v-model="showMobilizerRegistrationScreen">
          <addMobilizer
            :selectedMobilizer="mobilizer"
             :editMode=editMode
            @close="showMobilizerRegistrationScreen = false" />
      </q-dialog>
    </div>
</template>

<script>
import CommunityMobilizer from '../../store/models/mobilizer/CommunityMobilizer'
// import { MobilizerLogin } from '../../store/models/userLogin/MobilizerLogin'
import Province from 'src/store/models/province/Province'
import District from 'src/store/models/district/District'
import { QSpinnerIos } from 'quasar'
import { ref } from 'vue'
export default {
   props: ['backToDashBoard'],
    data () {
      const filter = ref('')
        return {
            mobilizer: new CommunityMobilizer(),
            mobilizerLogin: {},
            province: null,
            district: null,
               showMobilizerRegistrationScreen: false,
                editMode: false,
                 initialDistrict: 0,
                filter,
            columns: [
                { name: 'firstNames', align: 'left', label: 'Nome', field: row => row.firstNames, format: val => `${val}`, sortable: true },
                { name: 'lastNames', align: 'left', label: 'Apelido', field: row => row.lastNames, format: val => `${val}`, sortable: true },
                { name: 'cellNumber', align: 'left', label: 'Número de Telefone', field: row => row.cellNumber, format: val => `${val}`, sortable: true },
                { name: 'actions', label: 'Opções', align: 'left', field: 'actions' }
            ]
        }
    },
     mounted () {
        this.getAllProvinces()
      CommunityMobilizer.apiFetchByDistrictId(localStorage.getItem('idLogin'))
    },
    computed: {
        provinces () {
           return Province.query().orderBy('code').has('code').get()
        },
        districts () {
        if (this.province !== null) {
            return District.query().withAll().where('province_id', this.province.id).get()
        } else {
            return null
        }
        },
        // mobilizers () {
         //   return CommunityMobilizer.query().has('firstNames').get()
       // }
         mobilizers () {
           if (this.district != null) {
          return this.getMobilizersByDistrictId()
           } else {
             return []
           }
        }
    },
    created () {
      this.showLoading()
        this.mobilizer.clinic = Object.assign({}, this.clinic)
    },
    methods: {
       addMobilizer () {
          this.mobilizer = new CommunityMobilizer()
         this.showMobilizerRegistrationScreen = true
           this.editMode = false
      },
      editMobilizer (mobilizer) {
        this.mobilizer = Object.assign({}, mobilizer)
         this.showMobilizerRegistrationScreen = true
         this.editMode = true
      },
        getAllProvinces (offset) {
        if (this.provinces.length <= 0) {
                Province.api().get('/province').then(resp => {
                    offset = offset + 100
                    if (resp.response.data.length > 0) { setTimeout(this.getAllProvinces(offset), 2) }
                }).catch(error => {
                    console.log(error)
                })
        }
    },
     getMobilizersByDistrictId () {
            if (this.district != null && this.initialDistrict !== this.district.id) {
               this.$q.loading.show({
          spinner: QSpinnerIos,
          message: 'Carregando Mobilizadores. Por favor, aguarde...'
        })
              this.initialDistrict = this.district.id
              CommunityMobilizer.apiFetchByDistrictId(this.district.id).then(resp => {
                  this.$q.loading.hide()
              })
            }
              return CommunityMobilizer.query().has('firstNames').where('district_id', parseInt(this.district.id)).get()
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
         addMobilizer: require('components/Clinic/AddMobilizer.vue').default,
           'combo-field': require('components/Shared/ComboField.vue').default
    }

}
</script>

<style>
    .fild-radius {
        border-radius: 5px;
    }
</style>
