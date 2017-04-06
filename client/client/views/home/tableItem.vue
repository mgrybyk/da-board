<template>
  <tr>
    <td>
      <a :href="item.name">{{ item.name }}</a>
    </td>
    <td>
      {{ item.details }}
    </td>
  </tr>
</template>

<script>
export default {
  data () {
    return { }
  },

  props: ['item']
}
</script>
