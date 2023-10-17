<template>
    <div class="q-pt-xl">
        <q-table
        title="Utilizadores"
        :rows="users"
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
            <q-td key="fullName" :props="props">
              {{ props.row.fullName }}
            </q-td>
            <q-td key="username" :props="props">
              <div class="text-pre-wrap">{{ props.row.username}}</div>
            </q-td>
            <q-td key="actions" :props="props">
             <div class="q-gutter-sm">
              <!--  <q-btn round icon="edit" color="orange" size=sm no-caps @click.stop="editUser(props.row)">
                          <q-tooltip class="bg-grey-5">Editar</q-tooltip>
                </q-btn>  -->
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
            <q-btn size="xl" fab icon="add" @click="addUser" no-cap color="primary" />
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
  <q-card style="width: 700px; max-width: 80vw;" class="q-pt-lg">
   <q-toolbar>
        <q-toolbar-title class="text-subtitle1 flex-center text-width-strong">Cadastrar Utilizador</q-toolbar-title>
        <q-btn flat v-close-popup round dense icon="close" @click="show_dialog = false"/>
      </q-toolbar>
        <form @submit.prevent="validateUser" >
            <q-card-section class="q-px-md">
             <div class="row q-mt-md">
                <input-text-field
                    ref="nome"
                    square
                    v-model="user.firstNames"
                    :rules="[ val => val.length >= 3 || 'O nome indicado é inválido']"
                    lazy-rules
                    class="col fild-radius"
                    label="Nome" />
            </div>
            <div class="row">
                <input-text-field
                    class="col"
                    ref="apelido"
                    square
                    v-model="user.lastNames"
                    :rules="[ val => val.length >= 2 || 'O apelido indicado é inválido']"
                    lazy-rules
                    label="Apelido" />
            </div>
             <div class="row q-mt-md">
                <input-text-field
                    ref="username"
                    square
                    v-model="user.username"
                    :rules="[ val => val.length >= 3 || 'O nome do utilizador indicado é inválido']"
                    lazy-rules
                    class="col fild-radius"
                    label="Nome de Utilizador" />
            </div>
            <div class="row">
                <q-input
                    v-model="user.password"
                     dense
                   rounded
                   outlined
                    square
                     class="col"
                    label="Senha"
                    :rules="[ val => val.length >= 4 || 'A senha deve ter um minimo de 4 caracteres']"
                    ref="password"
                    :type="isPwd ? 'password' : 'text'">
                    <template v-slot:append>
                        <q-icon
                            :name="isPwd ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="isPwd = !isPwd"
                            color="primary"
                        />
                    </template>
                </q-input>
            </div>
             <div class="row q-mb-md" v-if="!hideFields">
                      <q-select
                    dense outlined
                    class="col"
                    v-model="user.role"
                    :options="userRoles"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    ref="role"
                    :rules="[ val => ( val != null ) || ' Por favor indique o role do utilizador']"
                    lazy-rules
                    label="Perfil *" />
            </div>
             <div class="row q-mb-md" v-if="!hideFields">
                   <q-select
                    dense outlined
                    class="col"
                    :options="provinces"
                      v-model="province"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    ref="province"
                    :disable="disableFields"
                    option-value="id"
                    option-label="description"
                    :rules="[ val => ( val != null ) || ' Por favor indique a província']"
                    lazy-rules
                    label="Província" />
            </div>
            <div class="row q-mb-md" v-if="!hideFields">
                  <q-select
                    dense outlined
                    class="col"
                     transition-show="flip-up"
                    transition-hide="flip-down"
                    v-model="district"
                    :options="districts"
                    ref="district"
                    :disable="disableFields"
                    option-value="id"
                    option-label="description"
                    :rules="[ val => ( val != null) || ' Por favor indique a Distrito/Cidade']"
                    lazy-rules
                    label="Distrito" />
            </div>
         <div class="row q-mb-md" v-if="this.isRoleAdm === true">
                   <q-select
                    dense outlined
                    class="col"
                    :options="displayClinics"
                     v-model="user.clinic"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    ref="clinica"
                    option-value="id"
                    option-label="name"
                    :rules="[ val => ( val != null ) || ' Por favor indique a Clinica']"
                    lazy-rules
                    label="Unidade Sanitária" />
            </div>
            </q-card-section>
           <q-card-actions align="right" class="q-mb-md">
                <q-btn label="Cancelar" color="primary" @click="show_dialog = false"/>
                <q-btn type="submit" :loading="this.submitting" label="Submeter" color="primary" />
            </q-card-actions>
        </form>
    </q-card>
       </q-dialog>
     <q-dialog v-model="show_error_dialog">
        <div v-if="listErrors.length > 0" class="q-pa-sm q-gutter-sm" style="max-width: 550px; max-height: 150px;border-radius: 10px; border: 1px solid #cb4646; margin: 5px; background-color: #ead8da">
          <ul class="list-group alert alert-danger">
            <li class="list-group-item text-negative q-pl-xs text-weight-regular text-caption"
                v-for="item in listErrors" :key="item">
              {{ item }}
            </li>
          </ul>
        </div>
     </q-dialog>
