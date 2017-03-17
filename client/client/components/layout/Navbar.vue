<template>
  <section class="hero is-bold app-navbar animated" :class="{ slideInDown: show, slideOutDown: !show }">
    <div class="hero-head">
      <nav class="nav">
        <div class="nav-left">
          <a class="nav-item is-hidden-tablet" @click="toggleSidebar(!sidebar.opened)">
            <i class="fa fa-bars" aria-hidden="true"></i>
          </a>
        </div>
        <div class="nav-center">
          <a class="nav-item hero-brand" href="/#/">
            <img src="~assets/favicon.png" :alt="pkginfo.description">
            <tooltip :label="buildPackage.substring(0,10)" placement="right" :type="tooltipColor" size="medium" :no-animate="false" :always="true" :rounded="true" :nothing="notifyPackage">
              <div class>
                <span class="vue">Da</span><strong class="admin">Board</strong>
              </div>
            </tooltip>
          </a>
        </div>
        <div class="nav-right is-flex"></div>
        <div class="auth-control">
          <Auth></Auth>
        </div>
      </nav>
    </div>
  </section>
</template>

<script>
import Tooltip from 'vue-bulma-tooltip'
import Auth from './Auth'
import { mapGetters, mapActions } from 'vuex'

export default {

  components: {
    Tooltip,
    Auth
  },

  data () {
    return {
      newPackage: false,
      prevPackage: ''
    }
  },

  props: {
    show: Boolean
  },

  computed: {
    ...mapGetters({
      pkginfo: 'pkg',
      sidebar: 'sidebar',
      buildNumber: 'buildNumber',
      buildPackage: 'buildPackage'
    }),
    tooltipColor () {
      if (this.newPackage) {
        setTimeout(() => { this.newPackage = false }, 1000)
        return 'warning'
      }
      return 'success'
    },
    notifyPackage () {
      if (this.prevPackage === '') {
        this.prevPackage = this.buildPackage
        return
      }
      if (this.buildPackage === this.prevPackage) return
      this.newPackage = true
      this.prevPackage = this.buildPackage
    }
  },

  methods: mapActions([
    'toggleSidebar'
  ])
}
</script>

<style lang="scss">
@import '~bulma/sass/utilities/variables';

.app-navbar {
  position: fixed;
  min-width: 100%;
  z-index: 1024;
  box-shadow: 0 2px 3px rgba(17, 17, 17, 0.1), 0 0 0 1px rgba(17, 17, 17, 0.1);

  .container {
    margin: auto 10px;
  }

  .nav-right {
    align-items: stretch;
    align-items: stretch;
    flex: 1;
    justify-content: flex-end;
    overflow: hidden;
    overflow-x: auto;
    white-space: nowrap;
  }
}

.hero-brand {
  .vue {
    margin-left: 10px;
    color: #36AC70;
  }
  .admin {
    color: #28374B;
  }
}

div.nav-center {
  margin-left: -60px;
}

div.tooltip--medium:after {
  width: 120px;
}
div [class*=tooltip--]:after {
  transition: background-color 1s !important;
}
div .tooltip--right:before {
  transition: border-right-color 1s !important;
}
</style>

<style lang="scss" scoped>
  .auth-control {
    line-height: 0;
    margin: 7px 10px 0 5px;
  }
</style>
