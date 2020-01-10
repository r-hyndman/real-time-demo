<template>
  <v-card class="elevation-0">
    <v-card-title>
      Move the mouse to fill in the whole game board.
    </v-card-title>
    <v-card-text>
      While not impossible to complete on your own, a friend makes it a lot easier!
    </v-card-text>
    <v-card-text style="position: relative;">
      <div
        class="game-board"
        :style="gameBoardWidth()"
      >
        <div v-for="x in gameCols" :key="x">
          <div v-for="y in gameRows" :key="y">
            <div
              :class="getClass(x, y)"
              :style="getStyle()"
              @mouseenter="activateTile(x, y)"
            ></div>
          </div>
        </div>
      </div>
      <div v-if="isCompleted" class="overlay" :style="gameBoardWidth()">
        Congratulations!
      </div>
    </v-card-text>
    <v-card-title v-if="isCompleted">
      <v-btn @click="resetGame()">Reset</v-btn>
    </v-card-title>
    <v-card-title v-else>
      {{ percentCompleted }}% completed
    </v-card-title>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { registerCallback } from '../mixins/registerCallback';

export default {
  name: 'Game',
  mixins: [registerCallback],
  data() {
    return {
      tileWidth: 32,
      tileHeight: 32,
      gameRows: 20,
      gameCols: 20,
      isCompleted: false
    };
  },
  computed: {
    ...mapGetters({
      ACTIVE_TILES: 'gameTiles/GET_COLLECTION'
    }),
    activeTiles() {
      return this.ACTIVE_TILES ? this.ACTIVE_TILES : {};
    },
    percentCompleted() {
      const numTiles = this.gameRows * this.gameCols;
      const numActive = Object.keys(this.activeTiles).length;

      return Math.floor((numActive / numTiles) * 100);
    }
  },
  mounted() {
    this.registerCallback('activeTiles', activeTiles => {
      this.$store.dispatch('gameTiles/RECEIVE_ACTIVE_TILES', activeTiles);
    });

    this.registerCallback('activateTile', tile => {
      this.$store.dispatch('gameTiles/ACTIVATE_TILE', tile);
    });

    this.registerCallback('deactivateTile', tileID => {
      this.$store.dispatch('gameTiles/DEACTIVATE_TILE', tileID);
    });

    this.registerCallback('gameCompleted', () => {
      this.isCompleted = true;
    });

    this.registerCallback('resetGame', () => {
      this.$store.dispatch('gameTiles/RECEIVE_ACTIVE_TILES', {});
      this.isCompleted = false;
    });
  },
  methods: {
    activateTile(x, y) {
      this.$store.dispatch('gameTiles/SEND_MESSAGE', {
        messageType: 'activateTile',
        messageData: {
          x: x,
          y: y
        }
      });
    },
    isActive(x, y) {
      return this.activeTiles.hasOwnProperty(`${x},${y}`);
    },
    getClass(x, y) {
      let returnClass = 'tile';
      
      if (this.isCompleted) {
        returnClass = returnClass + ' completed';
      } else if (this.isActive(x, y)) {
        returnClass = returnClass + ' active';
      }

      return returnClass;
    },
    getStyle() {
      return 'width: ' + this.tileWidth + 'px; height: ' + this.tileHeight + 'px;';
    },
    gameBoardWidth() {
      return 'width: ' + this.tileWidth * this.gameCols + 'px;';
    },
    resetGame() {
      this.$store.dispatch('gameTiles/SEND_MESSAGE', {
        messageType: 'resetGame'
      });
    }
  },
  watch: {
    percentCompleted(newValue) {
      if (newValue === 100) {
        this.$store.dispatch('gameTiles/SEND_MESSAGE', {
          messageType: 'allTilesActive',
          messageData: this.gameRows * this.gameCols
        });
      }
    }
  }
}
</script>

<style scoped>
.game-board {
  display: flex;
  background-color: lightgrey;
  border-radius: 0 !important;
  padding: 0 !important;
}

.overlay {
  position: absolute;
  top: calc(50% - 24px);
  text-align: center;
  font-size: 48px;
  color: white;
}

.tile.active {
  background-color: blue;
}

.tile.completed {
  background-color: green;
}
</style>
