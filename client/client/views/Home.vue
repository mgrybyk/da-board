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
  <section v-for="group in groups.names">
    <h3 v-if="group !== ''">{{group}}</h3>
    <div class="home-table">
      <table class="table is-bordered is-striped is-narrow">
        <thead>
          <tr>
            <th>Name</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <TableItem
            v-for="(item, key) in groups.filtered[group]"
            :item="item"
            :key="item._id">
          </TableItem>
        </tbody>
      </table>
    </div>
  </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TableItem from './home/tableItem'

export default {
  components: { TableItem },

  beforeMount () { },

  computed: {
    ...mapGetters({
      homeLinks: 'homeLinks'
    }),
    groups () {
      let groups = { names: [], filtered: {} }
      Object.keys(this.homeLinks).forEach(key => {
        let group = this.homeLinks[key].group
        if (!group) group = ''
        if (!groups.names.includes(group)) {
          groups.names.push(group)
          if (!groups.filtered[group]) {
            groups.filtered[group] = []
          }
        }
        groups.filtered[group].push(this.homeLinks[key])
      })
      groups.names.sort()
      return groups
    }
  },

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

  .home-tile {
    height: 180px;
    width: 200px;
    margin: 10px 20px 30px 0;
    background-color: #f57070;
    transition: background-color .5s;

    &:hover {
      background-color: #ea5454;
      box-shadow: inset 0 0px 3px 2px #B83B5E;
      i {
        color: #f9f7f2;
      }
      span {
        transform: scale(1.05);
      }
    }

    a {
      color: #f9f7f2;
      padding: 20px;
      display: flex;
      height: 100%;
      width: 100%;
      flex-wrap: wrap;
      justify-content: space-between;
      flex-direction: column;
    }
    i {
      transition: color .4s;
      font-size: 86px;
      color: #522546;
    }
    span {
      text-align: center;
      font-size: 22px;
      transition: transform .3s;
    }
  }
}
</style>
