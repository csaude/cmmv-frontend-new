<template>
  <q-page>
    <q-card
      :square="false"
      style="
        background: radial-gradient(circle at left, #e9bfb1 10%, #ee764e 100%);
        border-bottom-left-radius: 100em;
        border-bottom-right-radius: 100em;
      "
    >
      <div class="row q-py-lg q-ml-lg">
        <q-btn
          flat
          round
          color="white"
          icon="chevron_left"
          @click="$emit('previousScreen')"
        />
        <div class="row q-py-lg q-mr-sm fixed-top-right">
          <q-btn
            flat
            unelevated
            rounded
            push
            dense
            color="deep-orange-10"
            @click="setAdministrationScreen"
            :label="labelAdmin"
            text-color="white"
            class="glossy"
            icon-right="admin_panel_settings"
          />
        </div>
      </div>
      <div class="row q-pa-xl texte-center q-mt-lg column">
        <div
          style="font-family: 'Arial'; font-size: 40px; font-weight: bold"
          class="row text-center column text-white q-mb-md"
        >
          BEM VINDO
        </div>
        <div
          class="row text-center column text-white text-subtitle1 text-weight-bold"
        >
          Sistema móvel de <br />
          Geração de Demanada para a Circuncisão <br />Masculina
        </div>
      </div>
    </q-card>

    <div class="row q-mt-md text-center q-px-xl" v-if="!administration">
      <q-tabs
        v-model="tab"
        dense
        visible="false"
        class="text-grey userTab col"
        active-color="white"
        indicator-color="primary"
        active-bg-color="primary"
        narrow-indicator
        style="border-radius: 2em; border-style: solid; border-color: #ee764e"
        align="justify"
      >
        <q-tab
          style="border-radius: 2em; border-style: solid; border-color: white"
          name="mobilizer"
          icon="manage_accounts"
          label="Mobilizador"
        />
        <q-tab
          style="border-radius: 2em; border-style: solid; border-color: white"
          name="clinic"
          icon="local_hospital"
          label="Unidade Sanitária"
        />
      </q-tabs>
    </div>
    <form @submit.prevent="authUser">
      <div class="q-pa-xl">
        <div class="row q-mb-md">
          <q-input
            class="col"
            ref="usernameRef"
            v-model="username"
            outlined
            type="text"
            :rules="[
              (val) =>
                val.length >= 3 ||
                'O nome do utilizador deve ter um minimo de 3 caracteres',
            ]"
            lazy-rules
            rounded
            label="Utilizador"
          >
            <template v-slot:append>
              <q-icon name="person" color="primary" />
            </template>
          </q-input>
        </div>
        <div class="row q-mb-md">
          <q-input
            v-model="password"
            rounded
            outlined
            class="col"
            label="Senha"
            :rules="[
              (val) =>
                val.length >= 4 || 'A senha deve ter um minimo de 4 caracteres',
            ]"
            ref="passwordRef"
            :type="isPwd ? 'password' : 'text'"
          >
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
        <div class="row">
          <q-btn
            :loading="submitting"
            class="full-width q-py-sm"
            unelevated
            rounded
            color="primary"
            type="submit"
            label="Entrar"
          />
        </div>
        <div class="row q-py-lg float-right">
          <span class="text-h7"
            >Esqueceu as suas credenciais?
            <q-btn
              flat
              style="color: #ff0080"
              color="primary"
              label="Clique aqui."
              no-caps
          /></span>
        </div>
      </div>
    </form>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useLoading } from 'src/composables/shared/loading/loading';
import provinceService from '../../services/api/province/provinceService';
import districtService from '../../services/api/district/districtService';
import clinicService from '../../services/api/clinic/clinicService';
import { useRouter } from 'vue-router';
import UsersService from 'src/services/UsersService';
import db from 'src/stores/localbase';
import { Notify } from 'quasar';
const isPwd = ref(true);
const tab = ref('mobilizer');
const username = ref('');
const password = ref('');
const province = ref('');
const district = ref('');
const clinic = ref('');
const labelAdmin = ref('Administração');
const administration = ref(false);
const submitting = ref(false);
const { closeLoading, showloading } = useLoading();
const usernameRef = ref(null);
const passwordRef = ref(null);
const router = useRouter();

