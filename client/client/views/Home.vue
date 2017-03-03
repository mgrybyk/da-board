<template>
  <div class="content has-text-centered">

    <div class="tile is-ancestor">  
      <div class="tile is-parent is-3">
        <article class="tile is-child notification is-purple">
          <span class="tile-text">
            <a href="/#/dashboard"><i class="fa fa-tachometer"></i></a>
          </span>
        </article>
      </div>
      <div class="tile is-parent is-3">
        <article class="tile is-child notification is-cyan">
          <span class="tile-text">
            <a href="/#/results"><i class="fa fa-table"></i></a>
          </span>
        </article>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  components: { },

  beforeMount () { },

  destroyed () { },

  data () {
    return { }
  },

  mounted () { }
}

</script>

<style lang="scss" scoped>
div.content {
  line-height: normal;
}
.is-cyan {
  background-color: #6acbef;
  transition: background-color 0.5s;
}
.is-cyan:hover {
  background-color: #43b6e0;
}
.is-purple {
  background-color: #694de2;
  transition: background-color 0.5s;
}
.is-purple:hover {
  background-color: #4c32bb;
}
.tile a {
  color: #fff;
  font-size: 6em;
  vertical-align: middle;
  display: table-cell;
  border-bottom: none;
}
.tile a:visited {
  color: #fff;
}
.tile-text {

}
article.notification {
  padding: 2.75rem 0.5rem 0rem 0.5rem;
}
</style>
