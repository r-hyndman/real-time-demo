import Vue from 'vue';
import Vuex from 'vuex';
import chatMessages from './chatMessages';
import gameTiles from './gameTiles';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: false,
  state: {
    error: undefined
  },
  mutations: {},
  getters: {},
  actions: {},
  modules: {
    chatMessages,
    gameTiles
  }
});
