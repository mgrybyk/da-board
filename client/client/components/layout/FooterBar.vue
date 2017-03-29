<template>
  <footer class="footer">
    <div class="container">
      <div class="content has-text-centered">
        <p>ads</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {

  data () {
    return this.$store.state.pkg
  }

}
</script>

<style lang="scss" scoped>
.footer {
  margin-left: 180px;
  padding: 2rem 1.5rem 2rem;
}
</style>
