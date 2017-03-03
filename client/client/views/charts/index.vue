<template>
  <div class="content has-text-centered">

  <div class="tile is-ancestor" style="flex-wrap: wrap;">  
    <Chart
      v-for="(item, index) in charts"
      :chart="item"
      :chartName="index"
      :key="item.name">
    </Chart>
  </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Chart from './chart'

export default {
  components: {
    Chart
  },

  beforeMount () { },

  destroyed () { },

  data () {
    return { }
  },

  computed: {
    ...mapGetters({
      charts: 'charts'
    })
  },

  mounted () { }
}

</script>

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
