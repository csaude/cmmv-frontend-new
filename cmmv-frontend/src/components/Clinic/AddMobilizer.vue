<template>
  <q-card style="width: 700px; max-width: 80vw;" class="q-pt-lg">
        <form @submit.prevent="validateMobilizer" >
            <q-card-section class="q-px-md">
               <div class="row q-mt-md">
                <input-text-field
                    ref="nome"
                    square
                    v-model="mobilizer.firstNames"
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
                    v-model="mobilizer.lastNames"
                    :rules="[ val => val.length >= 2 || 'O apelido indicado é inválido']"
                    lazy-rules
                    label="Apelido" />
            </div>
            <div class="row">
             <input-phone-code
                dense
                square
                  outlined
                    class="col-2">
            </input-phone-code>
                <input-number-phone-field
                    class="col q-ml-md"
                    ref="phone"
                    square
                    mask="#########"
                    lazy-rules
                     :rules="[ val => phoneRules (val)]"
                    v-model="mobilizer.cellNumber"
                    label="Número de Telefone" />
            </div>
             <div class="row">
<input-phone-code
                dense
                square
                  outlined
                    class="col-2">
            </input-phone-code>
                <input-number-phone-field
                    class="col q-ml-md"
                    ref="cellNumber2"
                    mask="#########"
                    square
                    lazy-rules
                     :rules="[ val => secondNumberRules (val)]"
                    v-model="mobilizer.cellNumber2"
                    label="Número de Telefone Alternativo" />
            </div>
            <div class="row q-mb-md">
                <q-select
                    dense outlined
                    class="col"
                    v-model="province"
                    :options="provinces"
                     :disable=editModeMobilizer
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    ref="province"
                    option-value="id"
                    option-label="description"
                    :rules="[ val => ( val != null ) || ' Por favor indique a província']"
                    lazy-rules
                    label="Província *" />
            </div>
            <div class="row q-mb-md">
                <q-select
                    class="col"
                    dense outlined
                     transition-show="flip-up"
                    transition-hide="flip-down"
                    v-model="mobilizer.district"
                      :disable=editModeMobilizer
                    :options="districts"
                    ref="district"
                    option-value="id"
                    option-label="description"
                    :rules="[ val => ( val != null) || ' Por favor indique o Distrito']"
                    lazy-rules
                    label="Distrito" />
            </div>
            </q-card-section>
           <q-card-actions align="right" class="q-mb-md">
               <q-btn label="Cancelar" color="primary" @click="$emit('close')"/>
                <q-btn type="submit" :loading="this.submitting" label="Submeter" color="primary" />
            </q-card-actions>
        </form>
    </q-card>
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
import CommunityMobilizer from '../../store/models/mobilizer/CommunityMobilizer'
// import { MobilizerLogin } from '../../store/models/userLogin/MobilizerLogin'
import Province from 'src/store/models/province/Province'
import District from 'src/store/models/district/District'
 import db from 'src/store/localbase'
import { QSpinnerIos } from 'quasar'
import { v4 as uuidv4 } from 'uuid'
// import Localbase from 'localbase'
 // const db = new Localbase('db')
