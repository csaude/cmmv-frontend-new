<template>
  <div class="row q-mb-md" v-if="showAddButton">
                <comboField
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
                <comboField
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
    <!--q-table title="Unidade Sanitária" :data="clinicos" :columns="columns" row-key="name" binary-state-sort :filter="filter">
      <template v-slot:top-right>
      <q-input v-if="show_filter" filled borderless dense debounce="300" v-model="filter" placeholder="Pesquisa">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
      <div class="q-pa-md q-gutter-sm">
      <q-btn class="q-ml-sm" icon="filter_list" @click="show_filter=!show_filter" flat/>
        <q-btn outline rounded color="primary" icon="add" @click="show_dialog.value = true" no-caps/>
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
                <inputTextField
                    ref="nome"
                    rounded
                    v-model="newClinic.name"
                    :rules="[ val => val.length >= 3 || 'O nome indicado é inválido']"
                    lazy-rules
                    class="col fild-radius"
                    label="Nome" />
            </div>
              <div class="row q-mt-md">
                <inputTextField
                    ref="code"
                    rounded
                    v-model="newClinic.code"
                    :rules="[ val => (val.length > 0 ) || 'o Codigo indicado ja existe']"
                    lazy-rules
                    class="col fild-radius"
                    label="Codigo" />
            </div>
             <div class="row q-mb-md">
                <comboField
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
                <comboFields
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
                <comboField
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
                    <inputTextField v-model="newClinic.latitude" lazy-rules label="Latitude" ref="latitude" :rules="[ val => ( new String(val).length ) > 0 || 'O valor indicado é inválido ']" />
                </div>
                <div class="col-4 q-pl-md">
                    <inputTextField v-model="newClinic.longitude" lazy-rules label="Longitude" ref="longitude" :rules="[ val => new String(val).length > 0 || 'O valor indicado é inválido']" />
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

<script setup>
import Clinic from '../../stores/models/clinic/Clinic'
import Province from 'src/stores/models/province/Province'
import District from 'src/stores/models/district/District'
import { onBeforeMount, onMounted, computed,ref } from 'vue'
import { useQuasar, QSpinnerIos } from 'quasar'
import { useLoading } from 'src/composables/shared/loading/loading';
// components
import inputTextField from 'components/Shared/InputFieldText.vue'
import comboField from 'components/Shared/ComboField.vue'
import clinicService from 'src/services/api/clinic/clinicService'
import provinceService from 'src/services/api/province/provinceService'
import districtService from 'src/services/api/district/districtService'



