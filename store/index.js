/* eslint-disable */
import { groq } from '@nuxtjs/sanity'
import getAsyncData from '~/assets/js/utils/datas/getAsyncData'

if (process.browser) {
  var sniffer = require('sniffer')
}

const queryProjects = (commit) => {
  const query = groq`{ "projects": *[_type == 'projects']| order(order asc)}`
  return getAsyncData(query).then((data) => {
    commit('SET', { property: 'allProjects', value: data.projects })
  })
}

const queryAbout = (commit) => {
  const query = groq`{ "about": *[_type == 'about']}`
  return getAsyncData(query).then((data) => {
    commit('SET', { property: 'about', value: data.about })
  })
}

export const state = () => ({
  allWorks: [],
  isMobile: null,
})

export const mutations = {
  SET(state, obj) {
    state[obj.property] = obj.value
  },
  CHECK_MOBILE(state) {
    state.isMobile = sniffer && sniffer.isPhone ? true : false
    // state.isMobile = false
  },
}

export const actions = {
  nuxtServerInit({ context, commit }) {
    queryProjects(commit)
    queryAbout(commit)
  },
  checkMobile({ commit }) {
    commit('CHECK_MOBILE')
  },
}

export const getters = {
  isMobile: (state) => {
    return state.isMobile
  },
  isTouch() {
    try {
      document.createEvent('TouchEvent')
      return true
    } catch (e) {
      return false
    }
  },
}
