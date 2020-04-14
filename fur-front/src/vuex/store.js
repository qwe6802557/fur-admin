import Vuex from 'vuex';
import Vue from 'vue';
import state from '@/vuex/state';
import mutations from "@/vuex/mutations";

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  mutations
})
