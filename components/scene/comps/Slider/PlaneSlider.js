import { gsap } from 'gsap'
import * as THREE from 'three'
import imageVertex from '../../shaders/slider-vertex.glsl'
import imageFragment from '../../shaders/slider-fragment.glsl'

export default class PlaneSlider {
  constructor(texture, i, sizes, renderer, scene, camera, from) {
    this.texture = Object.values(texture)[0]

    this.element = document.querySelector('.project .slider__image')
    this.index = i
    this.sizesCanvas = sizes
    this.renderer = renderer
    this.scene = scene
    this.camera = camera
    this.previousPage = from ? from.name : ''

    this.sliderIsShown = false

    this.createMesh(this.scene)

    this.onMouseEnter()
  }

  createMesh(scene) {
    const geometry = new THREE.PlaneBufferGeometry(1, 1, 50, 50)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uResolution: {
          value: new THREE.Vector2(this.sizesCanvas.w, this.sizesCanvas.h),
        },
        uTime: { value: 0 },
        hover: { value: new THREE.Vector2(-0.5, 0.5) },
        hoverState: { value: 0 },
        uReveal: { value: 0 },

        uImage: { value: this.texture },
        uImageSize: { value: new THREE.Vector2(100, 100) },
        uQuadSize: { value: new THREE.Vector2(300, 300) },
      },
      vertexShader: imageVertex,
      fragmentShader: imageFragment,
      transparent: true,
    })

    this.mesh = new THREE.Mesh(geometry, material)

    this.mesh.name = `image-slider-${this.index}`
    scene.add(this.mesh)

    this.computeBounds()
  }

  computeBounds() {
    this.bounds = this.element.getBoundingClientRect()
    this.imageWidth = this.texture.image.width
    this.imageHeight = this.texture.image.height
    this.ratioImage = this.imageWidth / this.imageHeight

    this.updateScale()
    this.updateX()

    this.updateY()
  }

  updateScale() {
    this.mesh.scale.y = Math.min(this.bounds.height, this.imageHeight)
    this.mesh.scale.x = this.mesh.scale.y * this.ratioImage

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

  resize(sizes) {
    this.sizesCanvas.w = sizes.w
    this.sizesCanvas.h = sizes.h

    this.computeBounds()
  }

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

  show() {
    const tl = gsap.timeline()

    tl.to(
      this.mesh.material.uniforms.uReveal,
      {
        value: 1,
        duration: 1.3,
        ease: 'power2.out',
      },
      '<'
    )
  }

  hide() {
    const tl = gsap.timeline()

    tl.to(
      this.mesh.material.uniforms.uReveal,
      {
        value: 0,
        duration: 1,
      },
      '<'
    )
  }

  render(scrollTop, time, mouse) {
    this.updateY(scrollTop)
    if (!this.mesh) return
    this.mesh.material.uniforms.uTime.value = time
  }
}
