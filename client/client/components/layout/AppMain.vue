<template>
  <section class="app-main">
    <div class="container is-fluid is-marginless app-content">
      <levelbar></levelbar>
      <transition
        mode="out-in"
        enter-active-class="fadeIn"
        leave-active-class="fadeOut"
        appear>
        <router-view class="animated"></router-view>
      </transition>
    </div>
  </section>
</template>

<script>
import Levelbar from './Levelbar'

export default {
  components: {
    Levelbar
  }
}
</script>

<style lang="scss">
@import '~bulma/sass/utilities/variables';
@import '~bulma/sass/utilities/mixins';

.app-main {
  padding-top: 50px;
  margin-left: 180px;
  transform: translate3d(0, 0, 0);

  @include mobile() {
    margin-left: 0;
  }

}

.app-content {
  padding: 20px;
}
</style>

<style lang="scss">
.table-responsive {
  display: block;
  width: 100%;
  min-height: .01%;
  overflow-x: auto;
  th {
    text-align: center;
  }
}

.table-responsive {
  .table td {
    vertical-align: middle;
    i.fa {
      vertical-align: initial;
    }
  }
  &.centered .table td {
    text-align: center;
  }
}

td.is-icon.has-link {
  width: 2%;
  text-align: center;
  padding: 0;
  height: 1px;
  transition: background-color .3s;
  i.fa {
    transition: color .3s;
  }
  a {
    min-height: 32px;
    display: block;
    padding: .25em .5em;
    height: 100%;
    i {
      position: relative;
      top: calc(50% - 12px);
    }
  }
}
td.is-icon.has-link {
  $edit-color: #00d1b2;
  i { color: $edit-color; }
  &:hover {
    background-color: $edit-color;
    i { color: #fff; }
  }
}
td.is-icon.remove {
  $remove-color: #ff3860;
  i { color: $remove-color; }
  &:hover {
    background-color: $remove-color;
    i { color: #fff; }
  }
}

// Dialog
textarea.textarea {
  height: auto;
  min-height: 60px;
}

form .control:not(:last-child) {
    margin-bottom: .75rem;
}

// New Button
div.top-control>* {
  position: absolute;
  top: 22px;
  left: 0;
  margin-left: 20px;
  user-select: none;
}
button.is-smaller {
  border-radius: 2px;
  font-size: 0.85rem;
}
</style>
