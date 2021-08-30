import { gsap } from 'gsap'
import PlaneSlider from './PlaneSlider'

export default class Slider {
  constructor(textures, sizes, renderer, scene, camera, from) {
    this.texturesSlider = textures
    this.sizesCanvas = sizes
    this.renderer = renderer
    this.scene = scene
    this.camera = camera
    this.previousPage = from ? from.name : ''
    this.planesSlider = []

    this.sliderShown = false
    this.indexSliderShown = 0

    this.createPlanes()
    this.listenersSlider()
  }

  createPlanes() {
    this.planesSlider = []
    console.log(this.texturesSlider.length)
    this.texturesSlider.forEach((texture, i) => {
      const planeSlider = new PlaneSlider(
        texture,
        i,
        this.sizesCanvas,
        this.renderer,
        this.scene,
        this.camera,
        this.previousPage
      )
      this.planesSlider.push(planeSlider)
      console.log('create plane slider', this.planesSlider)
    })
  }

  listenersSlider() {
    const vignettes = document.querySelectorAll('.project .image__container')

    const closeBtn = document.getElementById('slider-close')
    const nextBtn = document.getElementById('slider-right')
    const prevBtn = document.getElementById('slider-left')

    vignettes.forEach((vignette, i) => {
      vignette.addEventListener('click', () => {
        console.log(this.indexSliderShown)
        this.showControls()
        this.hideProjectPage()
        this.planesSlider[i].show()
        this.indexSliderShown = i
      })
    })

    nextBtn.addEventListener('click', () => {
      console.log(this.indexSliderShown)
      if (this.planesSlider[this.indexSliderShown + 1]) {
        this.planesSlider[this.indexSliderShown].hide()
        this.planesSlider[this.indexSliderShown + 1].show()
        this.indexSliderShown++
        if (!this.planesSlider[this.indexSliderShown + 1]) {
          nextBtn.style.opacity = 0.5
        }
      }
    })

    prevBtn.addEventListener('click', () => {
      console.log(this.indexSliderShown)
      if (this.planesSlider[this.indexSliderShown - 1]) {
        this.planesSlider[this.indexSliderShown].hide()
        this.planesSlider[this.indexSliderShown - 1].show()
        this.indexSliderShown--
        if (!this.planesSlider[this.indexSliderShown - 1]) {
          prevBtn.style.opacity = 0.5
        }
      }
    })

    closeBtn.addEventListener('click', () => {
      console.log(this.indexSliderShown)
      this.planesSlider[this.indexSliderShown].hide()
      this.hideControls()
      this.showProjectPage()
    })
  }

  showControls() {
    const tl = gsap.timeline()

    tl.to(
      '.slider__controls',
      {
        autoAlpha: 1,
        duration: 1,
      },
      0.5
    )

    tl.to('.slider__controls button', {
      pointerEvents: 'auto',
    })
  }

  hideControls() {
    const tl = gsap.timeline()

    tl.to('.slider__controls', {
      autoAlpha: 0,
      duration: 0.4,
    })

    tl.to('.slider__controls button', {
      pointerEvents: 'none',
    })
  }

  hideProjectPage() {
    gsap.to('.project__wrapper', {
      autoAlpha: 0,
      duration: 0.4,
      pointerEvents: 'none',
    })
  }

  showProjectPage() {
    gsap.to('.project__wrapper', {
      autoAlpha: 1,
      duration: 0.4,
      pointerEvents: 'auto',
    })
  }

  destroy() {
    this.planesSlider.forEach((plane) => {
      this.scene.remove(plane.mesh)
    })
  }

  resize() {}

  update(scroll, time) {
    this.planesSlider.forEach((plane) => {
      plane.render(scroll, time)
    })
  }
}
