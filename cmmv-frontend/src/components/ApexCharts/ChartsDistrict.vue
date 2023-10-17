<template>
<div key="app-to-accept">
            <UserMessage />
           <reportBarDistrict > </reportBarDistrict>
<br>
 <div style="max-width: 100%;">
    <reportBarLinkDistrict> </reportBarLinkDistrict>
 </div>
 </div>
</template>
<script>
import { ref } from 'vue'
export default {
  name: 'Charts',
  setup () {
    return {
      isUserClinic: ref(true)
    }
  },
  computed () {
  },
  mounted () {
   if (localStorage.getItem('role') === 'ROLE_USER_DISTRICT') {
         this.isUserClinic = false
    //    this.getAllUtentesByDistrictId(localStorage.getItem('idLogin'))
    // this.getAllAppointmentsByDistrictId(localStorage.getItem('idLogin'))
   }
  },
  methods: {
  },
   components: {
      //  reportBar: require('components/ApexCharts/BarAppointmentsChart.vue').default,
   //     reportPie: require('components/ApexCharts/PieAppointmentsChart.vue').default,
   //     reportLine: require('components/ApexCharts/LineChart.vue').default,
         UserMessage: require('components/Clinic/UserMessage.vue').default,
         reportBarDistrict: require('components/ApexCharts/BarChartAppointmentsDistrict.vue').default,
         reportBarLinkDistrict: require('components/ApexCharts/BarChartAppointmentsLinkDistrict.vue').default
       //  relatorio: require('components/apexCharts/PivotTable.vue').default
     //  ApexExemplo: require('components/apexCharts/ApexExemplo.vue').default,
      //   ApexExemplo2: require('components/apexCharts/ApexExemplo2.vue').default,
    //   cardbase: require('components/apexCharts/Cardbase.vue').default
    //  Dialog: require('components/Shared/Dialog/Dialog.vue').default
    // clinicsTable: require('components/Settings/Clinic/ClinicsTable.vue').default
  }
}
</script>
