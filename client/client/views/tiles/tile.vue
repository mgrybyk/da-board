<template>
<div class="my-tile">
  <article class="with-stripe" :class="'color-' + getStatus">
    <div class="stripe top-stripe" :class="(!auth.isAuth || (tile && tile.isRunning)) && 'flags-disabled'">
      <i class="flag ok fa fa-check-circle-o" title="Mark as ok" @click="setFlag('ok')"></i>
      <i class="flag bad fa fa-exclamation-circle" title="Mark as bad" @click="setFlag('bad')"></i>
      <i v-if="getStatus === 'locked'" class="flag lock fa fa-unlock-alt" title="Remove lock" @click="setFlag('lock')"></i>
      <i v-else class="flag lock fa fa-lock" title="Mark as locked" @click="setFlag('lock')"></i>

      <i class="fa fa-chevron-down" v-on:click="toggleDropdown">
        <div class="m_dropdown">
          <div v-bind:class="{ 'show': visible }" class="m_dropdown-content">
            <ul>
              <li v-if="auth.isAuth && actionNamesSorted.length > 0" class="group-header">ACTIONS</li>
              <li v-if="auth.isAuth" v-for="item in actionNamesSorted">
                <a v-on:click="tileAction(item)" class="action">{{ item }}</a>
              </li>
              <li v-if="auth.isAuth && linkNamesSorted.length > 0" class="group-header">LINKS</li>
              <li v-for="item in linkNamesSorted">
                <a :href="formatUrl(item)" target="_blank">{{ item }}</a>
              </li>
              <li v-if="linkNamesSorted.length > 0 && (config.hostname || config.dbHostname)" class="divider"></li>
              <li><a v-if="config.hostname" @click="copyToClipboard" class="action">Copy hostname<textarea class="hidden">{{config.hostname}}</textarea></a></li>
              <li><a v-if="config.dbHostname" @click="copyToClipboard" class="action">Copy db host<textarea class="hidden">{{config.dbHostname}}</textarea></a></li>
              <li v-if="tile && tile.timestamp" class="divider"></li>
              <li v-if="tile && tile.timestamp" class="tile-timestamp">
                {{ tile.timestamp && new Date(tile.timestamp).toLocaleString() }}
              </li>
            </ul>
          </div>
        </div>
      </i>

    </div>
    <div class="box-height">
      <div class="env-details">
        <p class="title" :title="config.hostname || ''">{{ config.name }}</p>
        <p class="env-detail type">{{ config.type }}</p>
        <p class="env-detail" :title="tile && tile.package"><em class="build-warn" title="Build is not latest!">{{buildWarn}}</em> {{ (tile && tile.package) || 'N/A' }}</p>
        <p class="env-detail db-name" :title="config.dbHostname || ''">{{ config.dbName }} {{ config.dbVersion }}</p>
        <i :class="'fa-' + (config.isNix ? 'linux' : 'windows')" class="fa fa-lg env-icon"></i>
        <p class="env-detail os-name">{{ config.osNameExt }}</p>
      </div>
    </div>
    <div class="stripe bottom-stripe" :title="stagesTooltip">
      <a v-if="!tile || (tile.isCancelled === undefined && tile.isFailure === undefined && tile.userFlag === undefined && tile.isRunning === undefined)"><span>No activity</span></a>
      <a v-else-if="!tile.isRunning" :href="tile.processUrl && tile.processUrl" target="_blank">
        <span v-if="tile.userFlag" :title="new Date(tile.userFlag.timestamp).toLocaleString()">
          <i class="fa fa-lock flag" v-if="tile.userFlag.flag === 'lock'"></i>
          <i class="fa fa-thumbs-o-up flag" v-else-if="tile.userFlag.flag === 'ok'"></i>
          <i class="fa fa-thumbs-o-down flag" v-else-if="tile.userFlag.flag === 'bad'"></i>
          <i class="fa fa-question-circle flag" v-else></i> by {{ tile.userFlag.user }}
        </span>
        <span v-else-if="tile.isCancelled">Aborted</span>
        <span v-else-if="tile.isFailure">Failed: {{ getReason }}</span>
        <span v-else-if="!tile.isFailure">Tests Passed</span>
      </a>
      <a v-else class="progress-bar" :href="tile.processUrl && tile.processUrl" target="_blank">
        <span>{{ getProgress + '%' }} {{ getPhase }}</span>
        <progress class="progress is-info" :value="getProgress" max="100"></progress>
      </a>
    </div>
  </article>

  <ItemConfirmation :actionName="actionName" :name="config.name" :socketEventName="'INTEGRATION_ACTION'" 
  :openConfirmation="showConfirmation" :dynamicProps="dynamicProps"></ItemConfirmation>
