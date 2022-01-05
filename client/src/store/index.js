import { createStore } from 'vuex'

export default createStore({
  state: () => ({
    name: 'Anonymous',
    messages: []
  }),
  mutations: {
    setName(state, name) {
      state.name = name;
    },
    setMessages(state, messages) {
      state.messages = messages;
    },
  },
  actions: {
    createMessage: ({ commit }, message) => {
    },
  },
  modules: {
  }
})