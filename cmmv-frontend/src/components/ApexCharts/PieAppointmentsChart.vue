<template>
  <div style="width: 1200px; min-height: 200px; linear-gradient( 135deg, #343E59 10%, #2B2D3E 40%)">
    <apexchart
  style="max-width: 50%; "
  type="donut"
  :options="chartOptions"
  :series="series"
></apexchart>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
import Appointment from '../../store/models/appointment/Appointment'
// import moment from 'moment'
// const series = []
// const categories = []

export default {
      Nmap: new Map(),
      Nmap1: new Map(),
     components: {
    apexchart: VueApexCharts
  },
  data: function () {
    return {
       chartOptions: {
        labels: ['Consultas Pendentes', 'Consultas Realizadas', 'Consultas Confirmadas'],
        colors: ['#F44336', '#13c185', '#13a6c1'],
          animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 2000
        },
      title: {
          text: 'Eficiencia',
          align: 'center',
          style: {
            color: '#000000'
          }
          },
      plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '22px',
                  fontFamily: 'Rubik',
                  color: '#dfsda',
                  offsetY: -10
                },
                value: {
                  show: true,
                  fontSize: '16px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  color: undefined,
                  offsetY: 16,
                  formatter: function (val) {
                    return val
                  }
                },
                total: {
                  show: true,
                  label: 'Total',
                  color: '#373d3f',
                  formatter: function (w) {
                    return w.globals.seriesTotals.reduce((a, b) => {
                      return a + b
                    }, 0)
                  }
                }
              }
            }
          }
        }
       }
    }
  },
  methods: {
      getAppointmentsNumber () {
          const appointmentsNum = []
          appointmentsNum.push(this.appointmentsPending.length)
          appointmentsNum.push(this.appointmentsDone.length)
           appointmentsNum.push(this.appointmentsConfirmed.length)
          return appointmentsNum
  }
  },
  computed: {
         appointmentsPending () {
         return Appointment.query()
                           .where((appointment) => {
                                  return appointment.status === 'PENDENTE' && appointment.appointmentDate !== '' && appointment.clinic_id === Number(localStorage.getItem('id_clinicUser'))
                                  })
                          .orderBy('appointmentDate', 'desc')
                          .get()
      },
       appointmentsDone () {
          return Appointment.query()
                           .where((appointment) => {
                                  return appointment.status === 'CONFIRMADO' &&
                                  appointment.visitDate !== '' &&
                                  appointment.visitDate !== null &&
                                  appointment.visitDate !== undefined &&
                                  appointment.hasHappened !== false &&
                                  appointment.clinic_id === Number(localStorage.getItem('id_clinicUser'))
                                  })
                          .orderBy('appointmentDate', 'desc')
                          .get()
      },
       appointmentsConfirmed () {
          return Appointment.query()
                           .where((appointment) => {
                                  return appointment.status === 'CONFIRMADO' &&
                                  appointment.hasHappened === false &&
                                   appointment.visitDate === null &&
                                  appointment.clinic_id === Number(localStorage.getItem('id_clinicUser'))
                                  })
                          .orderBy('appointmentDate', 'desc')
                          .get()
      },
       series () {
      //   var series = [11, 32, 45, 32]
       const series = this.getAppointmentsNumber()
        return series
    }
  },
    created () {
    }
}

</script>
