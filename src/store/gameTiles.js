import Vue from 'vue';
import * as socketio from '../plugins/socketio';

export default {
  strict: false,
  namespaced: true,
  state: () => ({
    collection: {}
  }),
  getters: {
    GET_COLLECTION: state => {
      return state.collection;
    }
  },
  mutations: {
    SET_COLLECTION(state, collection) {
      state.collection = collection;
    },
    ADD_TO_COLLECTION(state, tile) {
      Vue.set(state.collection, tile.id, tile);
    },
    REMOVE_FROM_COLLECTION(state, tileID) {
      Vue.delete(state.collection, tileID);
    }
  },
  actions: {
    SEND_MESSAGE({}, params) {
      socketio.sendMessage(params);
    },
    ACTIVATE_TILE({ commit }, tile) {
      commit('ADD_TO_COLLECTION', tile);
    },
    RECEIVE_ACTIVE_TILES({ commit }, tiles) {
      commit('SET_COLLECTION', tiles);
    },
    DEACTIVATE_TILE({ commit }, tileID) {
      commit('REMOVE_FROM_COLLECTION', tileID);
    }
  }
};
