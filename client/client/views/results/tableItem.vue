<template>
  <tr :class="item.test.failures > 0 && 'failed'">
    <td class="is-icon has-link" :class="item.test.icon">
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
    <td class="is-icon">
      <i :class="'fa fa-' + (configs[item.name] && configs[item.name].isNix ? 'linux' : 'windows')" :title="configs[item.name] && configs[item.name].osNameExt"></i>
    </td>
    <td class="hide-column-medium">
      <span :title="configs[item.name] && configs[item.name].hostname">{{ configs[item.name] && configs[item.name].osNameExt }}</span>
    </td>
    <td class="is-icon">
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

<style lang="scss" scoped>
.table.is-striped tbody tr.failed {
  background-color: rgba(255,0,0, 0.1);
  &:hover {
    background-color: rgba(255,0,0, 0.2);
  }
}

.table-responsive .table td {
  vertical-align: middle;
  text-align: center;
  i.fa {
    vertical-align: initial;
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
