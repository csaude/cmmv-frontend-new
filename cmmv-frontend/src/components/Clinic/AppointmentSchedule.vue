<template>
  <transition-group
    appear
    enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut absolute-top"
  >
    <div key="app-to-accept">
      <UserMessage />
      <div class="row q-mt-md text-bold">
        Marcação de Consultas ({{ appointmentsPending.length }})
      </div>
      <q-input filled v-model="searchText" label="Pesquisar" />
      <q-scroll-area style="height: 300px; max-width: auto">
        <q-list
          bordered
          separator
          class="rounded-borders q-mt-md"
          v-for="appointment in appointmentsPending"
          :key="appointment.id"
        >
          <PendingApp :appointment="appointment" />
        </q-list>
      </q-scroll-area>
      <div class="row q-mt-lg text-bold">
        Consultas Marcadas ({{ appointmentsConfirmed.length }})
      </div>
      <q-input filled v-model="searchTextConfirmed" label="Pesquisar" />
      <q-scroll-area style="height: 350px; max-width: auto">
        <q-list
          bordered
          separator
          class="rounded-borders q-mt-md"
          virtual-scroll
          v-for="appointment in appointmentsConfirmed"
          :key="appointment.id"
        >
          <AcceptedApp :appointment="appointment" />
        </q-list>
      </q-scroll-area>
    </div>
  </transition-group>
</template>

<script setup>
import { date, QSpinnerIos } from 'quasar';
import Utente from '../../stores/models/utente/Utente';
import Clinic from '../../stores/models/clinic/Clinic';
import { onMounted, ref, computed } from 'vue';
import appointmentService from 'src/services/api/appointment/appointmentService';
import { useLoading } from 'src/composables/shared/loading/loading';

//components
import PendingApp from 'components/Clinic/PendingAppointment.vue';
import UserMessage from 'components/Clinic/UserMessage.vue';
import AcceptedApp from 'components/Clinic/AcceptedAppointment.vue';

const { closeLoading, showloading } = useLoading();

const searchText = ref('');
const searchTextConfirmed = ref('');
const showEdit = ref(false);

const appointmentsPending = computed(() => {
  return appointmentService.getPendingAssignment('PENDENTE');
});

const appointmentsConfirmed = computed(() => {
  return appointmentService.getConfirmedAssignment(
    searchTextConfirmed.value,
    searchText.value
  );
});

const UtenteBD = computed(() => {
  return Utente.all();
});
const clinicDB = computed(() => {
  return Clinic.find(localStorage.getItem('id_clinicUser'));
});

const getAppointments = async () => {
  // Buscar as consults pelo id da clinica logada
  appointmentService
    .getAppointments(localStorage.getItem('id_clinicUser'))
    .then(() => {
      closeLoading();
    });
};

const handlerEdit = () => {
  showEdit.value = true;
};

const formatDate = (value) => {
  return date.formatDate(value, 'YYYY/MM/DD');
};

onMounted(() => {
  if (localStorage.getItem('role') === 'ROLE_USER') {
    appointmentService.getMobile().then((appointments) => {
      if (appointments.length === 0) {
        showloading();
        getAppointments();
      } else {
        appointmentService.putMobile(appointments);
      }
    });
  } //  fillUtenteOnAppointment()
});
</script>
