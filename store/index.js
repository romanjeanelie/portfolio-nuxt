import { groq } from '@nuxtjs/sanity'
import getAsyncData from '~/assets/js/utils/datas/getAsyncData'

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
})

export const mutations = {
  SET(state, obj) {
    state[obj.property] = obj.value
  },
}

export const actions = {
  nuxtServerInit({ context, commit }) {
    queryProjects(commit)
    queryAbout(commit)
  },
}

export const getters = {
  isTouch() {
    try {
      document.createEvent('TouchEvent')
      return true
    } catch (e) {
      return false
    }
  },
}
