<template>
  <tr>
    <td class="is-icon">
      <a>
        <i class="fa fa-pencil"></i>
      </a>
    </td>
    <td>{{ item.name }}</td>
    <td>{{ item.rootUrl }}</td>
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
