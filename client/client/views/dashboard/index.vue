<template>
  <div>

    <div class="tile is-ancestor" style="flex-wrap: wrap;">
      <Tile
        v-for="(item, index) in dashboard.data"
        v-bind:configs="configs"
        v-bind:item="item">
      </Tile>
      
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Tile from './tile'

export default {
  components: { Tile },

  beforeMount () { },

  data () {
    return { }
  },

  destroyed () { },

  computed: mapGetters({
    dashboard: 'dashboard',
    configs: 'configs'
  }),

  mounted () { }
}
</script>

<style lang="scss">
article.with-stripe {
  padding: 0;
  min-width: 136px;
  transition: background-color 1s;
}
.bottom-stripe {
  display: block;
  text-align: center;
  background-color: rgba(119, 119, 119, 0.7);
  border-radius: 0 0px 3px 3px;
  height: 25px;
  transition: background-color .3s;
  progress {
    border-radius: 0 0px 3px 3px;
  }
  a {
    display: block;
    color: #fff;
  }
  span {
    vertical-align: middle;
  }
  &:hover {
    background-color: rgba(119, 119, 119, 1);
  }
}
p.env-detail.db-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.env-details {
  padding: 10px;
}
.box-height {
  min-height: 146px;
}
.color-failure {
  background-color: #FF6384;
  p {
    color: #fff;
  }
}
.color-success {
  background-color: rgba(35, 209, 96, 0.9);
  p {
    color: #fff;
  }
}
.color-cancelled {
  background-color: #eee;
}
.color-cancelle, .color-running {
  i.env-icon {
    color: #000;
  }
}
i.env-icon {
  color: #fff;
  float: right;
  position: relative;
  top: 3px;
}
p.title {
  font-size: 24px;
  margin-bottom: 0;
  height: 5ex;
  overflow: hidden;
}
p.db-name {
  font-size: 16px;
  margin-bottom: 5px;
}
p.os-name {
  margin-bottom: 0;
}
@media (max-width:768px)
{
  .box-height {
    min-height: 0;
  }
}
@media (min-width:1258px)
{
  p.title {
    font-size: 30px;
    height: 3ex;
  }
  p.db-name {
    font-size: 20px;
    margin-bottom: 10px;
  }
  p.os-name {
    margin-bottom: 0;
    font-size: 17px;
  }
  i.env-icon {
    font-size: 2em;
  }
}
@media (min-width:1600px)
{
  div.tile.is-3 {
    width: 20%;
  }
}
</style>
