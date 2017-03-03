<template>
<div class="tile is-parent is-3">
  <article class="tile is-child box with-stripe" :class="'color-' + getStatus(item.isFailure, item.isRunning, item.isCancelled)">
    <div class="box-height">
      <div class="env-details">
        <i :class="'fa fa-' + configs[item.name].browser + ' fa-lg env-icon'"></i>
        <p class="title">{{ configs[item.name].type }}</p>
        <p class="env-detail db-name">{{ configs[item.name].dbName }} {{ configs[item.name].dbVersion }}</p>
        <i :class="'fa fa-' + (configs[item.name].isNix ? 'linux' : 'windows') + ' fa-lg env-icon'"></i>
        <p class="env-detail os-name">{{ configs[item.name].osNameExt }}</p>
      </div>
    </div>
    <div class="bottom-stripe">
      <a style="color: #fff;" v-if="!item.isRunning && item.isFailure"><span>Failed: {{ getReason }}</span></a>
      <a style="color: #fff;" v-else-if="!item.isRunning && !item.isFailure"><span>Tests Passed</span></a>
      <span v-else class="progress-bar">
        <span>{{ getProgress + '%' }} {{ getPhase }}</span>
        <progress class="progress is-info" :value="getProgress" max="100"></progress>
      </span>
    </div>
  </article>
</div>
</template>

<script>
export default {
  data () {
    return {
      timer: true
    }
  },

  props: ['item', 'configs', 'timeDiff'],

  methods: {
    getStatus: (isFailure, isRunning, isCancelled) => {
      if (isRunning) {
        return 'running'
      } else if (isCancelled) {
        return 'cancelled'
      } else {
        return isFailure ? 'failure' : 'success'
      }
    }
  },

  computed: {
    getProgress () {
      this.timer = this.timer
      let startTime = this.item.startTime
      let duration = this.configs[this.item.name].duration
      if (!this.item.isRunning) return 0
      if (!duration) duration = 1000000
      let currentTime = new Date().getTime()
      if (currentTime - startTime > duration) return 100
      let diff = currentTime - startTime + this.timeDiff
      diff = (diff > 0) ? diff : 0
      return Math.round(100 * diff / duration)
    },
    getPhase () {
      if (!this.item.stages) return ''
      let failedStages = []
      Object.keys(this.item.stages).forEach(stage => {
        if (this.item.stages[stage] === 'running') {
          failedStages.push(stage)
        }
      })
      return failedStages.join(', ')
    },
    getReason () {
      let failureReason = 'Process'
      if (!this.item.stages) return failureReason
      let failedStages = []
      Object.keys(this.item.stages).forEach(stage => {
        if (this.item.stages[stage] === 'failed') {
          failedStages.push(stage)
        }
      })
      if (failedStages.length === 0) return failureReason
      return failedStages.join(', ')
    }
  },

  mounted () {
    this.interval = setInterval(() => {
      if (!this.item.isRunning) return
      this.timer = !this.timer
    }, 750)
  },
  destroyed () {
    clearInterval(this.interval)
  }
}
</script>

<style lang="scss">
span.progress-bar {
  span {
    position: relative;
    z-index: 33;
    top: -2px;
    font-weight: 700;
    color: #ff8d13;
  }
  progress {
    height: 100%;
    position: relative;
    top: -25px;
  }
}
</style>
<!--
      <div class="tile is-parent is-3">
        <article class="tile is-child box with-stripe color-failure" >
          <div class="box-height">
            <div class="env-details">
              <i class="fa fa-firefox fa-lg env-icon"></i>
              <p class="title">Upgrade major</p>
              <p class="env-detail db-name">Oracle 12.1.0.2.0</p>
              <i class="fa fa-linux fa-lg env-icon"></i>
              <p class="env-detail os-name">Red Hat 6.8</p>
            </div>
          </div>
          <div class="bottom-stripe">
            <a style="color: #fff;"><span>See Installer<span></a>
          <div>
        </article>
      </div>

      <div class="tile is-parent is-3">
        <article class="tile is-child box with-stripe color-failure" >
          <div class="box-height">
            <div class="env-details">
              <i class="fa fa-firefox fa-lg env-icon"></i>
              <p class="title">Upgrade major</p>
              <p class="env-detail db-name">Oracle 12.1.0.2.0</p>
              <i class="fa fa-linux fa-lg env-icon"></i>
              <p class="env-detail os-name">Red Hat 6.8</p>
            </div>
          </div>
          <div class="bottom-stripe">
            <a style="color: #fff;"><span>See Installer<span></a>
          <div>
        </article>
      </div>

      <div class="tile is-parent is-3">
        <article class="tile is-child box with-stripe color-failure" >
          <div class="box-height">
            <div class="env-details">
              <i class="fa fa-firefox fa-lg env-icon"></i>
              <p class="title">Upgrade minor</p>
              <p class="env-detail db-name">MSSQL 2008 R2 SP1</p>
              <i class="fa fa-windows fa-lg env-icon"></i>
              <p class="env-detail os-name">Server 2008 R2</p>
            </div>
          </div>
          <div class="bottom-stripe">
            <a style="color: #fff;"><span>See UI<span></a>
          <div>
        </article>
      </div>
      
      <div class="tile is-parent is-3">
        <article class="tile is-child box with-stripe" >
          <div class="box-height">
            <div class="env-details">
              <i class="fa fa-firefox fa-lg env-icon"></i>
              <p class="title">skipDb</p>
              <p class="env-detail db-name">MSSQL 2008 R2 SP1</p>
              <i class="fa fa-windows fa-lg env-icon"></i>
              <p class="env-detail os-name">Server 2008 R2</p>
            </div>
          </div>
          <div class="bottom-stripe">
            <progress class="progress is-info" value="65" max="100" style="height: 100%;">65%</progress>
          <div>
        </article>
      </div>
      
      <div class="tile is-parent is-3">
        <article class="tile is-child box with-stripe color-failure" >
          <div class="box-height">
            <div class="env-details">
              <i class="fa fa-firefox fa-lg env-icon"></i>
              <p class="title">Clean</p>
              <p class="env-detail db-name">MSSQL 2008 R2 SP1</p>
              <i class="fa fa-windows fa-lg env-icon"></i>
              <p class="env-detail os-name">Server 2008 R2</p>
            </div>
          </div>
          <div class="bottom-stripe">
            <a style="color: #fff;"><span>See REST<span></a>
          <div>
        </article>
      </div>
    
      <div class="tile is-parent is-3">
        <article class="tile is-child box with-stripe color-success" >
          <div class="box-height">
            <div class="env-details">
              <i class="fa fa-firefox fa-lg env-icon"></i>
              <p class="title">useExisting</p>
              <p class="env-detail db-name">MSSQL 2016</p>
              <i class="fa fa-windows fa-lg env-icon"></i>
              <p class="env-detail os-name">Server 2016</p>
            </div>
          </div>
          <div class="bottom-stripe" style="display: none;">
            <a style="color: #fff;"><span>See REST<span></a>
          <div>
        </article>
      </div>
-->
