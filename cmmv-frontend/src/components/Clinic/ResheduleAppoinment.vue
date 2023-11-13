<template>
  <q-card style="width: 700px; max-width: 80vw" class="q-pt-lg">
    <form @submit.prevent="submitAppointment">
      <q-card-section class="q-px-md">
        <div class="row">
          <q-input
            outlined
            disable
            v-model="editedAppointment.utente.systemNumber"
            label="Código"
            dense
            class="col"
          />
        </div>
        <div class="row q-pt-md">
          <q-input
            outlined
            disable
            v-model="editedAppointment.utente.firstNames"
            label="Nome"
            dense
            class="col"
          />
          <q-input
            outlined
            disable
            v-model="editedAppointment.utente.lastNames"
            label="Apelido"
            dense
            class="col q-ml-md"
          />
        </div>
        <div class="row q-pt-md">
          <q-input
            dense
            outlined
            v-model="editedAppointment.appointmentDate"
            class="col"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    mask="DD-MM-YYYY"
                    v-model="editedAppointment.appointmentDate"
                    :options="blockDataPassado"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <!--        <q-input dense outlined v-model="editedAppointment.time" mask="time" :rules="['time']" class="q-ml-md col">
                        <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                            <q-time v-model="editedAppointment.time">
                                <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                            </q-time>
                            </q-popup-proxy>
                        </q-icon>
                        </template>
                    </q-input> -->
        </div>
      </q-card-section>
      <q-card-actions align="right" class="q-mb-md">
        <q-btn
          type="submit"
          rounded
          label="Cancelar"
          color="primary"
          @click="$emit('close')"
        />
        <q-btn
          type="submit"
          rounded
          label="Submeter"
          color="primary"
          @click.stop="promptToConfirm(appointment)"
        />
      </q-card-actions>
    </form>
  </q-card>
</template>

<script setup>
import { date } from 'quasar';
import Appointment from 'src/stores/models/appointment/Appointment';
import { ref } from 'vue';
import moment from 'moment';
import db from 'src/stores/localbase';

const props = defineProps(['appointment']);
const editedAppointment = ref({});
//const date = ref(moment(date).format('YYYY-MM-DD'));

const blockDataPassado = (date) => {
  return date >= moment(new Date()).format('YYYY/MM/DD');
};

const formatDateShort = (value) => {
  return date.formatDate(value, 'DD-MM-YYYY');
};

const promptToConfirm = (appointmentToConfirm) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Deseja Confirmar?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    appointmentToConfirm.appointmentDate = moment(
      editedAppointment.value.appointmentDate,
      'DD-MM-YYYY'
    ).toDate();
    appointmentToConfirm.time = editedAppointment.value.time;
    appointmentToConfirm.status = 'CONFIRMADO';
    console.log(appointmentToConfirm);
    const appointmentLocalBase = JSON.parse(
      JSON.stringify(appointmentToConfirm)
    );
    Appointment.update({
      // where: (appointment) => {
      //     return appointment.id === appointmentToConfirm.id
      // },
      data: appointmentLocalBase,
    });
    db.newDb()
      .collection('appointments')
      .doc({ id: appointmentToConfirm.id })
      .set(appointmentLocalBase);
  });
};

created(() => {
  editedAppointment.value = Object.assign({}, appointment);
  editedAppointment.value.appointmentDate = moment(
    appointment.appointmentDate
  ).format('DD-MM-YYYY');
});
</script>

<style></style>
