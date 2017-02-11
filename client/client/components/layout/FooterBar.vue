<template>
  <footer class="footer">
    <div class="container">
      <div class="content has-text-centered">
        <p>#hackfest-2017</p>
        <p>To start simulated process <strong>import new version</strong> in <a href="http://ua-mg-docker-automation:8080/da/app#/component/e09aadee-577c-491b-81b0-181fcd8ce01c/versions" target="_blank">Deployment Automation</a></p>
        <p>username: demo<br>
        password: demo</p>
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

<style lang="scss">
@import '~bulma/sass/utilities/mixins';

.footer {
  margin-left: 180px;
  padding: 2rem 1.5rem 2rem;
  
  @include mobile() {
    margin-left: 0;
  }
  
  .social a {
    border-bottom: none !important;
  }

  .fa.fa-heart {
    color: red;
  }
}
</style>
