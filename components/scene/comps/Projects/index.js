import PlaneProject from './PlaneProject'

import emitter from '~/assets/js/events/EventsEmitter'

export default class Projects {
  constructor(textures, sizes, renderer, scene, camera, from) {
    this.textureProjectArray = textures
    this.sizesCanvas = sizes
    this.renderer = renderer
    this.scene = scene
    this.camera = camera
    this.previousPage = from ? from.name : ''

    this.planesCreated = 0
    this.planesProject = []
    this.planesProjectDisplaid = []

    this.isCreated = false
    this.isDisplaid = false
  }

  createPlanes() {
    this.planesProject = []
    this.textureProjectArray.forEach((texture, i) => {
      const planeProject = new PlaneProject(
        texture,
        i,
        this.sizesCanvas,
        this.renderer,
        this.scene,
        this.camera,
        this.previousPage
      )
      this.planesProject.push(planeProject)
      this.planesCreated++
      if (this.planesCreated / this.textureProjectArray.length === 1) {
        this.isCreated = true
      }
    })
  }

  display(slug, from) {
    this.isDisplaid = true

    this.planesProject.forEach((plane) => {
      plane.display = true
      plane.computeBounds()
      plane.onMouseEnter()
    })
    this.listenersAnimation(from)
  }

  listenersAnimation(from) {
    emitter.on('PROJECT:DISPLAY', (index) => {
      this.animateIn(index, from)
    })
    emitter.on('PROJECT:DISPLAY-MOBILE', (index) => {
      this.animateInMobile(index, from)
    })
    emitter.on('PROJECT:HIDE-MOBILE', (index) => {
      this.animateOutMobile(index, from)
    })
    emitter.on('PROJECT:RESET', (index) => {
      this.reset(index, from)
    })
  }

  animateIn(index, from) {
    if (from && from.name === 'projects-slug' && index === 0) {
      this.planesProject[index].mesh.material.uniforms.openHole.value = 1
      this.planesProject[index].mesh.material.uniforms.centerHole.value = 1
      this.planesProject[index].mesh.material.uniforms.opacity.value = 1
      this.planesProject[index].animateInHole()
    } else {
      this.planesProject[index].animateIn()
    }
  }

  animateInMobile(index, from) {
    this.planesProject[index].animateInMobile()
  }

  animateOutMobile(index) {
    this.planesProject[index].animateOutMobile()
  }

  animateOutAll() {
    this.planesProject.forEach((plane) => {
      plane.animateOut()
    })
  }

  animateInHole() {
    this.planesProject.forEach((plane) => {
      plane.animateInHole()
    })
  }

  animateOutHole() {
    this.planesProject.forEach((plane) => {
      plane.animateOutHole()
    })
  }

  reset(index, from) {
    // Disable reset for first plane when come from project slug page
    if (from && from.name === 'projects-slug' && index === 0) return
    this.planesProject[index].reset()
  }

  destroy() {
    this.planesProject.forEach((plane) => {
      plane.reset()
      plane.display = false
    })
  }

  resize(sizes) {
    this.planesProject.forEach((plane) => {
      plane.resize(sizes)
    })
  }

  update(scroll, time) {
    this.planesProject.forEach((plane) => {
      plane.render(scroll, time)
    })
  }
}
