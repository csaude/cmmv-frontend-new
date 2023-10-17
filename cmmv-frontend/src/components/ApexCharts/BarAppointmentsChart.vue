<template>
    <apexchart
  style="max-width: 100%; "
  height="500"
  type="bar"
  :options="chartOptions"
  :series="series"
></apexchart>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
import Appointment from '../../store/models/appointment/Appointment'
 import moment from 'moment'
const monthsX = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEC']
const toDateStr = str => new Date(str.replace(/^(\d+)\/(\d+)\/(\d+)$/, '$2/$1/$3'))
const monthsEng = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
export default {
      mapAppointmentsPending: new Map(),
      mapAppointmentsConfirmed: new Map(),
      mapAppointmentsDone: new Map(),
       monthsX,
       toDateStr,
       monthsEng,
     components: {
    apexchart: VueApexCharts
  },
  data: function () {
    return {
      chartOptions: { // ApexCharts options
        chart: {
          id: 'vue-chart-bar'
        },
        colors: ['#F44336', '#13c185', '#13a6c1'],
         animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1000
        },
         title: {
          text: 'Consultas',
          align: 'center',
          style: {
            color: '#000000'
          }
          },
           plotOptions: {
              bar: {
                borderRadius: 10
              }
           },
   stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'butt',
    colors: undefined,
    width: 2,
    dashArray: 0
},
fill: {
          opacity: 2
        },
         tooltip: {
          y: {
            formatter: function (val) {
              return val
            }
          }
         },
      dataLabels: {
          enabled: true
        },
         xaxis: {
      categories: [...monthsX]
      }
        }
      }
  },
  methods: {
      getAppointmentsPendingByMonth () {
       var monthsPresent = []
   const map = this.appointmentsPending.reduce((a, b) => {
  const m = toDateStr(b.appointmentDate).getMonth()
  a[m] = (a[m] || 0) + 1
  monthsPresent.push(monthsEng[+m])
     return a
}, {})
   let result = Object.entries(map).map(([key, data]) => ({ data, key: monthsEng[+key] }))
   var monthsNot = monthsEng.filter(item => !monthsPresent.includes(item))
   for (const item of monthsNot) {
     result.push(({ data: 0, key: item }))
   }
  result = result.sort(function (a, b) {
  // sort based on the value in the monthNames object
  return +moment(a.key, 'MMM') - moment(b.key, 'MMM')
})
  return result
  },
    getAppointmentsDoneByMonth () {
    var monthsPresent = []
   const map = this.appointmentsDone.reduce((a, b) => {
  const m = toDateStr(b.appointmentDate).getMonth()
  console.log(m)
  a[m] = (a[m] || 0) + 1
  monthsPresent.push(monthsEng[+m])
     return a
}, {})
  let result = Object.entries(map).map(([key, data]) => ({ data, key: monthsEng[+key] }))
   var monthsNot = monthsEng.filter(item => !monthsPresent.includes(item))
   for (const item of monthsNot) {
     result.push(({ data: 0, key: item }))
   }
  result = result.sort(function (a, b) {
  // sort based on the value in the monthNames object
  return +moment(a.key, 'MMM') - moment(b.key, 'MMM')
})
  return result
  },
   getAppointmentsConfirmedByMonth () {
    var monthsPresent = []
   const map = this.appointmentsConfirmed.reduce((a, b) => {
  const m = toDateStr(b.appointmentDate).getMonth()
  console.log(m)
  a[m] = (a[m] || 0) + 1
     monthsPresent.push(monthsEng[+m])
      return a
}, {})
  let resu = Object.entries(map).map(([key, data]) => ({ data, key: monthsEng[+key] }))
   var monthsNot = monthsEng.filter(item => !monthsPresent.includes(item))
   for (const item of monthsNot) {
     resu.push(({ data: 0, key: item }))
   }
  resu = resu.sort(function (a, b) {
  // sort based on the value in the monthNames object
  return +moment(a.key, 'MMM') - moment(b.key, 'MMM')
})
  return resu
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
          var mapIter = this.mapAppointmentsPending.values()
         var arrPending = []
       for (const item of mapIter) {
         arrPending.push(item.data)
         }
           var mapIter1 = this.mapAppointmentsDone.values()
         var arrDone = []
       for (const item of mapIter1) {
         arrDone.push(item.data)
         }
           var mapIter2 = this.mapAppointmentsConfirmed.values()
         var arrConfirmed = []
       for (const item of mapIter2) {
         arrConfirmed.push(item.data)
         }
    return [
      {
        name: 'Consultas Pendentes',
        data: [...arrPending]
      },
       {
        name: 'Consultas Realizadas',
        data: [...arrDone]
      },
       {
        name: 'Consultas Confirmadas',
        data: [...arrConfirmed]
      }
    ]
    }
  },
    created () {
   this.mapAppointmentsPending = this.getAppointmentsPendingByMonth()
    this.mapAppointmentsDone = this.getAppointmentsDoneByMonth()
     this.mapAppointmentsConfirmed = this.getAppointmentsConfirmedByMonth()
    }
}

</script>
