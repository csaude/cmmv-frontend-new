<template>
  <q-item clickable v-ripple>
    <!--q-item-section avatar top>
            <q-item-label>{{appointment && formatDateShort(appointment.appointmentDate)}}</q-item-label>
            <q-item-label caption>2 days ago</q-item-label>
        </q-item-section-->
    <q-item-section>
      <q-item-label
        >[&nbsp;{{
          appointment && formatDateShort(appointment.appointmentDate)
        }}]</q-item-label
      >
      <q-item-label caption>
        <span
          >Utente: {{ appointment.utente && appointment.utente.firstNames }}
          {{ appointment.utente && appointment.utente.lastNames }}
          <span>
            &nbsp; &nbsp; &nbsp; Codigo:
            {{ appointment.utente && appointment.utente.systemNumber }}</span
          >
        </span></q-item-label
      >
    </q-item-section>
    <q-item-section side>
      <div class="row q-gutter-xs justify-end">
        <q-btn
          size="sm"
          outline
          color="primary"
          label="Confirmar"
          @click.stop="promptToConfirm(appointment)"
        />
        <q-btn
          size="sm"
          outline
          color="primary"
          label="Re-marcar"
          @click="showReshedule = true"
        />
      </div>
    </q-item-section>
    <q-dialog v-model="showReshedule">
      <resheduleApp :appointment="appointment" @close="showReshedule = false" />
    </q-dialog>
  </q-item>
</template>

<script setup>
import resheduleApp from 'components/Clinic/ResheduleAppoinment.vue';
import { date } from 'quasar';
import {ref} from 'vue'
import { useQuasar } from 'quasar'
import appointmentService from 'src/services/api/appointment/appointmentService';

const   props = defineProps(['appointment', 'utenteDb']);
// emits: ['update:appointment'],
const showReshedule = ref(false);
const $q = useQuasar()

const formatDateShort = (value) => {
  return date.formatDate(value, 'DD-MM-YYYY');
};

const getDaysPassed = () => {
  return '';
};

const promptToConfirm = (appointmentToConfirm) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Deseja Confirmar?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    appointmentToConfirm.status = 'CONFIRMADO';
    const appointmentLocalBase = JSON.parse(
      JSON.stringify(appointmentToConfirm)
    );
    appointmentService.putMobile(
      appointmentLocalBase,
     );

  });
};
</script>

<style></style>
