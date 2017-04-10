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
              <li v-for="(item, index) in config.links">
                <a :href="formatUrl(item)" target="_blank">{{ index }}</a>
              </li>
              <li v-if="Object.keys(config.links || {}).length > 0 && (config.hostname || config.dbHostname)" class="divider"></li>
              <li><a v-if="config.hostname" @click="copyToClipboard" class="action">Copy hostname<textarea class="hidden">{{config.hostname}}</textarea></a></li>
              <li><a v-if="config.dbHostname" @click="copyToClipboard" class="action">Copy db host<textarea class="hidden">{{config.dbHostname}}</textarea></a></li>
            </ul>
          </div>
        </div>
      </i>

    </div>
    <div class="box-height">
      <div class="env-details">
        <p class="title" :title="config.hostname || ''">{{ config.name }}</p>
        <p class="env-detail type">{{ config.type }}</p>
        <p class="env-detail">{{ tile ? tile.package : '' }}</p>
        <p class="env-detail db-name" :title="config.dbHostname || ''">{{ config.dbName }} {{ config.dbVersion }}</p>
        <i :class="'fa-' + (config.isNix ? 'linux' : 'windows')" class="fa fa-lg env-icon"></i>
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

  <modal :visible="showModal" @close="closeModalBasic">
    <div class="box">
      <h1 class="title">Confirmation!</h1>

      <form v-on:submit.prevent="submit">
        <div class="block">
          <h4 class="title is-4">Are you sure you want to <strong>{{actionName}}</strong> <u>{{config.name}}</u></h4>

          <p class="control">
            <button class="button is-primary" type="submit">Yes</button>
            <button class="button is-link" @click="closeModalBasic" type="button">No</button>
          </p>
        </div>
      </form>

    </div>
  </modal>
</div>
</template>

<script>
import { Modal } from 'vue-bulma-modal'

const formatString = (str, params) => {
  if (str === null || str === undefined) {
    return str
  }
  Object.keys(params).forEach(key => {
    str = str.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), params[key])
  })

  return str
}

export default {
  created () {
    window.addEventListener('keyup', this.closeByEscape)
  },
  components: { Modal },

  data () {
    return {
      showModal: false,
      timer: true,
      visible: false,
      actionName: null
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
      this.actionName = actionName
      this.openModalBasic()
    },
    openModalBasic () {
      this.showModal = true
    },
    closeModalBasic () {
      this.showModal = false
      this.actionName = null
    },
    closeByEscape (ev) {
      if (this.showModal === true && ev.key === 'Escape') {
        this.closeModalBasic()
      }
    },
    submit () {
      this.$socket.emit('INTEGRATION_ACTION', { configName: this.config.name, action: this.actionName })
      this.closeModalBasic()
    },
    copyToClipboard (ev) {
      ev.target.firstElementChild.select()
      document.execCommand('copy')
    },
    formatUrl (url) {
      let cfgIntegration = this.config.integration
      let integrationProps = (cfgIntegration && cfgIntegration.props) || {}
      let rootUrl = (cfgIntegration && this.integrations[cfgIntegration.name] && this.integrations[cfgIntegration.name].rootUrl)
      let params = { hostname: this.config.hostname, ...integrationProps, rootUrl }
      return formatString(url, params)
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
        actions = { ...this.integrations[this.config.integration.name].actions }
      }
      Object.keys(actions).forEach(key => {
        let actionName = key.toLocaleLowerCase()
        if ((this.tile.isRunning && actionName === 'run') ||
           (!this.tile.isRunning && (key.startsWith('cancel') || key === 'abort' || key === 'stop'))) {
          delete actions[key]
        }
      })
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

  p {
    color: #fff;
  }

  &.color-failure {
    background-color: #f33960;
    box-shadow: 0 0 3px #f33960;
  }
  &.color-success {
    background-color: #1ac556;
    box-shadow: 0 0 3px #1ac556;
  }
  &.color-running {
    background-color: #29d;
    box-shadow: 0 0 3px #29d;
  }
  &.color-cancelled, &.color-none {
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
    &:hover {
      background-color: rgba(119, 119, 119, 1);
    }

    a.progress-bar {
      display: inline;
      line-height: 23px;
      span {
        position: relative;
        z-index: 22;
        font-weight: 700;
        color: #ff8d13;
      }
      progress {
        height: 100%;
        position: relative;
        top: -24px;
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
    font-size: 24px;
    margin-bottom: 0;
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
    z-index: 33;
    position: relative;
    display: inline-block;

    .hidden {
      opacity: 0;
      position: absolute;
      height: 0;
      width: 0;
      bottom: 0;
      right: 0;
    }
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