export default {
     props: ['selectedMobilizer', 'editModeMobilizer', 'editMode'],
      emits: ['update:show_dialog'],
    data () {
        return {
            mobilizer: new CommunityMobilizer(),
            mobilizerLogin: {},
            province: null,
            show_dialog: false,
            submitting: false,
            show_error_dialog: false,
            listErrors: []
        }
    },
     mounted () {
          District.apiGetAll()
    },
    computed: {
          provinces () {
            return Province.all()
        },
        districts () {
        if (this.province !== null) {
            return District.query().withAll().where('province_id', this.province.id).get()
        } else {
            return null
        }
        }
    },
    created () {
        this.mobilizer = Object.assign({}, this.selectedMobilizer)
     if (localStorage.getItem('role') === 'ROLE_USER_DISTRICT') {
      this.mobilizer.district = District.query().with('province').find(localStorage.getItem('idLogin'))
       this.province = this.mobilizer.district.province
     } else {
        this.mobilizer.district = District.query().with('province').find(this.mobilizer.district_id)
        if (this.mobilizer.district != null) this.province = this.mobilizer.district.province
     }
    },
    methods: {
           validateMobilizer () {
            this.$refs.nome.$refs.ref.validate()
             this.$refs.apelido.$refs.ref.validate()
               this.$refs.phone.$refs.ref.validate()
                 this.$refs.cellNumber2.$refs.ref.validate()
              this.$refs.province.validate()
              this.$refs.district.validate()
            if (!this.$refs.nome.$refs.ref.hasError && !this.$refs.apelido.$refs.ref.hasError &&
            !this.$refs.phone.$refs.ref.hasError && !this.$refs.cellNumber2.$refs.ref.hasError &&
             !this.$refs.province.hasError && !this.$refs.district.hasError) {
                this.submitMobilizer()
            }
        },
         phoneRules (val) {
       if (val.length === 0 || val.length < 9) {
      return 'O Número é invalido. Deve conter 9 dígitos.'
       } else if (this.validatePhonePrefix(parseInt(val.substring(0, 2)))) {
           return 'O Número é invalido. O codigo da operadora não existe'
       }
      },
    validatePhonePrefix (val) {
         if ((val !== 82) && (val !== 83) && (val !== 84) && (val !== 85) && (val !== 86) && (val !== 87)) {
             return true
         }
    },
     secondNumberRules (val) {
       if (val.length !== 0 && val.length < 9) {
      return 'O Número é invalido. Deve conter 9 dígitos.'
      } else if (val.length !== 0 && this.validatePhonePrefix(parseInt(val.substring(0, 2)))) {
           return 'O Número é invalido. O codigo da operadora não existe'
      }
    },
        submitMobilizer () {
            this.mobilizer.uuid = uuidv4()
            this.submitting = false
            this.listErrors = []
            console.log(this.mobilizer)
       //    this.mobilizerLogin = new MobilizerLogin()
       //     this.mobilizerLogin.username = this.mobilizer.firstNames
       //     this.mobilizerLogin.password = 'admin'
       //     this.mobilizerLogin.fullName = this.mobilizer.firstNames
       if (this.mobilizer.id === null) {
            CommunityMobilizer.api().post('/communityMobilizer', this.mobilizer).then(resp => {
                 console.log(resp.response.data)
                this.submitting = false
                this.$emit('close')
                this.$emit('update:show_dialog', false)
              this.$q.notify({
              message: 'Mobilizador registrado com sucesso.',
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
            //   this.$emit('update:show_dialog', true)
            //   this.$q.notify({
            //   message: 'Error: ' + this.listErrors,
            //   color: 'red'
            //   })
            // console.log(this.listErrors)
            }
            })
       } else if (this.editModeMobilizer) {
            CommunityMobilizer.update({
        where: (mobilizer) => {
    return mobilizer.id === this.mobilizer.id
  },
        data: this.mobilizer
      })
             const mobilizadorLocalBase = JSON.parse(JSON.stringify(this.mobilizer))
             db.newDb().collection('mobilizer').doc({ id: this.mobilizer.id }).set(mobilizadorLocalBase)
          //    db.newDb().collection('mobilizer').add({
          // mobilizadorLocalBase
          // })
                this.$q.notify({
                    message: 'O Mobilizador ' + this.mobilizer.firstNames + ' ' + this.mobilizer.lastNames + ' foi actualizado com sucesso.',
                                    color: 'teal'
                                })
         this.$emit('close')
       } else if (this.editMode) {
         CommunityMobilizer.api().patch('/communityMobilizer/' + this.mobilizer.id, this.mobilizer, this.$q.loading.show({
                                spinner: QSpinnerIos,
                                message: 'Por favor, aguarde...'
                                })).then(resp => {
                                    console.log(resp.response)
                                    CommunityMobilizer.update(this.mobilizer)
                                    this.$q.loading.hide()
                                    this.$emit('close')
                                this.$q.notify({
                                    message: 'O utente ' + this.mobilizer.firstNames + ' ' + this.mobilizer.lastNames + ' foi actualizado com sucesso.',
                                    color: 'teal'
                                })
            }).catch(error => {
                console.log(error)
              this.show_dialog = false
                this.submitting = false
            })
       }
        }
    },
    components: {
        'input-text-field': require('components/Shared/InputFieldText.vue').default,
        'input-number-phone-field': require('components/Shared/InputFieldPhoneNumber.vue').default,
         'input-phone-code': require('components/Shared/IconPhoneCode.vue').default
    //    'combo-field': require('components/Shared/ComboField.vue').default
    }

}
</script>

<style>
    .fild-radius {
        border-radius: 5px;
    }
</style>
