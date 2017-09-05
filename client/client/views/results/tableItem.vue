<template>
  <tr :class="item.test.failures > 0 && 'failed'">
    <td class="is-icon has-link" :class="item.test.icon">
      <a :href="'/results/' + item.timestamp + '/#/'" target="_blank" :title="item.test.typeFull">
        <i :class="'fa fa-' + (item.test.icon || 'question-circle-o')"></i>
      </a>
    </td>
    <td class="hide-column-small">
      <span :title="item.build.package">{{ item.build.number }}</span>
    </td>
    <td>
      <span>{{item.name}} <span v-if="item.config.type" class="hide-column-medium env-type-small">({{ item.config.type }})</span></span>
    </td>
    <td class="is-icon">
      <i :class="'fa fa-' + (item.config.isNix != undefined && (item.config.isNix ? 'linux' : 'windows') || 'question')" :title="item.config.osNameExt"></i>
    </td>
    <td class="hide-column-medium">
      <span :title="item.config.hostname">{{ item.config.osNameExt }}</span>
    </td>
    <td class="is-icon">
      <i class="fa fa-database" :class="item.config.dbName" 
         :title="(item.config.dbName || item.config.dbVersion) && (item.config.dbName + ' ' + item.config.dbVersion)"></i>
    </td>
    <td class="hide-column-medium" :title="item.config.dbHostname">
      {{ item.config.dbName }} {{ item.config.dbVersion }}
    </td>
    <td>
      {{ formatDate(item.timestamp) }}
    </td>
    <td class="hide-column-small">
      {{ item.test.duration }}
    </td>
    <td>
      <a :href="item.link || ('/results/' + item.timestamp + '/#/')" target="_blank">
        <span v-if="item.test.total || item.test.passes || item.test.failures">
          {{ item.test.total }} / {{ item.test.passes }}/{{ item.test.failures }}
        </span>
        <span v-else>link</span>
      </a>
    </td>
  </tr>
</template>

<script>
export default {
  data () {
    return { }
  },

  props: ['item'],

  methods: {
    formatDate: (timestamp) => {
      let date = new Date(timestamp)
      function addZero (num) {
        return `${num < 10 ? '0' : ''}${num}`
      }
      return `${date.getFullYear()}-${addZero(date.getMonth() + 1)}-${addZero(date.getDate())} 
      ${addZero(date.getHours())}:${addZero(date.getMinutes())}`
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
  span.env-type-small {
    font-size: small;
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