//OnMouted
onMounted(() => {
  showloading();
  init();
});

const init = async () => {
  //   provinceService.get(0);
  // districtService.get(0);
  closeLoading();
};

const provinces = computed(() => {
  console.log('111pro' + provinceService.getAllProvinces());
  return provinceService.getAllProvinces();
});

const districts = computed(() => {
  return districtService.getAllDistrictByProvinceId(province.value.id);
});

const getAllClinicsByDistrictId = async (districtId) => {
  return await clinicService.getAllClinicsByDistrictId(districtId);
};

const addLocalDbClinics = async (districtId) => {
  clinicService.getAllClinicsByDistrictId(districtId).then((resp) => {
    //  clinicService.get(0)
  });
};

const addLocalDbDistricts = () => {
  districtService.get(0);
};

const addLocalDbProvince = () => {
  provinceService.get(0);
};

const addLocalDbDatas = (districtId) => {
  addLocalDbClinics(districtId);
  addLocalDbDistricts();
  addLocalDbProvince();
};

const setAdministrationScreen = () => {
  if (administration.value === false) {
    administration.value = true;
    labelAdmin.value = 'Utilização Normal';
    tab.value = null;
  } else {
    administration.value = false;
    labelAdmin.value = 'Administração';
    tab.value = 'mobilizer';
  }
};

const buildUserToAdd = (responseUser) => {
  console.log(responseUser.refresh_token);
  UserLogin.localDbAdd({
    id_token: responseUser.access_token,
    orgaoId: responseUser.orgaoId,
    refresh_token: responseUser.refresh_token,
    username: responseUser.username,
    password: responseUser.password,
    idLogin: responseUser.mainEntity,
    idUser: responseUser.id,
    role: responseUser.roles,
    clinicId: responseUser.clinicId,
    districtId: responseUser.districtId,
    source: responseUser.source,
  });
};

const checkOnline = () => {
  isOnline().then((resp) => {
    if (resp === true) {
      return true;
    } else if (resp === false) {
      return false;
    }
  });
};

