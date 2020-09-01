import Vue from 'vue'
import Vuex from 'vuex'
import { createPersistedState } from "vuex-electron"
import axios from '../helpers/axios';
import keyBy from "lodash/keyBy";
import router from '../router';
import Fs from 'fs'
import Path from 'path'
import { getSongsFolderPath } from '@/helpers/paths';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    auth: {
      user: null,
      billing: {},
      lastCheck: null,
    },
    songs: {},
    artists: {},
    genres: {},

    downloads: {},
    views: {},

    online: false,

    modal: {
      open: false,
      icon: 'warning',
      color: 'red',
      title: 'jKaraoke',
      message: '',
      action: {
        label: 'Hey!',
      }
    },
  },
  mutations: {
    SET_USER(state, user) {
      state.auth.user = user
    },
    SET_BILLING(state, billing) {
      state.auth.billing = billing
    },
    SET_SONGS(state, songs) {
      state.songs = songs
    },
    SET_ARTISTS(state, artists) {
      state.artists = artists
    },
    SET_GENRES(state, genres) {
      state.genres = genres
    },
    ADD_VIEW(state, song) {
      if (!state.views[song.id]) {
        state.views[song.id] = 0
      }
      state.views[song.id]++
    },
    ADD_DOWNLOAD(state, song) {
      state.downloads = {
        ...state.downloads,
        [song.id]: true
      }
    },
    REMOVE_DOWNLOAD(state, song) {
      Vue.delete(state.downloads, song.id)
    },
    GO_ONLINE(state) {
      state.online = true
    },
    GO_OFFLINE(state) {
      state.online = false
    },
    SET_LAST_CHECK(state, date) {
      state.auth.lastCheck = String(date)
    }
  },
  getters: {
    needsBillingCheck: state => {
      const diffTime = Math.abs(new Date(state.auth.lastCheck) - new Date());
      const daysAgo = diffTime / (1000 * 60 * 60 * 24);
      // const secondsAgo = diffTime / 1000;
      // return secondsAgo > 5
      return daysAgo > 30
    }
  },
  actions: {
    async getUserData({ commit, getters }) {
      try {
        const res = await axios.get("/auth/billing");
        commit("SET_USER", res.data.user);

        delete res.data.user
        commit("SET_BILLING", res.data);
        commit("SET_LAST_CHECK", new Date());
      } catch (error) { // offline
        if (getters.needsBillingCheck) {
          router.push({ name: "Verify" });
        }
      }
    },
    async updateLocalData(context) {
      const songs = await axios.get("/songs");
      const artists = await axios.get("/artists");
      const genres = await axios.get("/genres");

      context.commit("SET_SONGS", keyBy(songs.data, "id"));
      context.commit("SET_ARTISTS", keyBy(artists.data, "id"));
      context.commit("SET_GENRES", keyBy(genres.data, "id"));
    },
    removeDownload({ commit }, song) {
      Fs.unlink(
        Path.resolve(getSongsFolderPath(), String(song.id)),
        () => {
          commit("REMOVE_DOWNLOAD", song);
        }
      );
    },
    async logout({ commit, dispatch, state }) {
      await axios.post("/auth/logout");
      commit("SET_USER", null);
      commit("SET_BILLING", null);
      localStorage.setItem("token", '');
      // remove all downloaded songs
      Object.keys(state.downloads).forEach(songId => {
        dispatch('removeDownload', state.songs[songId])
      })
      router.push({ name: "Login" });
    },
    goOnline({ state, commit }) {
      commit('GO_ONLINE')
      // sync views to server
      const views = Object.keys(state.views)
      views.forEach(songId => {
        axios.post('views', {
          user_id: state.auth.user.id,
          song_id: songId,
          count: Number(state.views[songId])
        }).then(res => {
          console.log(res.data.msg);
        })
      })
      // reset local views
      state.views = {}
    }
  },
  modules: {
  },
  plugins: [
    createPersistedState(),
  ],
})
