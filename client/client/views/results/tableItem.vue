<template>
  <tr :class="item.test.failures > 0 && 'failed'">
    <td class="is-icon icon-center" :class="item.test.icon">
      <a :href="'/results/' + item.timestamp + '/#/'" target="_blank">
        <i :class="'fa fa-' + (item.test.icon || 'question-circle-o')"></i>
      </a>
    </td>
    <td class="hide-column-small">
      <span :title="item.build.package">{{ item.build.number }}</span>
    </td>
    <td>
      <span :title="item.name">{{ configs[item.name] ? configs[item.name].type : item.name }}</span>
    </td>
    <td class="is-icon icon-center">
      <i :class="'fa fa-' + (configs[item.name] && configs[item.name].isNix ? 'linux' : 'windows')" :title="configs[item.name] && configs[item.name].osNameExt"></i>
    </td>
    <td class="hide-column-medium">
      <span :title="configs[item.name] && configs[item.name].hostname">{{ configs[item.name] && configs[item.name].osNameExt }}</span>
    </td>
    <td class="is-icon icon-center">
      <i class="fa fa-database" :class="configs[item.name] && configs[item.name].dbName" :title="(configs[item.name] && configs[item.name].dbName) + ' ' + (configs[item.name] && configs[item.name].dbVersion)"></i>
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
      <a :href="'/results/' + item.timestamp + '/#/'" target="_blank">
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
tr.failed {
  background-color: rgba(255,0,0, 0.1);
  &:hover {
    background-color: rgba(255,0,0, 0.2);
  }
}
i.fa {
  transition: color .3s;
}
td.is-icon {
  transition: background-color .3s;
  a {
    padding: 4px 8px;
    margin: -4px -8px;
  }
}
td.internet-explorer {
  $ie-color: #29b6f6;
  i { color: $ie-color; }
  &:hover {
    background-color: $ie-color;
    i { color: #fff; }
  }
}
td.firefox {
  $ff-color: #f58d00;
  i { color: $ff-color; }
  &:hover {
    background-color: $ff-color;
    i { color: #fff; }
  }
}
td.chrome { 
  $ch-color: #71d375;
  i { color: $ch-color; }
  &:hover {
    background-color: $ch-color;
    i { color: #fff; }
  }
}
td.terminal {
  $term-color: #34495e;
  i { color: $term-color; }
  &:hover {
    background-color: $term-color;
    i { color: #fff; }
  }
}
i.fa-windows {
  color: #19a0d0;
}
i.fa-linux {
  color: #5f5f00;
}
i.fa-database.Oracle {
  color: #bd0000;
}
i.fa-database.MSSQL {
  color: #f3a62d;
}
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
