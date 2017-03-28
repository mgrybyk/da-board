<template>
    
  <div class="tile is-parent is-6">
    <article class="tile is-child box">
      <h4 class="title">{{ chart.displayName }}</h4>
      <div class="content">
        <chartist class="lines-bars" :type="'Pie'" :data="chartData" :options="chartOptions"></chartist>
      </div>
    </article>
  </div>

</template>

<script>
import Chartist from 'vue-bulma-chartist'
import ChartistSliceDonutMargin from 'chartist-plugin-slicedonutmargin'

export default {
  components: {
    Chartist
  },

  props: ['chart', 'chartName'],

  beforeMount () { },

  destroyed () { },

  data () {
    return {
      ...this.$store.state.pkg,
      labels: [ 'Failed', 'Passed', 'Running', 'Not executed' ],
      donutColors: [ 'donut-failed', 'donut-passed', 'donut-running', 'donut-notExecuted' ],
      donutOptions: {
        donut: true,
        showLabel: true,
        donutWidth: 40,
        labelOffset: 30,
        chartPadding: 15,
        plugins: [
          ChartistSliceDonutMargin({
            sliceMargin: 2
          })
        ]
      }
    }
  },

  methods: {
    setDonutColors: function () {
      let series = []
      this.chart.series.forEach((val, idx) => {
        series.push({
          className: this.donutColors[idx],
          value: val
        })
      })
      return { series: series }
    },
    setDonutLabelLegend: function () {
      return {
        labelInterpolationFnc: (value, index) => {
          return this.chart.series[index]
          ? `${this.labels[index]} (${this.chart.series[index]})` : ''
        }
      }
    }
  },

  computed: {
    chartData () {
      return this.setDonutColors()
    },
    chartOptions () {
      return {
        ...this.donutOptions,
        ...this.setDonutLabelLegend()
      }
    }
  },

  mounted () { }
}

</script>

<style lang="scss" scoped>
.lines-bars {
  height: 240px;
}
.animeChart {
  opacity: 1;
  transition: opacity .5s;
}
.animeChart.changed {
  opacity: 0;
}
</style>
