<template>
  <q-page class="absolute full-width full-height column">
  <pageHeader :showPreviousButton="true" @previousScreen="$emit('previousScreen')" > Marcação de consulta</pageHeader>
    <p>Selecione a Data e Hora Preferida</p>
    <div class="row q-pa-md">
         <q-date
            class="col"
            landscape
            v-model="appointment.appointmentDate"
            :options="optionsFn"
            mask="DD-MM-YYYY"
            />
    </div>
    <div class="row q-pa-md">
        <q-time
            v-model="appointment.time"
            :hour-options="hourOptionsTime1"
            :minute-options="minuteOptionsTime1"
            landscape
      />
    </div>
    <div class="absolute-bottom q-px-sm q-mb-lg">
            <div class="text-center q-mb-md">
                <buttone  label="Confirmar" @click="confirm" />
            </div>
        </div>
  </q-page>
</template>
<script>
import { date } from 'quasar'
import Appointment from '../../store/models/appointment/Appointment'
import Utente from '../../store/models/utente/Utente'

export default {
    props: ['utente', 'appointmentToUpdate'],
    data () {
        return {
            hourOptionsTime1: [8, 9, 10, 11, 12, 13, 14],
            minuteOptionsTime1: [0],
            appointment: {
                    appointmentDate: '',
                    time: '',
                    utente: null,
                    clinic: null,
                    status: ''
                },
            optionsFn (newDate) {
                return newDate >= date.formatDate(Date.now(), 'YYYY/MM/DD')
            }
        }
    },
    mounted () {
        this.checkIfIsUpdate()
    },
    methods: {
        confirm () {
            if (this.appointment.id <= 0) {
                this.appointment.utente = this.utente
                this.appointment.status = 'PENDENTE'
                this.appointment.clinic = this.utente.clinic
            }
            this.appointment.appointmentDate = new Date(this.appointment.appointmentDate)
            Appointment.api().post('/appointment', this.appointment).then(resp => {
                this.$emit('goHome', this.appointment.utente)
            }).catch(error => {
                console.log(error)
            })
        },
        checkIfIsUpdate () {
            if (this.appointmentToUpdate != null && this.appointmentToUpdate.id > 0) {
                this.appointment = this.appointmentToUpdate
                this.appointment.appointmentDate = this.formatDate(this.appointment.appointmentDate)
                this.appointment.utente = Utente.find(this.appointment.utente_id)
            }
        },
        formatDate (value) {
            return date.formatDate(value, 'YYYY/MM/DD')
        }
    }
}
</script>
