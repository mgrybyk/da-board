<template>
<div class="my-tile">
  <article class="with-stripe" :class="'color-' + getStatus">
    <div class="stripe top-stripe">
      <i class="fa fa-check-circle-o"></i>
      <i class="fa fa-lock"></i>
      <i class="fa fa-chevron-down" v-on:click="toggleDropdown">

        <div class="dropdown">
          <div v-bind:class="{ 'show': visible }" class="dropdown-content">
            <ul>
              <li><a v-on:click="tileAction('run')" class="action">Run</a></li>
              <li><a v-on:click="tileAction('disable')" class="action">Disable</a></li>
              <li class="divider"></li>
              <li><a href="http://google.com" target="_blank">View some link</a></li>
            </ul>
          </div>
        </div>
      </i>

    </div>
    <div class="box-height">
      <div class="env-details">
        <p class="title">{{ config.type }}</p>
        <p class="env-detail db-name">{{ config.dbName }} {{ config.dbVersion }}</p>
        <i :class="'fa fa-' + (config.isNix ? 'linux' : 'windows') + ' fa-lg env-icon'"></i>
        <p class="env-detail os-name">{{ config.osNameExt }}</p>
      </div>
    </div>
    <div class="stripe bottom-stripe">
      <a style="color: #fff;" v-if="!tile"><span>No activity</span></a>
      <a style="color: #fff;" v-else-if="!tile.isRunning && tile.isFailure"><span>Failed: {{ getReason }}</span></a>
      <a style="color: #fff;" v-else-if="!tile.isRunning && !tile.isFailure"><span>Tests Passed</span></a>
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
  components: { },

  data () {
    return {
      timer: true,
      visible: false
    }
  },

  props: ['config', 'tile', 'timeDiff'],

  methods: {
    toggleDropdown (evt) {
      this.visible = !this.visible
      if (this.visible) {
        window.addEventListener('click', this.hideDropdown)
      } else {
        window.removeEventListener('click', this.hideDropdown)
      }
    },
    hideDropdown (evt) {
      if (evt.target !== this.dropdownButton) {
        this.toggleDropdown(evt)
      }
    },
    tileAction (actionName) {
      console.log(actionName)
    }
  },

  computed: {
    getStatus () {
      if (!this.tile) return 'none'
      if (this.tile.isRunning) {
        return 'running'
      } else if (this.tile.isCancelled) {
        return 'cancelled'
      } else {
        return this.tile.isFailure ? 'failure' : 'success'
      }
    },
    getProgress () {
      this.timer = this.timer
      let startTime = this.tile.startTime
      let duration = this.config.duration
      if (!this.tile.isRunning) return 0
      if (!duration) duration = 1000000
      let currentTime = new Date().getTime()
      if (currentTime - startTime > duration) return 100
      let diff = currentTime - startTime + this.timeDiff
      diff = (diff > 0) ? diff : 0
      return Math.round(100 * diff / duration)
    },
    getPhase () {
      if (!this.tile.stages) return ''
      let failedStages = []
      Object.keys(this.tile.stages).forEach(stage => {
        if (this.tile.stages[stage] === 'running') {
          failedStages.push(stage)
        }
      })
      return failedStages.join(', ')
    },
    getReason () {
      let failureReason = 'Process'
      if (!this.tile.stages) return failureReason
      let failedStages = []
      Object.keys(this.tile.stages).forEach(stage => {
        if (this.tile.stages[stage] === 'failed') {
          failedStages.push(stage)
        }
      })
      if (failedStages.length === 0) return failureReason
      return failedStages.join(', ')
    }
  },

  mounted () {
    this.dropdownButton = this.$el.querySelector('.fa-chevron-down')

    this.interval = setInterval(() => {
      if (!this.tile || !this.tile.isRunning) return
      this.timer = !this.timer
    }, 1000)
  },
  destroyed () {
    window.removeEventListener('click', this.hideDropdown)
    clearInterval(this.interval)
  }
}
</script>

<style lang="scss" scoped>
div.my-tile {
  width: 200px;
  padding: 0 0 15px 15px;
}
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

/* The container <div> - needed to position the dropdown content */
.dropdown {
    position: relative;
    display: inline-block;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display:block;
  position: absolute;
  right: 0;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  opacity: 0;
  transition: opacity .33s;
  visibility: hidden;

  li {    
    text-decoration: none;    

    a {
      display: block;
      padding: 12px 16px;

      &.action {
        color: #4a4a4a;
      }
    }

    &:hover {
      background-color: #00d1b2;
      color: #fff;

      a {
        color: #fff;
      }
    }
  }

  li.divider {
    height: 1px;
    background-color: #e5e5e5;
    padding: 0;
  }
}

/* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
.show {
  opacity: 1;
  visibility: visible;
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
