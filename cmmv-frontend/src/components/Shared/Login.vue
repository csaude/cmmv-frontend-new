<template>
  <q-page >
   <q-card :square="false"
        style="background: radial-gradient(circle at left, #E9BFB1 10%, #EE764E 100%); border-bottom-left-radius: 100em; border-bottom-right-radius: 100em">
    <div class="row q-py-lg q-ml-lg">
        <q-btn flat round color="white" icon="chevron_left" @click="$emit('previousScreen')"/>
        <div class="row q-py-lg q-mr-sm fixed-top-right">
        <q-btn flat  unelevated rounded push dense color="deep-orange-10" @click="setAdministrationScreen" :label=labelAdmin text-color="white" class="glossy" icon-right="admin_panel_settings"  />
        </div>
    </div>
    <div class="row q-pa-xl texte-center q-mt-lg column">
        <div style="font-family: 'Arial';font-size: 40px; font-weight: bold" class="row text-center column text-white q-mb-md">BEM VINDO</div>
        <div class="row text-center column text-white text-subtitle1 text-weight-bold">Sistema móvel de <br/> Geração de Demanada para a Circuncisão <br/>Masculina</div>
    </div>
   </q-card>

    <div class="row q-mt-md text-center q-px-xl" v-if="!administration">
        <q-tabs
            v-model="tab"
            dense
            visible=false
            class=" text-grey userTab col"
            active-color="white"
            indicator-color="primary"
            active-bg-color="primary"
            narrow-indicator
            style="border-radius: 2em; border-style: solid;border-color: #EE764E;"
            align="justify">
            <q-tab  style="border-radius: 2em; border-style: solid; border-color: white;" name="mobilizer" icon="manage_accounts" label="Mobilizador" />
            <q-tab style="border-radius: 2em; border-style: solid; border-color: white;" name="clinic" icon="local_hospital" label="Unidade Sanitária" />
        </q-tabs>
    </div>
    <form @submit.prevent="authUser">
        <div class="q-pa-xl">
            <div class="row q-mb-md">
                <q-input
                    class="col"
                    ref="user"
                    v-model="username"
                    outlined
                    type="text"
                    :rules="[ val => val.length >= 3 || 'O nome do utilizador deve ter um minimo de 3 caracteres']"
                    lazy-rules
                    rounded
                    label="Utilizador" >
                    <template v-slot:append>
                        <q-icon name="person"  color="primary"/>
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
            <div class="row">
                <q-btn
                    :loading="submitting"
                    class="full-width q-py-sm"
                    unelevated rounded
                    color="primary"
                    type="submit"
                    label="Entrar" />
            </div>
            <div class="row q-py-lg float-right">
            <span class="text-h7">Esqueceu as suas credenciais?
                <q-btn flat style="color: #FF0080" color="primary" label="Clique aqui." no-caps/></span>
            </div>
        </div>
    </form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

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


</script>

<style>
    .userTab {
        border: 1px solid gray-7;
    }
</style>
