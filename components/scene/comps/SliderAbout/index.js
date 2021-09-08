import PlaneSliderAbout from './PlaneSliderAbout'
import emitter from '~/assets/js/events/EventsEmitter'

export default class SliderAbout {
  constructor(textures, sizes, renderer, scene, camera) {
    this.texturesSlider = textures
    this.sizesCanvas = sizes
    this.renderer = renderer
    this.scene = scene
    this.camera = camera

    this.planesCreated = 0
    this.planesSlider = []
    this.planesSliderDisplaid = []

    // this.sliderShown = false
    // this.indexSliderShown = 0

    this.isCreated = false
  }

  createPlanes() {
    this.planesSlider = []

    this.texturesSlider.forEach((texture, i) => {
      const planeSlider = new PlaneSliderAbout(
        texture,
        i,
        this.sizesCanvas,
        this.renderer,
        this.scene,
        this.camera,
        this.previousPage
      )
      this.planesSlider.push(planeSlider)
      this.planesCreated++
      if (this.planesCreated / this.texturesSlider.length === 1) {
        this.isCreated = true
      }
    })
  }

  listenersHover() {}

  display() {
    this.planesSlider.forEach((plane) => {
      this.planesSliderDisplaid.push(plane)
      plane.display = true
      plane.computeBounds()
      plane.onMouseEnter()
    })

    this.listenersEvent()
  }

  listenersEvent() {
    // this.hoverLinks()

    emitter.on('SLIDER:SHOW', (category) => {
      this.show(category)
    })
    emitter.on('SLIDER:HIDE', () => {
      this.hide()
    })
    this.hoverControls()
  }

  hoverLinks() {
    const spectaclesLink = document.querySelectorAll(
      '.about__presentation .strong'
    )[0]
    const filmsLink = document.querySelectorAll(
      '.about__presentation .strong'
    )[1]

    spectaclesLink.addEventListener('mouseenter', () => {
      this.show('imagesSpectacles')
    })
    filmsLink.addEventListener('mouseenter', () => {
      this.show('imagesFilms')
    })
  }

  show(category) {
    // Hide previous category
    if (this.planesCategory) {
      this.hide()
    }

    // Change category
    this.planesCategory = this.planesSliderDisplaid.filter((el) =>
      el.mesh.name.includes(category)
    )

    // Display first image of the category
    this.planesCategory[0].show()
    this.indexSliderShown = 0
  }

  hide() {
    this.planesCategory.forEach((plane) => {
      plane.hide()
    })
  }

  hoverControls() {
    emitter.on('PREV:SLIDE', () => {
      if (this.indexSliderShown < 1) return
      this.planesCategory[this.indexSliderShown].hide()
      this.indexSliderShown--
      this.planesCategory[this.indexSliderShown].show()
    })

    emitter.on('NEXT:SLIDE', () => {
      if (this.indexSliderShown > this.planesCategory.length - 2) return
      this.planesCategory[this.indexSliderShown].hide()
      this.indexSliderShown++
      this.planesCategory[this.indexSliderShown].show()
    })
  }

  animateOut() {
    this.planesSliderDisplaid[this.indexSliderShown].hide()
  }

  destroy() {
    this.planesSliderDisplaid = []

    this.planesSlider.forEach((plane) => {
      plane.display = false
      plane.hide()
    })
  }

  resize() {}

  update(scroll, time) {
    this.planesSlider.forEach((plane) => {
      plane.render(scroll, time)
    })
  }
}
