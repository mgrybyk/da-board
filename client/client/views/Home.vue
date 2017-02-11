<template>
  <div class="content has-text-centered">

    <div class="tile is-ancestor">  
      <div class="tile is-parent is-6">
        <article class="tile is-child box">
          <h4 class="title">UI</h4>
          <div class="content">
            <chartist class="lines-bars" :type="'Pie'" :data="uiData" :options="uiOptions"></chartist>
          </div>
        </article>
      </div>

      <div class="tile is-parent is-6">
        <article class="tile is-child box">
          <h4 class="title">Rest</h4>
          <div  v-bind:class="{ changed: homeCharts.restTests.changed }" class="content animeChart">
            <chartist class="lines-bars" :type="'Pie'" :data="restData" :options="restOptions"></chartist>
          </div>
        </article>
      </div>
    </div>

    <div class="tile is-ancestor">  
      <div class="tile is-parent is-6">
        <article class="tile is-child box">
          <h4 class="title">Installer</h4>
          <div class="content">
            <chartist class="lines-bars" :type="'Pie'" :data="installerData" :options="installerOptions"></chartist>
          </div>
        </article>
      </div>
      <div class="tile is-parent is-3">
        <article class="tile is-child notification is-purple">
          <div class="tile-text">
            <a href="/#/dashboard"><i class="fa fa-tachometer"></i></a>
          </div>
        </article>
      </div>
      <div class="tile is-parent is-3">
        <article class="tile is-child notification is-cyan">
          <div class="tile-text">
            <a href="/#/results"><i class="fa fa-table"></i></a>
          </div>
        </article>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Chartist from 'vue-bulma-chartist'
import ChartistSliceDonutMargin from 'chartist-plugin-slicedonutmargin'

export default {
  components: {
    Chartist
  },

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
    setDonutColors: function (type) {
      let series = []
      this.homeCharts[type].series.forEach((val, idx) => {
        series.push({
          className: this.donutColors[idx],
          value: val
        })
      })
      return { series: series }
    },
    setDonutLabelLegend: function (type) {
      return {
        labelInterpolationFnc: (value, index) => {
          return this.homeCharts[type].series[index]
          ? `${this.labels[index]} (${this.homeCharts[type].series[index]})` : ''
        }
      }
    }
  },

  computed: {
    ...mapGetters({
      homeCharts: 'homeCharts'
    }),
    restData () {
      return this.setDonutColors('restTests')
    },
    restOptions () {
      return {
        ...this.donutOptions,
        ...this.setDonutLabelLegend('restTests')
      }
    },
    installerData () {
      return this.setDonutColors('installerTests')
    },
    installerOptions () {
      return {
        ...this.donutOptions,
        ...this.setDonutLabelLegend('installerTests')
      }
    },
    uiData () {
      return this.setDonutColors('uiTests')
    },
    uiOptions () {
      return {
        ...this.donutOptions,
        ...this.setDonutLabelLegend('uiTests')
      }
    }
  },

  mounted () { }
}

</script>

<style lang="scss" scoped>
.is-title {
  text-transform: capitalize;
}
.is-cyan {
  background-color: #6acbef;
  transition: background-color 0.5s;
}
.is-cyan:hover {
  background-color: #43b6e0;
}
.is-purple {
  background-color: #694de2;
  transition: background-color 0.5s;
}
.is-purple:hover {
  background-color: #4c32bb;
}
.tile a {
  color: #fff;
  font-size: 6em;
  vertical-align: middle;
  display: table-cell;
  border-bottom: none;
}
.tile a:visited {
  color: #fff;
}
.tile-text {
  height: 100%;
  display: table;
  width: 100%;
  margin-left: 0.5em;
}
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
article.notification {
  padding: 2.75rem 0.5rem 0rem 0.5rem;
}
</style>

<style lang="scss">
.donut-failed {
  stroke: #FF6384;  
}
.donut-running {
  stroke: #36A2EB;  
}
.donut-passed {
  stroke: #A5EA64;  
}
.donut-notExecuted {
  stroke: #E0E0E0;  
}
</style>
