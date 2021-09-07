import PlaneSliderProject from './PlaneSliderProject'

export default class SliderProject {
  constructor(textures, sizes, renderer, scene, camera) {
    this.texturesSlider = textures
    this.sizesCanvas = sizes
    this.renderer = renderer
    this.scene = scene
    this.camera = camera

    this.planesCreated = 0
    this.planesSlider = []
    this.planesSliderDisplaid = []

    this.sliderShown = false
    this.indexSliderShown = 0

    this.isCreated = false
  }

  createPlanes() {
    this.planesSlider = []

    this.texturesSlider.forEach((texture, i) => {
      const planeSlider = new PlaneSliderProject(
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

  display(slug) {
    this.planesSlider
      .filter((el) => el.mesh.name.includes(slug))
      .forEach((plane) => {
        this.planesSliderDisplaid.push(plane)
        plane.display = true
        plane.computeBounds()
        plane.onMouseEnter()
      })

    this.listenersSlider()
  }

  listenersSlider() {
    const vignettes = document.querySelectorAll('.project .image__container')

    this.animateIn()

    vignettes.forEach((vignette, i) => {
      vignette.addEventListener('mouseenter', () => {
        this.planesSliderDisplaid[this.indexSliderShown].hide()
        this.planesSliderDisplaid[i].show()
        this.indexSliderShown = i
      })
    })
  }

  animateIn() {
    // Display last image
    this.planesSliderDisplaid[2].show()
    this.indexSliderShown = 2
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
