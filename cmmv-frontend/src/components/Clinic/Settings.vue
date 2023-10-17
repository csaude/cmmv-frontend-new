<template>
  <div>
    <div class="row q-py-lg q-mt-md text-weight-bold text-subtitle1">
            <p>Definições</p>
            <UserMessage :userName="username" />
        </div>
        <div class="">
            <q-toolbar >
                <q-tabs v-model="selectedTab" shrink stretch>
                 <div v-if="isAdmin || isUser" >
                  <q-tab name="Clinicas" label="Unidade Sanitária" />
                    </div>
                  <q-tab name="Utilizadores" label="Utilizadores" />
                  <div v-if=isAdmin>
                    <q-tab name="Mobilizadores" label="Mobilizadores" />
                     </div>
                      <div v-if=isAdmin>
                      <q-tab name="Docs" label="Material Educativo" />
                      </div>
                </q-tabs>
            </q-toolbar>
            <q-tab-panels
        v-model="selectedTab"
        dense
        no-caps
        inline-label
      >
              <q-tab-panel name="Clinicas">
                <addClinic> </addClinic>
              </q-tab-panel>
              <q-tab-panel name="Mobilizadores">
               <mobilizers> </mobilizers>
              </q-tab-panel>
              <q-tab-panel name="Utilizadores">
               <users> </users>
              </q-tab-panel>
                <q-tab-panel name="Docs">
               <upload> </upload>
              </q-tab-panel>
               </q-tab-panels>
            <q-separator class="q-mx-md"/>
        </div>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'Settings',
  setup () {
    return {
        selectedTab: ref('Clinicas'),
        isAdmin: ref(true),
         isUser: ref(false)
    }
  },
  computed () {
  },
  mounted () {
      if (localStorage.getItem('role') === 'ROLE_ADMIN') {
         // this.selectedTab = 'Utilizadores'
        //  this.isAdmin = false
         } else if (localStorage.getItem('role') === 'ROLE_USER_DISTRICT') {
           this.isAdmin = false
         // this.selectedTab = 'Clinicas'
         } else if (localStorage.getItem('role') === 'ROLE_USER') {
             this.isAdmin = false
              this.isUser = true
          this.selectedTab = 'Clinicas'
         }
  },
  methods: {
  },
   components: {
     addClinic: require('components/Clinic/AddClinic.vue').default,
      mobilizers: require('components/Clinic/Mobilizers.vue').default,
       users: require('components/Clinic/Users.vue').default,
        UserMessage: require('components/Clinic/UserMessage.vue').default,
        upload: require('components/Shared/UploadFile.vue').default
  }
}
</script>
