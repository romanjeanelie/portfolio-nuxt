import { gsap } from 'gsap'
import * as THREE from 'three'
import imageVertex from '../shaders/slider-vertex.glsl'
import imageFragment from '../shaders/slider-fragment.glsl'

export default class PlaneSlider {
  constructor(texture, i, sizes, renderer, scene, camera, from) {
    this.texture = Object.values(texture)[0]

    this.element = document.querySelectorAll('.project .image__container')[i]
    this.index = i
    this.sizesCanvas = sizes
    this.renderer = renderer
    this.scene = scene
    this.camera = camera
    this.previousPage = from ? from.name : ''

    this.sliderIsShown = false

    this.createMesh(this.scene)

    this.onMouseEnter()
    this.onClick()
    this.buttonsListener()
  }

  createMesh(scene) {
    const geometry = new THREE.PlaneBufferGeometry(1, 1, 50, 50)
    console.log(this.sizesCanvas.w)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uResolution: {
          value: new THREE.Vector2(this.sizesCanvas.w, this.sizesCanvas.h),
        },
        uTime: { value: 0 },

        uImage: { value: this.texture },
        uImageSize: { value: new THREE.Vector2(100, 100) },

        hover: { value: new THREE.Vector2(-0.5, 0.5) },
        hoverState: { value: 0 },

        uCorners: { value: new THREE.Vector4(0, 0, 0, 0) },
        uQuadSize: { value: new THREE.Vector2(300, 300) },
      },
      vertexShader: imageVertex,
      fragmentShader: imageFragment,
    })

    this.mesh = new THREE.Mesh(geometry, material)

    this.mesh.name = `image-slider-${this.index}`
    scene.add(this.mesh)

    this.computeBounds()
  }

  computeBounds() {
    this.bounds = this.element.getBoundingClientRect()

    this.updateScale()
    this.updateX()

    this.updateY()
  }

  updateScale() {
    this.height = this.bounds.height
    this.width = this.bounds.width

    this.mesh.scale.x = this.width
    this.mesh.scale.y = this.height

    this.mesh.material.uniforms.uQuadSize.value.x = this.bounds.width
    this.mesh.material.uniforms.uQuadSize.value.y = this.bounds.height

    this.mesh.material.uniforms.uImageSize.value.x = this.bounds.width
    this.mesh.material.uniforms.uImageSize.value.y = this.bounds.height
  }

  updateX() {
    this.x = this.bounds.left
    this.mesh.position.x =
      this.x - this.sizesCanvas.w / 2 + this.bounds.width / 2
  }

  updateY(scroll) {
    this.y = this.bounds.top
    this.mesh.position.y =
      scroll - this.y + this.sizesCanvas.h / 2 - this.bounds.height / 2
  }

  animateIn() {}

  reset() {}

  onMouseEnter() {
    gsap.killTweensOf(this.mesh.material.uniforms.hoverState)
    this.element.addEventListener('mouseenter', () => {
      gsap.to(this.mesh.material.uniforms.hoverState, {
        duration: 1,
        value: 1,
      })
    })
    this.element.addEventListener('mouseleave', (e) => {
      gsap.to(this.mesh.material.uniforms.hoverState, { duration: 1, value: 0 })
    })
  }

  resize(sizes) {
    this.sizesCanvas.w = sizes.w
    this.sizesCanvas.h = sizes.h

    this.computeBounds()
  }

  onClick() {
    this.element.addEventListener('click', () => {
      if (!this.sliderIsShown) {
        this.showSlider()
      } else {
        this.hideSlider()
      }
    })
  }

  showSlider() {
    const tl = gsap.timeline()
    console.log('click', this.mesh.scale)
    console.log('click', this.mesh.position)

    tl.to('.project__wrapper', {
      autoAlpha: 0,
      duration: 0.4,
      pointerEvents: 'none',
    })
    tl.to(
      this.mesh.material.uniforms.uCorners.value,
      {
        x: 1,
        duration: 0.4,
      },
      0.3
    )

    tl.to(
      this.mesh.material.uniforms.uCorners.value,
      {
        y: 1,
        duration: 0.4,
      },
      0.1
    )

    tl.to(
      this.mesh.material.uniforms.uCorners.value,
      {
        z: 1,
        duration: 0.4,
      },
      0.2
    )

    tl.to(
      this.mesh.material.uniforms.uCorners.value,
      {
        w: 1,
        duration: 0.4,
      },
      0.3
    )

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
    this.sliderShown = true
  }

  hideSlider() {
    const tl = gsap.timeline()
    console.log('click', this.mesh.scale)
    console.log('click', this.mesh.position)

    tl.to('.slider__controls', {
      autoAlpha: 0,
      duration: 0.4,
    })
    tl.to(
      this.mesh.material.uniforms.uCorners.value,
      {
        x: 0,
        duration: 0.4,
      },
      0.3
    )

    tl.to(
      this.mesh.material.uniforms.uCorners.value,
      {
        y: 0,
        duration: 0.4,
      },
      0.1
    )

    tl.to(
      this.mesh.material.uniforms.uCorners.value,
      {
        z: 0,
        duration: 0.4,
      },
      0.2
    )

    tl.to(
      this.mesh.material.uniforms.uCorners.value,
      {
        w: 0,
        duration: 0.4,
      },
      0.3
    )

    tl.to(
      '.project__wrapper',
      {
        autoAlpha: 1,
        duration: 1,
      },
      0.5
    )

    tl.to('.project__wrapper', {
      pointerEvents: 'auto',
    })

    this.sliderShown = false
  }

  buttonsListener() {
    const closeBtn = document.getElementById('slider-close')
    // const leftBtn = document.getElementById('slider-left')
    // const rightBtn = document.getElementById('slider-right')

    closeBtn.addEventListener('click', () => {
      this.hideSlider()
    })
  }

  render(scrollTop, time, mouse) {
    this.updateY(scrollTop)
    if (!this.mesh) return
    this.mesh.material.uniforms.uTime.value = time
  }
}