</template>
<script>
// import CommunityMobilizer from '../../store/models/mobilizer/CommunityMobilizer'
import Province from 'src/store/models/province/Province'
import { UserLogin, DistrictUserLogin } from 'src/store/models/userLogin/UserLoginHierarchy'
import District from 'src/store/models/district/District'
import Clinic from 'src/store/models/clinic/Clinic'
// import UsersService from '../../services/UsersService'
import { ref } from 'vue'
import { QSpinnerIos } from 'quasar'
export default {
    data () {
        // const $q = useQuasar()
        const filter = ref('')
        return {
            user: new UserLogin(),
            userDistrict: new DistrictUserLogin(),
        /*    user: {
                firstNames: '',
                lastNames: '',
                fullName: '',
                password: '',
                role: '',
                clinic: null,
            }, */
            isPwd: ref(true),
            province: null,
            show_dialog: false,
            show_error_dialog: false,
            editMode: false,
            submitting: false,
            listErrors: [],
            district: '',
            disableFields: ref(false),
            hideFields: ref(false),
            initialDistrict: 0,
             filter,
           // isRole: ref(false),
            // clinic: '',
            columns: [
                { name: 'fullName', align: 'left', label: 'Nome Completo', field: row => row.fullName, format: val => `${val}`, sortable: true },
                { name: 'username', align: 'left', label: 'Utilizador', field: row => row.username, format: val => `${val}`, sortable: true }
          //      { name: 'actions', label: 'Opções', field: 'actions' }
            ],
            userRoles: [
             'Utilizador na US', 'Administrador Distrital'
            ]
        }
    },
     mounted () {
      //  const provinceOffset = 0
      //  this.getAllProvinces(provinceOffset)
      // this.showLoading()
     if (localStorage.getItem('role') === 'ROLE_ADMIN') {
       UserLogin.apiGetAll()
     } else if (localStorage.getItem('role') === 'ROLE_USER') {
       this.getAllUsersByClinicId(localStorage.getItem('id_clinicUser'))
     } else if (localStorage.getItem('role') === 'ROLE_USER_DISTRICT') {
       this.getAllUsersByDistrictId(localStorage.getItem('idLogin'))
     }
    },
    computed: {
          provinces () {
            return Province.query().orderBy('code').has('code').get()
        },
        districts () {
        if (this.province !== null) {
            return District.query().has('code').withAll().where('province_id', this.province.id).get()
        } else {
            return null
        }
        },
        displayClinics () {
   /*  if (this.district !== null) {
            return Clinic.query().with('province')
                   .with('district.province').has('code').where('district_id', this.district.id).get()
        } else {
            return null
        } */
         if (this.district != null) {
          return this.getClinicsByDistrictId()
           } else {
             return []
           }
        },
        users () {
            return UserLogin.all()
        },
        isRoleAdm () {
          if (this.user.role === 'Utilizador na US' && localStorage.getItem('role') !== 'ROLE_USER') {
            return true
          }
          return false
        }
    },
    created () {
    //    this.mobilizer.clinic = Object.assign({}, this.clinic)
      this.showLoading()
    },
    methods: {
        async getAllUsersByClinicId (clinicId) {
           await UserLogin.api().get('/userLogin/clinic/' + clinicId).then(resp => {
                console.log(resp.response.data)
            }).catch(error => {
                console.log(error)
            })
        },
         async getAllUsersByDistrictId (districtId) {
           await UserLogin.api().get('/districtUserLogin/district/' + districtId).then(resp => {
                console.log(resp.response.data)
            }).catch(error => {
                console.log(error)
            })
        },
         async getAllClinicsByDistrictId (districtId) {
           await Clinic.api().get('/clinic/district/' + districtId).then(resp => {
              console.log(resp.response.data)
            }).catch(error => {
                console.log(error)
            })
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
     validateUser () {
         this.$refs.role.validate()
        this.$refs.nome.$refs.ref.validate()
        this.$refs.apelido.$refs.ref.validate()
        this.$refs.password.validate()
         this.$refs.province.validate()
         this.$refs.username.$refs.ref.validate()
        this.$refs.district.validate()
        if (!this.$refs.nome.$refs.ref.hasError && !this.$refs.apelido.$refs.ref.hasError &&
            !this.$refs.password.hasError && !this.$refs.username.$refs.ref.hasError &&
            !this.$refs.role.hasError && !this.$refs.province.hasError &&
            !this.$refs.district.hasError) {
            this.submitUser()
        }
     },
        submitUser () {
           this.submitting = true
           this.listErrors = []
       //   this.user.username = this.user.firstNames.substring(0, 1) + this.user.lastNames.trim()
           this.user.fullName = this.user.firstNames + ' ' + this.user.lastNames
            if (this.user.role === 'Administrador Distrital') {
            //  this.user = DistrictLogin()
               this.userDistrict = Object.assign({}, this.user)
             this.userDistrict.province = this.province
              this.userDistrict.district = this.district
            }
             UserLogin.api().post(this.getStringUserType(), this.getObjectToSend()).then(resp => {
              console.log(resp.response.data)
              this.show_dialog = false
              this.submitting = false
              this.$emit('update:show_dialog', false)
              this.$q.notify({
              message: 'Utilizador registrado com sucesso.',
              color: 'teal'
          })
            }).catch(error => {
            this.submitting = false
            this.show_error_dialog = true
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
            console.log(this.listErrors)
            }
            })
        },
          addUser () {
            this.user = new UserLogin()
            this.province = null
            this.district = null
         if (localStorage.getItem('role') === 'ROLE_USER_DISTRICT') {
      this.user.role = 'Utilizador na US'
      this.district = District.query().with('province').find(localStorage.getItem('idLogin'))
        this.province = this.district.province
        this.disableFields = true
          this.hideFields = true
     } else if (localStorage.getItem('role') === 'ROLE_USER') {
       this.user.role = 'Utilizador na US'
         this.user.clinic = Clinic.query().with('province').with('district.province').find(localStorage.getItem('id_clinicUser'))
          this.province = this.user.clinic.district.province
       this.district = this.user.clinic.district
        this.disableFields = true
        this.hideFields = true
     }
         // this.user.role = 'Utilizador Clinica'
         this.show_dialog = true
      },
       editUser (user) {
      this.editedIndex = 0
      this.user = Object.assign({}, user)
    //  this.newClinic.province = Province.query().withAll().find(clinic.province_id)
    //  this.newClinic.district = District.query().withAll().find(clinic.district_id)
      this.show_dialog = true
    },
    getStringUserType () {
     if (this.user.role === 'Utilizador na US') {
       return '/userLogin'
     } else if (this.user.role === 'Administrador Distrital') {
        return '/districtUserLogin'
     } else if (this.user.role === 'Mobilizador') {
        return '/mobilizerLogin'
     }
    },
     getObjectToSend () {
       if (this.user.role === 'Utilizador na US') {
       return this.user
     } else if (this.user.role === 'Administrador Distrital') {
        return this.userDistrict
     } else if (this.user.role === 'Mobilizador') {
        return '/mobilizerLogin'
     }
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
          'input-text-field': require('components/Shared/InputFieldText.vue').default
    }

}
</script>

<style>
    .fild-radius {
        border-radius: 5px;
    }
</style>