const authUser = () => {
  usernameRef.value.validate();
  passwordRef.value.validate();
  if (!usernameRef.value.hasError && !passwordRef.value.hasError) {
    submitting.value = true;
    db.newDb()
      .collection('users')
      .get()
      .then((users) => {
        if (users.length > 0) {
          const username = users[0].username;
          const passwordLocal = users[0].password;
          // const role = users[0].role
          const match = bcrypt.compareSync(
            password,
            passwordLocal.substring(8)
          );
          if (username === username && match) {
            isOnline().then((resp) => {
              if (resp === true) {
                UsersService.login({
                  username: username.value,
                  password: password.value,
                }).then((response) => {
                  localStorage.setItem('id_token', response.data.access_token);
                  localStorage.setItem('idLogin', response.data.mainEntity);
                  localStorage.setItem('idUser', response.data.id);
                  localStorage.setItem('orgaoId', response.data.orgaoId);
                  localStorage.setItem(
                    'refresh_token',
                    response.data.refresh_token
                  );
                  localStorage.setItem('username', response.data.username);
                  localStorage.setItem('password', response.data.password);
                  localStorage.setItem('role', response.data.roles);
                  localStorage.setItem('clinicId', response.data.clinicId);
                  localStorage.setItem('districtId', response.data.districtId);
                  localStorage.setItem('source', response.data.source);
                });
                return true;
              }
            });
            verifiyRoleAndUser(users);
          } else {
            /*
                        Notify.create({
                        icon: 'announcement',
                        message: 'Utilizador ou a senha invalida',
                        type: 'negative',
                        progress: true,
                        timeout: 3000,
                        position: 'top',
                        color: 'negative',
                        textColor: 'white',
                        classes: 'glossy'
                })
                */
            submitting.value = false;
          }
        } else {
          UsersService.login({
            username: username.value,
            password: password.value,
          })
            .then((response) => {
              submitting.value = false;
              localStorage.setItem('id_token', response.data.access_token);
              localStorage.setItem('idLogin', response.data.mainEntity);
              localStorage.setItem('idUser', response.data.id);
              localStorage.setItem('orgaoId', response.data.orgaoId);
              localStorage.setItem(
                'refresh_token',
                response.data.refresh_token
              );
              localStorage.setItem('username', response.data.username);
              localStorage.setItem('password', response.data.password);
              localStorage.setItem('role', response.data.roles);
              localStorage.setItem('clinicId', response.data.clinicId);
              localStorage.setItem('districtId', response.data.districtId);
              localStorage.setItem('source', response.data.source);
              if (
                tab.value === 'mobilizer' &&
                response.data.roles.includes('ROLE_MOBILIZER')
              ) {
                addLocalDbDatas(response.data.districtId);
                // buildUserToAdd(response.data)
                localStorage.setItem(
                  'id_mobilizer',
                  localStorage.getItem('idLogin')
                );
                router.push({
                  path: '/mobilizerHome/' + localStorage.getItem('idLogin'),
                });
                //    router.push('/mobilizerHome/1');
              } else if (
                tab.value === 'clinic' &&
                response.data.roles.includes('ROLE_USER')
              ) {
                localStorage.setItem(
                  'id_clinicUser',
                  localStorage.getItem('idLogin')
                );
                // const clinic = Clinic.query().has('code').where('id', response.data.clinicId).first()
                // Clinic.localDbAdd(clinic)
                //    buildUserToAdd(response);
                addLocalDbDatas(response.districtId);
                router.push({
                  path: '/clinicHome/' + localStorage.getItem('idLogin'),
                });
              } else if (
                tab.value === null &&
                response.data.roles[0] === 'ROLE_ADMIN'
              ) {
                //  buildUserToAdd(response.data)
                localStorage.setItem('id_clinicUser', 1);
                router.push({ path: '/clinicHome/' + 1 });
              } else if (
                tab.value === null &&
                response.data.roles[0] === 'ROLE_USER_DISTRICT'
              ) {
                //  buildUserToAdd(response.data)
                // localStorage.setItem('id_districtUser', response.data.idLogin)
                router.push({ path: '/clinicHome/' + 1 });
              } else {
                /*
                                Notify.create({
                                    icon: 'announcement',
                                    message: 'Utilizador sem acesso',
                                    type: 'negative',
                                    progress: true,
                                    timeout: 3000,
                                    position: 'top',
                                    color: 'negative',
                                    textColor: 'white',
                                    classes: 'glossy'
                                })
                                */
                submitting.value = false;
              }
            })
            .catch((error) => {
              console.log(error);
              submitting.value = false;
              if (error.request.response != null) {
                const arrayErrors = JSON.parse(error.request.response);
                if (arrayErrors.total == null) {
                  listErrors.push(arrayErrors.message);
                } else {
                  arrayErrors._embedded.errors.forEach((element) => {
                    listErrors.push(element.message);
                  });
                }
                console.log(listErrors);
              }
            });
        }
      });
  }
};

const verifiyRoleAndUser = (users) => {
  if (users[0].role.includes('ROLE_MOBILIZER') && tab.value === 'mobilizer') {
    localStorage.setItem('id_mobilizer', users[0].idLogin);
    router.push({ path: '/mobilizerHome/' + users[0].idLogin });
  } else if (users[0].role.includes('ROLE_USER') && tab.value === 'clinic') {
    router.push({ path: '/clinicHome/' + localStorage.getItem('idLogin') });
  } else {
    /*
                   Notify.create({
                        icon: 'announcement',
                        message: 'Utilizador sem acesso',
                        type: 'negative',
                        progress: true,
                        timeout: 3000,
                        position: 'top',
                        color: 'negative',
                        textColor: 'white',
                        classes: 'glossy'
                    })
                    */
    submitting.value = false;
  }
};
</script>

<style>
.userTab {
  border: 1px solid gray-7;
}
</style>
