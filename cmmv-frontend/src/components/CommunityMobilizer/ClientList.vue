<template>
  <q-page>
  <div class="q-pt-sm" style="row ">
      <q-tabs
        v-model="tab"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
          class="text-grey q-mb-lg">
        <!--q-tab name="pendentes" label="Pendentes" /-->
        <q-tab name="associados" label="Associados" />
        <q-tab name="enviados" label="Enviados" />
      </q-tabs>
      <div class="q-gutter-y-sm">
        <q-tab-panels
          v-model="tab"
          animated
          transition-prev="slide-right"
          transition-next="slide-left"
          class="bg-grey-2 text-dark text-left"
          style="border-radius: 5%">
          <!--q-tab-panel name="pendentes">
            <div class="text-h6">Pendentes</div>
            <utentes-view-list :utentes="utentesPendente"/>
          </q-tab-panel-->
          <q-tab-panel name="associados">
            <utentes-view-list v-if="this.mobilizer" :utentes="utentesAssociados" v-model:showUtenteULinkScreenProp="showUtenteULinkScreen" />
            <div class="absolute-bottomg">
              <q-page-sticky position="bottom-right" :offset="[18, 18]">
                <q-btn size="xl" fab icon="add" @click="showUtenteRegistrationScreen = true" color="primary" />
             </q-page-sticky>
        </div>
          </q-tab-panel>
          <q-tab-panel name="enviados">
           <utentes-view-list :utentes="utentesEnviados"/>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import utentesViewList from 'components/Shared/ViewUtenteList.vue';


const tab = ref('associados')
const leftDrawerOpen = ref(false)
const showUtenteRegistrationScreen = ref(false)
const showUtenteULinkScreen = ref(false)

</script>