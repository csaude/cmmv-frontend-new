<template>
<div style="width: 1200px; min-height: 200px; linear-gradient( 135deg, #343E59 10%, #2B2D3E 40%)">
    <apexchart
     style="max-width: 50%; "
  type="line"
  :options="chartOptions"
  :series="series"
></apexchart>
</div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
import Appointment from '../../store/models/appointment/Appointment'
 import moment from 'moment'
// import moment from 'moment'
const month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
export default {
      Nmap: new Map(),
      month,
     components: {
    apexchart: VueApexCharts
  },
  data: function () {
    return {
      chartOptions: { // ApexCharts options
        chart: {
          id: 'vue-chart-line'
        },
        colors: ['#13c185'],
         title: {
          text: 'Tendencias de Chegada',
          align: 'center',
          style: {
            color: '#000000'
          }
          },
           animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1000
        },
            stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'butt',
    colors: undefined,
    width: 7,
    dashArray: 0
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
      categories: [...month]
      }
        }
      }
  },
  methods: {
    getAppointmentsDoneByMonth () {
    var monthsPresent = []
    const toDate = str => new Date(str.replace(/^(\d+)\/(\d+)\/(\d+)$/, '$2/$1/$3'))
    const month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
   const map = this.appointmentsDone.reduce((a, b) => {
  const m = toDate(b.appointmentDate).getMonth()
  console.log(m)
  a[m] = (a[m] || 0) + 1
  monthsPresent.push(month[+m])
     return a
}, {})
  let result = Object.entries(map).map(([key, data]) => ({ data, key: month[+key] }))
   var monthsNot = month.filter(item => !monthsPresent.includes(item))
   for (const item of monthsNot) {
     result.push(({ data: 0, key: item }))
   }
  result = result.sort(function (a, b) {
  // sort based on the value in the monthNames object
  console.log(+moment(a.key, 'MMM') - moment(b.key, 'MMM'))
  return +moment(a.key, 'MMM') - moment(b.key, 'MMM')
})
  return result
  }
  },
  computed: {
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
        series () {
          var mapIter = this.Nmap1.values()
         var arrDone = []
       for (const item of mapIter) {
         arrDone.push(item.data)
         }
    return [
      {
        name: 'Consultas Realizadas',
        data: [...arrDone]
      }
    ]
    }
  },
    created () {
    this.Nmap1 = this.getAppointmentsDoneByMonth()
    }
}

</script>
