<template>
<div>
  <div class="home-tiles">
    <div class="home-tile is-cyan">
      <a href="/#/configurations">
        <i class="fa fa-laptop"></i>
        <span>Configurations</span>
      </a>
    </div>
    
    <div class="home-tile is-purple">
      <a href="/#/results">
        <i class="fa fa-table"></i>
        <span>Results</span>
      </a>
    </div>
    
    <div class="home-tile is">
      <a href="/#/charts">
        <i class="fa fa-pie-chart"></i>
        <span>Charts</span>
      </a>
    </div>
  </div>

  <h2>Links</h2>
  <div class="home-table">
    <table></table>
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
.home-tiles {
  display: flex;
  flex-wrap: wrap;

  & .home-tile {
    height: 180px;
    width: 200px;
    margin: 10px 20px 30px 0;
    background-color: #f57070;
    transition: background-color .3s;

    &:hover {
      background-color: #ea5454;
      box-shadow: inset 0 0px 3px 2px #B83B5E;
    }

    & a {
      color: #f9f7f2;
      padding: 20px;
      display: flex;
      height: 100%;
      width: 100%;
      flex-wrap: wrap;
      justify-content: space-between;
      flex-direction: column;
    }
    & i {
      font-size: 86px;
    }
    & span {
      text-align: center;
      font-size: 22px;
    }
  }
}
</style>
