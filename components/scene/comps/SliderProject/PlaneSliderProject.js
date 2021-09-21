import { gsap } from 'gsap'
import * as THREE from 'three'
import imageVertex from '../../shaders/slider-vertex.glsl'
import imageFragment from '../../shaders/slider-fragment.glsl'

export default class PlaneSliderProject {
  constructor(texture, i, sizes, renderer, scene, camera) {
    this.texture = Object.values(texture)[0]
    this.slug = Object.keys(texture)[0]

    this.index = i
    this.sizesCanvas = sizes
    this.renderer = renderer
    this.scene = scene
    this.camera = camera

    this.display = false
    this.sliderIsShown = false

    this.createMesh(this.scene)
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

    this.mesh.position.z = -1

    this.mesh.name = `image-slider-${this.slug}-${this.index}`
    scene.add(this.mesh)
  }

  computeBounds() {
    this.element = document.querySelector('.project .project__right figure')

    this.bounds = this.element.getBoundingClientRect()
    this.imageWidth = this.texture.image.width
    this.imageHeight = this.texture.image.height
    this.ratioImage = this.imageWidth / this.imageHeight

    this.updateScale()
    this.updateX()

    this.updateY()
  }

  updateScale() {
    // this.mesh.scale.y = Math.min(this.bounds.height, this.imageHeight)
    // this.mesh.scale.x = this.mesh.scale.y * this.ratioImage
    this.mesh.scale.y = this.bounds.height
    this.mesh.scale.x = this.bounds.width

    this.mesh.material.uniforms.uQuadSize.value.x = this.bounds.width
    this.mesh.material.uniforms.uQuadSize.value.y = this.bounds.height

    this.mesh.material.uniforms.uImageSize.value.x = this.imageWidth
    this.mesh.material.uniforms.uImageSize.value.y = this.imageHeight
  }

  updateX() {
    this.x = this.bounds.left
    this.mesh.position.x =
      this.x - this.sizesCanvas.w / 2 + this.bounds.width / 2
  }

  updateY() {
    this.y = this.bounds.top
    this.mesh.position.y =
      0 - this.y + this.sizesCanvas.h / 2 - this.bounds.height / 2
  }

  animateIn() {}

  reset() {}

  resize(sizes) {
    if (!this.display) return

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
        duration: 1.5,
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
        duration: 2,
        ease: 'expo.out',
      },
      '<'
    )
  }

  render(scrollTop, time, mouse) {
    if (!this.display) return
    if (!this.mesh) return
    this.mesh.material.uniforms.uTime.value = time
  }
}
