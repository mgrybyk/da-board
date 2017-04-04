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
            <span class="vue">Da</span><strong class="admin">Board</strong>
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
import Auth from './Auth'
import { mapGetters, mapActions } from 'vuex'

export default {

  components: {
    Auth
  },

  data () {
    return { }
  },

  props: {
    show: Boolean
  },

  computed: {
    ...mapGetters({
      pkginfo: 'pkg',
      sidebar: 'sidebar'
    })
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
</style>

<style lang="scss" scoped>
  .auth-control {
    line-height: 0;
    margin: 7px 10px 0 5px;
  }
</style>
