import { createStore } from 'vuex'

export default createStore({
  state: () => ({
    name: null,
    messages: []
  }),
  mutations: {
    setName(state, name) {
      state.name = name;
    },
    setMessages(state, messages) {
      state.messages = messages;
    },
    appendMessage(state, message) {
      state.messages = [...state.messages, message];
    },
    appendMessages(state, message) {
      state.messages = [...state.messages, ...message];
    },
  },
  actions: {
    loadMessages: async ({ commit }, message) => {
      const response = await fetch('http://localhost:3100/messages');
      let json = await response.json();
      json = json.reverse();
      commit('appendMessages', json);
    },
  },
  modules: {
  }
})