const { closeLoading, showloading } = useLoading();
    const  props = defineProps( ['clinic', 'backToDashBoard'])

    const filter = ref('')
     const $q = useQuasar()


          const  show_dialog = ref(false)
            const showAddButton =ref(false)
            const submitting = ref(false)
            let editedIndex = -1
            const databaseCodes = ref([])
            const listErrors= ref([])
            const currClinic =ref({})
            const district = ref(null)
            let province=  ref(null)
            let initialDistrict =  0
            let newClinic = {
                name: '',
                type: '',
                code: '',
                latitude: '',
                longitude: '',
                province: null,
                district: null
            }

           let columns =[
                { name: 'name', align: 'left', label: 'Nome', field: row => row.name, format: val => `${val}`, sortable: true },
                { name: 'type', align: 'left', label: 'Tipo', field: row => row.type, format: val => `${val}`, sortable: true },
                { name: 'district', align: 'left', label: 'Distrito', field: row => row.district, format: val => `${val}`, sortable: true },
                { name: 'actions', label: 'Opções', field: 'actions' }
            ]

            const clinicTypes = [
              '', 'Unidade fixa', 'Unidade temporária', 'Clínica móvel'
            ]


    onBeforeMount( () => {
        currClinic.value = Object.assign({}, newClinic)
       // showloading()
    })

      onMounted( () => {
        const offset = 0
        if (localStorage.getItem('role') === 'ROLE_USER') {
         // getClinicById()
        } else if (localStorage.getItem('role') === 'ROLE_ADMIN') {
        //  getAllClinic(offset)
        } else {
          getAllClinicsByDistrictId(localStorage.getItem('idLogin'))
        }
        getAllProvinces(offset)
        extractDatabaseCodes()
        verifyRole()
       // console.log(11 + provinces)

       closeLoading()
    });


        const  clinicos =computed (() => {
           if (district.value != null) {
          return getClinicsByDistrictId()
           } else if (localStorage.getItem('role') === 'ROLE_USER') {
            return  clinicService.getClinicSByUser(parseInt(localStorage.getItem('id_clinicUser')))
           } else {
             return []
           }
        });

         const  provinces =computed(() =>{
            return provinceService.getAllProvinces()
        });

        const districts = computed(() => {
        if (newClinic.province !== null) {
            return districtService.getAllByProvinceId(newClinic.province.id).get()
        } else {
            return null
        }
        })

        const  districtsCombo =computed (() =>  {
        if (province.value !== null) {
          return districtService.getAllByProvinceId(newClinic.province.id).get()
        } else {
            return null
        }
        });



   const  getLocation = () => {
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
    }

    const  locateMe = async () => {
        $q.loading.show({
          spinner: QSpinnerIos,
          message: 'Carregando a sua localização. Por favor, aguarde...'
        })
      gettingLocation = true
      try {
        gettingLocation = false
        location = await getLocation()
        newClinic.latitude = location.coords.latitude
        newClinic.longitude = location.coords.longitude
        $q.loading.hide()
      } catch (e) {
        gettingLocation = false
         errorStr = e.message
          $q.loading.hide()
          $q.dialog({
          title: 'Problema no carregamento da localização',
          message: 'Não tem permissões para aceder a localização do dispositivo ou a função de localização encontra-se desligada.\n Por favor ligue a localização ou dê as permissões de localização'
        }).onOk(() => {
            newClinic.latitude = -25.9678239
          newClinic.longitude = 32.5864914
          $q.loading.hide()
        })
      }
    }

    const validateClinic = () => {
            $refs.nome.$refs.ref.validate()
             $refs.code.$refs.ref.validate()
            $refs.latitude.$refs.ref.validate()
            $refs.longitude.$refs.ref.validate()
            console.log($refs.latitude.$refs.ref.validate())
            if ($refs.nome.$refs.ref.validate() && $refs.latitude.$refs.ref.validate() && $refs.longitude.$refs.ref.validate() && $refs.code.$refs.ref.validate()) {
                submitting.value = true
                submitClinic()
            }
        }

        const    getClinicsByDistrictId  =()=>  {
            if (district.value != null && initialDistrict !== district.value.id) {
               $q.loading.show({
          spinner: QSpinnerIos,
          message: 'Carregando Unidades Sanitarias. Por favor, aguarde...'
        })
              initialDistrict = district.value.id
              getAllClinicsByDistrictId(district.value.id).then(resp => {
                  $q.loading.hide()
                  console.log(resp)
              })
            }
              return Clinic.query().with('province').with('district')
                   .with('district.province').where('district_id', parseInt(district.value.id)).get()
        }

        const  submitClinic = async () => {
            console.log(newClinic)
          if (editedIndex !== 0) {
            await Clinic.api().post('/clinic', newClinic).then(resp => {
                console.log(resp.response.data)
                show_dialog.value = false
                submitting.value = false
                $emit('update:backToDashBoard', true)
              $q.notify({
              message: 'Clínica registrada com sucesso.',
              color: 'teal'
          })
            }).catch(error => {
            submitting.value = false
            console.log(error)
            if (error.request.status !== 0) {
            const arrayErrors = JSON.parse(error.request.response)
            if (arrayErrors.total == null) {
              listErrors.value.push(arrayErrors.message)
            } else {
              arrayErrors._embedded.errors.forEach(element => {
                listErrors.value.push(element.message)
              })
            }
              $emit('update:backToDashBoard', true)
              $q.notify({
              message: 'Error: ' + listErrors.value,
              color: 'red'
              })
            console.log(listErrors.value)
          }
            })
          } else {
            await Clinic.api().patch('/clinic/' + newClinic.id, newClinic).then(resp => {
              console.log(resp.response.data)
              show_dialog.value = false
              submitting.value = false
              $emit('update:backToDashBoard', true)
              $q.notify({
              message: 'Clínica actualizada com sucesso.',
              color: 'teal'
          })
            }).catch(error => {
            submitting.value = false
            console.log(error)
            if (error.request.status !== 0) {
            const arrayErrors = JSON.parse(error.request.response)
            if (arrayErrors.total == null) {
              listErrors.value.push(arrayErrors.message)
            } else {
              arrayErrors._embedded.errors.forEach(element => {
                listErrors.value.push(element.message)
              })
            }
              $emit('update:backToDashBoard', true)
              $q.notify({
              message: 'Error: ' + listErrors.value,
              color: 'red'
              })
            console.log(listErrors.value)
          }
            })
            editedIndex = -1
            listErrors.value = []
          }
        }

       const  getAllClinicsByDistrictId = async (districtId) => {
           await Clinic.api().get('/clinic/district/' + districtId).then(resp => {
              console.log(resp.response.data)
            }).catch(error => {
                console.log(error)
            })
    }

      const addClinic = () => {
           if (localStorage.getItem('role') === 'ROLE_USER_DISTRICT') {
       // showLoading()
      newClinic.district = districtService.getDistrictByIdLogin(localStorage.getItem('idLogin'))
       newClinic.province = newClinic.district.province
     }
         show_dialog.value = true
         //  editMode = false
      }

   /* const   getClinicById = async () =>  {
       await Clinic.api().get('/clinic/' + localStorage.getItem('id_clinicUser')).then(resp => {
          console.log(resp.response.data)
        }).catch(error => {
            console.log(error)
        })
     } */

    const  getAllProvinces = async (offset) => {
      provinceService.getMobile(0)
     /*   if (offset >= 0) {
            await Province.api().get('/province?offset=' + offset + '&max=100').then(resp => {
              console.log(resp.response.data)
              offset = offset + 100
              // if (resp.response.data.length > 0) { setTimeout(getAllProvinces(offset), 2) }
            }).catch(error => {
                console.log(error)
            })
        }*/
    }

    const verifyRole = () =>  {
      if (localStorage.getItem('role') === 'ROLE_USER_DISTRICT' || localStorage.getItem('role') === 'ROLE_ADMIN') {
        showAddButton.value = true
      }
      closeLoading()
     }

    const editClinic = (clinic) => {
      editedIndex = 0
      newClinic = Object.assign({}, clinic)
      newClinic.province = Province.query().withAll().find(props.clinic.district.province_id)
      newClinic.district = District.query().withAll().find(props.clinic.district_id)
      show_dialog.value = true
    }



    const extractDatabaseCodes = () =>  {
        clinicos.value.forEach(element => {
            databaseCodes.value.push(element.code)
    })
    }

    const navRedirect = (e, go) => {
      e.preventDefault() // we cancel the default navigation
      go({ query: { tab: '2', noScroll: true } })
    }





</script>

<style>
    .fild-radius {
        border-radius: 5px;
    }
</style>
