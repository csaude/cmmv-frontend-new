<template>
    <q-card style="width: 500px; max-width: 80vw;" class="q-pt-lg">
        <form @submit.prevent="validateUser" >
            <q-card-section class="q-px-md">
             <h5 center> Alterar Senha</h5>
               <div class="row q-mt-md">
               <q-input v-model="password" filled :type="isPwd ? 'password' : 'text'" label="Senha Actual" ref="password"  class="col"   :rules="[ val => ( val != null ) || ' Por favor preencha a senha']">
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
            </div>
            <div class="row">
               <q-input v-model="newPassword" filled :type="isPwd ? 'password' : 'text'" label="Nova Senha" class="col" ref="newPassword" :rules="[ val => ( val != null ) || ' Por favor preencha a senha']">
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
            </div>
            <div class="row">
               <q-input v-model="confirmNewPassword" filled :type="isPwd ? 'password' : 'text'" label="Confirmação da Nova Senha"  class="col" ref="confirmNewPassword" :rules="[ val => ( val != null ) || ' Por favor preencha a senha']">
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
            </div>
            </q-card-section>
           <q-card-actions align="right" class="q-mb-md">
               <q-btn label="Cancelar" color="primary" @click="$emit('close')"/>
                <q-btn type="submit" :loading="this.submitting" label="Submeter" color="primary" />
            </q-card-actions>
        </form>
    </q-card>
</template>
<script>
import { ref } from 'vue'
import bcrypt from 'bcryptjs'
import db from 'src/store/localbase'
export default {
  data () {
    return {
      password: ref(''),
      newPassword: ref(''),
      confirmNewPassword: ref(''),
      isPwd: ref(true),
      submitting: false,
      dataBaseUser: {},
       user: {
        password: '',
        newPassword: '',
        confirmNewPassword: ''
      }
    }
  },
      methods: {
         validateUser () {
            this.submitting = true
            this.$refs.password.validate()
             this.$refs.newPassword.validate()
               this.$refs.confirmNewPassword.validate()
            if (!this.$refs.password.hasError && !this.$refs.newPassword.hasError &&
            !this.$refs.confirmNewPassword.hasError) {
              const match = bcrypt.compareSync(this.password, this.dataBaseUser.password.substring(8))
              if (match) {
                if (this.newPassword === this.confirmNewPassword) {
             const hash = bcrypt.hashSync(this.newPassword, 12)
                 this.dataBaseUser.password = '{bcrypt}' + hash
                    const localBaseUser = JSON.parse(JSON.stringify(this.dataBaseUser))
         db.newDb().collection('users').doc({ idLogin: this.dataBaseUser.idLogin }).set(localBaseUser)
          this.$q.notify({
                    message: 'A senha foi actualizado com sucesso.',
                                    color: 'teal'
                                })
         this.$emit('close')
                //  this.dataBaseUser.password = this.newPassword
                  //     db.newDb().collection('users').doc({ id: this.dataBaseUser.id }).set(this.dataBaseUser)
                }
              }
               this.submitting = false
            }
        },
        getLocalBaseUser () {
      db.newDb().collection('users').get().then(users => {
           this.dataBaseUser = users[0]
        })
      }
    },
  created () {
    console.log(1111)
       this.getLocalBaseUser()
    }
  }
</script>
