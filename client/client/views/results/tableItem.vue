<template>
  <tr>
    <td class="is-icon icon-center">
      <a v-bind:href="'/results/' + item.timestamp + '/#/'" target="_blank">
        <i v-bind:class="'fa fa-' + (item.test.icon || 'question-circle-o')"></i>
      </a>
    </td>
    <td class="hide-column-small">
      <span v-bind:title="item.build.package">{{ item.build.number }}</span>
    </td>
    <td>
      <span v-bind:title="item.name">{{ configs[item.name] ? configs[item.name].type : item.name }}</span>
    </td>
    <td class="is-icon icon-center">
      <i v-bind:class="'fa fa-' + (configs[item.name] && configs[item.name].isNix ? 'linux' : 'windows')" v-bind:title="configs[item.name] && configs[item.name].osNameExt"></i>
    </td>
    <td class="hide-column-medium">
      <span v-bind:title="configs[item.name] && configs[item.name].hostname">{{ configs[item.name] && configs[item.name].osNameExt }}</span>
    </td>
    <td class="is-icon icon-center">
      <i class="fa fa-database" v-bind:title="configs[item.name] && configs[item.name].dbName + ' ' + configs[item.name] && configs[item.name].dbVersion"></i>
    </td>
    <td class="hide-column-medium">
      {{ configs[item.name] && configs[item.name].dbName }} {{ configs[item.name] && configs[item.name].dbVersion }}
    </td>
    <td>
      {{ formatDate(item.timestamp) }}
    </td>
    <td class="hide-column-small">
      {{ item.test.duration }}
    </td>
    <td>
      <a v-bind:href="'/results/' + item.timestamp + '/#/'" target="_blank">
        {{ item.test.total }} / {{ item.test.passes }}/{{ item.test.failures }}
      </a>
    </td>
  </tr>
</template>

<script>
export default {
  data () {
    return { }
  },

  props: ['item', 'configs'],

  methods: {
    formatDate: (timestamp) => {
      let date = new Date(timestamp)
      function addZero (num) {
        return `${num < 10 ? '0' : ''}${num}`
      }
      return `${date.getFullYear()}-${addZero(date.getMonth() + 1)}-${addZero(date.getDate())}`
    }
  }
}
</script>

<style lang="scss">

</style>
<!--
                <tr>
                  <td class="is-icon">
                    <i class="fa fa-chrome" style="color: #4aae48;"></i>
                  </td>
                  <td>
                    6.1.4.984
                  </td>
                  <td>
                    upgrade major
                  </td>
                  <td class="is-icon">
                    <i class="fa fa-windows" style="color: #0cb3ee;"></i>
                  </td>
                  <td>
                    Server 2012 R2
                  </td>
                  <td class="is-icon">
                     <i class="fa fa-database" style="color: #f3a429;"></i>
                  </td>
                  <td>
                    MSSQL 2008 R2 SP1
                  </td>
                  <td>
                    1
                  </td>
                  <td>
                    1
                  </td>

                </tr>
                <tr>
                  <td class="is-icon">
                    <i class="fa fa-internet-explorer" style="color: #29b6f6;"></i>
                  </td>
                  <td>
                    6.1.4.984
                  </td>
                  <td>
                    upgrade major
                  </td>
                  <td class="is-icon">
                    <i class="fa fa-windows" style="color: #0cb3ee;"></i>
                  </td>
                  <td>
                    Server 2016
                  </td>
                  <td class="is-icon">
                    <i class="fa fa-database"></i>
                  </td>
                  <td>
                    Derby
                  </td>
                  <td>
                    26 Jan 10:01:42
                    03:47:20
                  </td>
                  <td>
                    2070 / 2048/4
                  </td>

                </tr>

                <tr>
                  <td class="is-icon">
                    <i class="fa fa-firefox" style="color: #f58d00;"></i>
                  </td>
                  <td>
                    6.1.4.984
                  </td>
                  <td>
                    upgrade major
                  </td>
                  <td class="is-icon">
                    <i class="fa fa-windows" style="color: #0cb3ee;"></i>
                  </td>
                  <td>
                    Server 2016
                  </td>
                  <td class="is-icon">
                    <i class="fa fa-database"></i>
                  </td>
                  <td>
                    Derby
                  </td>
                  <td>
                    26 Jan 10:01:42
                    03:47:20
                  </td>
                  <td>
                    2070 / 2048/4
                  </td>

                </tr>





-->
