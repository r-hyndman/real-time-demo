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
    ADD_TO_COLLECTION(state, chatMessage) {
      Vue.set(state.collection, chatMessage.id, chatMessage);
    }
  },
  actions: {
    SEND_MESSAGE({}, params) {
      socketio.sendMessage(params);
    },
    RECEIVE_CHAT_MESSAGE({ commit }, chatMessage) {
      commit('ADD_TO_COLLECTION', chatMessage);
    },
    RECEIVE_CHAT_HISTORY({ commit }, chatHistory) {
      commit('SET_COLLECTION', chatHistory);
    }
  }
};
