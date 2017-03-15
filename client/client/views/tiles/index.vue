<template>
  <div>

  <draggable v-model="configs" :options="{group:'people'}" @start="drag=true" @end="onEnd" class="my-tile-parent">
    <Tile
        v-for="(item, index) in configs"
        :timeDiff="timeDiff"
        :tile="tiles.data[item.name]"
        :config="item"
        :key="item._id">
      </Tile>
  </draggable>

  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapGetters, mapActions } from 'vuex'
import Tile from './tile'

export default {
  components: { Tile, draggable },

  beforeMount () { },

  data () {
    return { }
  },

  destroyed () { },

  methods: {
    ...mapActions([
      'configsUpdateSorting'
    ]),
    onEnd (evt) {
      // no changes
      if (evt.newIndex === evt.oldIndex) return

      const step = 2048
      let sortBy = this.configs[evt.newIndex].sortBy
      let newSorting = 0

      if (evt.newIndex === 0) {
        // start
        newSorting = sortBy - step
      } else if (evt.newIndex === this.configs.length - 1) {
        // end
        newSorting = sortBy + step
      } else if (evt.newIndex > evt.oldIndex) {
        // after
        newSorting = (this.configs[evt.newIndex + 1].sortBy + sortBy) * 0.5
      } else if (evt.newIndex < evt.oldIndex) {
        // before
        newSorting = (this.configs[evt.newIndex - 1].sortBy + sortBy) * 0.5
      }

      let newConfig = { ...this.configs[evt.oldIndex], sortBy: newSorting }
      this.$socket.emit('CONFIGS_UPDATE_SORTING', newConfig)
      this.configsUpdateSorting(newConfig)
    }
  },

  computed: {
    ...mapGetters({
      tiles: 'tiles',
      configs: 'configsEnabled',
      timeDiff: 'timeDiff'
    })
  },

  mounted () { }
}
</script>

<style lang="scss">
div.my-tile-parent {
  display: flex;
  flex-wrap: wrap;
}
article.with-stripe {
  padding: 0;
  min-width: 136px;
  transition: background-color 1s;
  border-radius: 3px;
  box-shadow: 0 0 3px #dfdfdf;
  &.color-failure {
    box-shadow: 0 0 3px #f33960;
  }
  &.color-success {
    box-shadow: 0 0 3px #1ac556;
  }
}
.stripe {
  display: block;
  text-align: center;
  height: 25px;
  transition: background-color .3s;
  
  &.top-stripe {
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 3px 3px 0px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    i {
      padding: 0 10px;
      font-size: 16px;
      cursor: pointer;
    }
    i:hover {
      color: #29d;
    }
    &:hover {
      background-color: rgba(255, 255, 255, 0.85);
    }
  }

  &.bottom-stripe {
    background-color: rgba(119, 119, 119, 0.7);
    border-radius: 0 0px 3px 3px;

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
  background-color: #f33960;
  p {
    color: #fff;
  }
}
.color-success {
  background-color: #1ac556;
  p {
    color: #fff;
  }
}
.color-cancelled {
  background-color: #eee;
}
.color-cancelled, .color-running {
  i.env-icon {
    color: #000;
  }
}
i.env-icon {
  color: #fff;
  float: right;
  position: relative;
  top: 6px;
  font-size: 20px;
}
p.title {
  font-size: 26px;
  margin-bottom: 6px;
  height: 5ex;
  overflow: hidden;
}
p.db-name {
  font-size: 18px;
  margin-bottom: 6px;
}
p.os-name {
  margin-bottom: 0;
  font-size: 17px;
}
@media (max-width:768px)
{

}
@media (min-width:1258px)
{

}
@media (min-width:1600px)
{

}
</style>

<!--
    <div class="tile is-ancestor" style="flex-wrap: wrap;">
      <Tile
        v-for="(item, index) in tiles.data"
        :timeDiff="timeDiff"
        :configs="configs"
        :item="item"
        :key="item._id">
      </Tile>
      
    </div>
-->