</div>
</template>

<script>
import ItemConfirmation from '../../components/layout/ItemConfirmation'

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
  components: { ItemConfirmation },

  data () {
    return {
      showConfirmation: false,
      timer: true,
      visible: false,
      actionName: null
    }
  },

  props: ['config', 'tile', 'timeDiff', 'auth', 'integrations', 'builds'],

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
      this.showConfirmation = !this.showConfirmation
    },

    copyToClipboard (ev) {
      ev.target.firstElementChild.select()
      document.execCommand('copy')
    },
    formatUrl (key) {
      let url = this.config.links[key]
      let cfgIntegration = this.config.integration
      let integrationProps = (cfgIntegration && cfgIntegration.props) || {}
      let rootUrl = (cfgIntegration && this.integrations[cfgIntegration.name] && this.integrations[cfgIntegration.name].rootUrl)
      let params = { hostname: this.config.hostname, ...integrationProps, rootUrl }
      return formatString(url, params)
    },
    setFlag (flagType) {
      if (!this.auth.isAuth || (this.tile && this.tile.isRunning)) return
      this.$socket.emit('FLAG_SET', { flag: flagType, name: this.config.name })
    }
  },

  computed: {
    getStatus () {
      if (!this.tile) return 'none'
      if (this.tile.isRunning === undefined && this.tile.isFailure === undefined && this.tile.isCancelled === undefined && this.tile.userFlag === undefined) {
        return 'none'
      } else if (this.tile.isRunning) {
        return 'running'
      } else if (this.tile.userFlag && this.tile.userFlag.flag === 'lock') {
        return 'locked'
      } else if (this.tile.userFlag && this.tile.userFlag.flag === 'ok') {
        return 'success'
      } else if (this.tile.userFlag && this.tile.userFlag.flag === 'bad') {
        return 'failure'
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
      if (!duration) duration = 3600000 // 1 hour: 60 * 60 * 1000
      let currentTime = new Date().getTime()
      if (currentTime - startTime > duration) return 100
      let diff = currentTime - startTime + this.timeDiff
      diff = (diff > 0) ? diff : 0
      let percent = Math.round(100 * diff / duration)
      return percent >= 100 ? 100 : percent
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
      this.tile && Object.keys(actions).forEach(key => {
        let actionName = key.toLocaleLowerCase()
        if ((this.tile.isRunning && actionName.startsWith('run')) ||
           (!this.tile.isRunning && (actionName.startsWith('cancel') || actionName === 'abort' || actionName === 'stop'))) {
          delete actions[key]
        }
      })
      return actions
    },
    buildWarn () {
      let buildWarn = ''
      if (!this.tile || !this.tile.package || !this.config.integration || !this.config.integration.name || !this.builds[this.config.integration.name]) {
        return buildWarn
      }
      return this.builds[this.config.integration.name].package !== this.tile.package ? '(!)' : buildWarn
    },
    dynamicProps () {
      if (!this.integrations || !this.actionName || !this.config.integration) return false
      let integration = this.integrations[this.config.integration.name]
      let action = integration && integration.actions && integration.actions[this.actionName]
      if (!action || !action.dynamicProps) return false

      let dynamicProps = {}
      Object.keys(action.dynamicProps).forEach(key => {
        dynamicProps[key] = { ...action.dynamicProps[key] }
        if (this.config.integration.dynamicProps && this.config.integration.dynamicProps[key] !== undefined) {
          dynamicProps[key].value = this.config.integration.dynamicProps[key]
        }
      })

      return dynamicProps
    },
    actionNamesSorted () {
      let namesArr = []
      Object.keys(this.actions).forEach(key => {
        namesArr.push(key)
      })
      namesArr.reverse()
      return namesArr
    },
    linkNamesSorted () {
      let namesArr = []
      if (!this.config.links) return namesArr
      Object.keys(this.config.links).forEach(key => {
        namesArr.push(key)
      })
      namesArr.sort()
      return namesArr
    },
    stagesTooltip () {
      if (!this.tile || !this.tile.stages) return
      let stagesTooltip = ''
      Object.keys(this.tile.stages).forEach(key => {
        let stageRow = `\n${key}: ${(this.tile.stages[key] || 'N/A').toUpperCase()}`
        stagesTooltip = stageRow + stagesTooltip
      })
      return stagesTooltip
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
$col_bad: #f79595;
$col_ok: #b9ea9b;
$col_run: #9fc3ff;
$col_lock: #f1e79c;

div.my-tile {
  width: 260px;
  padding: 0 0 15px 15px;
}
.box-height {
  min-height: 146px;
}

article.with-stripe {
  padding: 0;
  transition: background-color 1s;
  border-radius: 3px;
  box-shadow: 0 0 3px #c3c3c3;

  p {
    color: #171717;
  }

  &.color-failure {
    background-color: $col_bad;
    box-shadow: 0 0 3px darken($col_bad, 10%);
  }
  &.color-success {
    background-color: $col_ok;
    box-shadow: 0 0 3px darken($col_ok, 30%);
  }
  &.color-running {
    background-color: $col_run;
    box-shadow: 0 0 3px darken($col_run, 30%);
  }
  &.color-locked {
    background-color: $col_lock;
    box-shadow: 0 0 3px darken($col_lock, 30%);
  }
  &.color-cancelled, &.color-none {
    background-color: #eee;
  }

  .build-warn {
    color: #bf2929;
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
    &.flags-disabled i.flag {
      cursor: default;
      transition: none;
      color: #777 !important;
      &:hover {
        transform: none;
      }
    }
    i.flag {
      font-weight: 200;
      transition: transform .5s, font-weight .3s, color .5s;
      &:hover {
        font-weight: 500;
        transform: scale(1.25);
      }
      &.ok {
        color: darken($col_ok, 35%);
        &:hover {
          color: saturate(darken($col_ok, 30%), 15%);
        }
      }
      &.bad {
        color: darken($col_bad, 10%);
        &:hover {
          color: saturate(darken($col_bad, 7%), 25%);
        }
      }
      &.lock {
        color: darken($col_lock, 30%);        
        &:hover {
          color: saturate(darken($col_lock, 30%), 10%);
        }
      }
    }
    i {
      transition: color .5s;
      padding: 0 10px;
      font-size: 20px;
      cursor: pointer;
    }
    i:hover {
      color: $col_run;
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
    i.flag {
      vertical-align: inherit;
    }
  }
}

.env-details {
  padding: 10px;
  font-size: 18px;
  
  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p.db-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  i.env-icon {
    float: right;
    position: relative;
    top: 6px;
    font-size: 22px;
  }
  p.title {
    font-size: 26px;
    margin-bottom: 0;
    height: 4.9ex;
    overflow: hidden;
    font-weight: 400;
    white-space: normal;
  }
  p.db-name {
    font-size: 19px;
    margin-bottom: 6px;
  }
  p.os-name {
    margin-bottom: 0;
    font-size: 19px;
  }
}

/* Dropdown */
.m_dropdown {
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

.m_dropdown-content {
  display:block;
  position: absolute;
  right: 0;
  background-color: #f9f9f9;
  min-width: 190px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  opacity: 0;
  transition: opacity .33s;
  visibility: hidden;

  &.show ul {
    display: inherit;
  }
  ul {
    display: none;
  }

  li {
    font-size: 16px;
    text-decoration: none;    

    a {
      text-transform: capitalize;
      display: block;
      padding: 10px 16px;

      &.action {
        color: #4a4a4a;
      }
    }

    &:not(.divider):not(.group-header):hover {
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
  
  li.group-header {
    color: #444444;
    background-color: #e8e8e8;
    padding: 2px;
    font-size: 14px;
    cursor: default;
  }
}

.show {
  opacity: 1;
  visibility: visible;
}

.tile-timestamp {
  color: #b5b5b5;
  cursor: default;
}

</style>
