<template>
<div key="app-to-accept">
            <UserMessage />
           <reportBar> </reportBar>
<br>
 <div
      class="row q-col-gutter-md q-px-md q-py-md"
      key="allCharts"
    >
      <div class="col-md-6 col-sm-12 col-xs-12">
         <reportPie> </reportPie>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <reportLine> </reportLine>
      </div>
 </div>
 </div>
</template>
<script>

export default {
  name: 'Charts',
  setup () {
    return {
    }
  },
  computed () {
  },
  mounted () {
  },
  methods: {
  },
   components: {
        reportBar: require('components/ApexCharts/BarAppointmentsChart.vue').default,
        reportPie: require('components/ApexCharts/PieAppointmentsChart.vue').default,
        reportLine: require('components/ApexCharts/LineChart.vue').default,
         UserMessage: require('components/Clinic/UserMessage.vue').default
    //     reportBarDistrict: require('components/ApexCharts/BarChartAppointmentsDistrict.vue').default
   //      reportBarLinkDistrict: require('components/ApexCharts/BarChartAppointmentsLinkDistrict.vue').default
       //  relatorio: require('components/apexCharts/PivotTable.vue').default
     //  ApexExemplo: require('components/apexCharts/ApexExemplo.vue').default,
      //   ApexExemplo2: require('components/apexCharts/ApexExemplo2.vue').default,
    //   cardbase: require('components/apexCharts/Cardbase.vue').default
    //  Dialog: require('components/Shared/Dialog/Dialog.vue').default
    // clinicsTable: require('components/Settings/Clinic/ClinicsTable.vue').default
  }
}
</script>
