<template>
  <tr>
    <td>
      <a :href="item.link" target="_blank">{{ item.name }}</a>
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
