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
              <li v-if="auth.isAuth" v-for="(item, index) in actions">
                <a v-on:click="tileAction(index)" class="action">{{ index }}</a>
              </li>
              <li v-if="auth.isAuth && Object.keys(actions).length > 0" class="divider"></li>
              <li><a href="http://google.com" target="_blank">Provider Admin</a></li>
            </ul>
          </div>
        </div>
      </i>

    </div>
    <div class="box-height">
      <div class="env-details">
        <p class="title">{{ config.type }}</p>
        <p class="env-detail">{{ tile ? tile.package : '' }}</p>
        <p class="env-detail db-name">{{ config.dbName }} {{ config.dbVersion }}</p>
        <i :class="'fa fa-' + (config.isNix ? 'linux' : 'windows') + ' fa-lg env-icon'"></i>
        <p class="env-detail os-name">{{ config.osNameExt }}</p>
      </div>
    </div>
    <div class="stripe bottom-stripe">
      <a v-if="!tile"><span>No activity</span></a>
      <a v-else-if="!tile.isRunning" :href="tile.processUrl && tile.processUrl" target="_blank">
        <span v-if="tile.isCancelled">Aborted</span>
        <span v-else-if="tile.isFailure">Failed: {{ getReason }}</span>
        <span v-else-if="!tile.isFailure">Tests Passed</span>
      </a>
      <a v-else class="progress-bar" :href="tile.processUrl && tile.processUrl" target="_blank">
        <span>{{ getProgress + '%' }} {{ getPhase }}</span>
        <progress class="progress is-info" :value="getProgress" max="100"></progress>
      </a>
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

  props: ['config', 'tile', 'timeDiff', 'auth', 'integrations'],

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
      this.$socket.emit('INTEGRATION_ACTION', { configName: this.config.name, action: actionName })
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
    },
    actions () {
      let actions = {}
      if (this.config.integration && this.config.integration.name &&
        this.integrations[this.config.integration.name] && this.integrations[this.config.integration.name].actions) {
        actions = this.integrations[this.config.integration.name].actions
      }
      return actions
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
  width: 220px;
  padding: 0 0 15px 15px;
}
.box-height {
  min-height: 146px;
}

article.with-stripe {
  padding: 0;
  transition: background-color 1s;
  border-radius: 3px;
  box-shadow: 0 0 3px #dfdfdf;

  &.color-failure {
    box-shadow: 0 0 3px #f33960;
  }
  &.color-success {
    box-shadow: 0 0 3px #1ac556;
  }
  &.color-running {
    box-shadow: 0 0 3px #29d;
  }

  p {
    color: #fff;
  }

  &.color-failure {
    background-color: #f33960;
  }
  &.color-success {
    background-color: #1ac556;
  }
  &.color-running {
    background-color: #29d;
  }
  &.color-cancelled {
    background-color: #eee;
    i.env-icon {
      color: #171717;
    }
    p {
      color: #171717;
    }
  }
}
.stripe {
  display: block;
  text-align: center;
  height: 25px;
  transition: background-color .3s;
  
  &.top-stripe {
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 3px 3px 0px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    i {
      padding: 0 10px;
      font-size: 16px;
      cursor: pointer;
    }
    i:hover {
      color: #29d;
    }
    &:hover {
      background-color: rgba(255, 255, 255, 0.85);
    }
  }

  &.bottom-stripe {
    background-color: rgba(119, 119, 119, 0.7);
    border-radius: 0 0px 3px 3px;

    progress {
      border-radius: 0 0px 3px 3px;
    }
    a {
      display: block;
      color: #fff;
    }
    span {
      vertical-align: middle;
    }
    &:hover {
      background-color: rgba(119, 119, 119, 1);
    }

    a.progress-bar {
      display: inline;
      line-height: 23px;
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
  }
}

.env-details {
  padding: 10px;

  p.db-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  i.env-icon {
    color: #fff;
    float: right;
    position: relative;
    top: 6px;
    font-size: 20px;
  }
  p.title {
    font-size: 26px;
    margin-bottom: 6px;
    height: 5ex;
    overflow: hidden;
  }
  p.db-name {
    font-size: 18px;
    margin-bottom: 6px;
  }
  p.os-name {
    margin-bottom: 0;
    font-size: 17px;
  }
}

/* Dropdown */
.dropdown {
    position: relative;
    display: inline-block;
}

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
      text-transform: capitalize;
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
