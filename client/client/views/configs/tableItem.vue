<template>
  <tr>
    <td class="is-icon">
      <a>
        <i class="fa fa-pencil"></i>
      </a>
    </td>
    <td>{{ item.name }}</td>
    <td>{{ item.type }}</td>
    <td>{{ item.hostname }}</td>
    <td>{{ item.osNameExt }}</td>
    <td>{{ item.dbName }}</td>
    <td>{{ item.dbVersion }}</td>
    <td>{{ Math.round(item.duration) }}</td>
    <td>{{ item.isNix }}</td>
    <td>{{ item.disabled }}</td>
  </tr>
</template>

<script>
export default {
  data () {
    return { }
  },

  props: ['item'],

  methods: { }
}
</script>

<style lang="scss">

</style>
