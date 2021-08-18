import { gsap } from 'gsap'
import * as THREE from 'three'
import cardVertex from '../shaders/card-vertex.glsl'
import cardFragment from '../shaders/card-fragment.glsl'

export default class Plane {
  constructor(texture, i, sizes, renderer, scene, camera) {
    this.texture = texture

    this.element = document.querySelectorAll('.project-component .plane')[i]
    this.index = i
    this.sizesCanvas = sizes
    this.renderer = renderer
    this.scene = scene
    this.camera = camera

    // this.reset()
    this.createMesh(this.scene)
    this.computeBounds()

    this.onMouseEnter()
  }

  createMesh(scene) {
    const geometry = new THREE.PlaneBufferGeometry(1, 1, 50, 50)

    const material = new THREE.ShaderMaterial({
      uniforms: {
        resolution: {
          value: new THREE.Vector2(1, this.sizesCanvas.h / this.sizesCanvas.w),
        },
        uTime: { value: 0 },

        bgColor1: { value: new THREE.Color('#383838') },
        bgColor2: { value: new THREE.Color('#4D4D4D') },
        fgColor1: { value: new THREE.Color('#ECECEC') },
        uImage: { value: this.texture },

        hover: { value: new THREE.Vector2(-0.5, 0.5) },
        hoverState: { value: 0 },
      },
      vertexShader: cardVertex,
      fragmentShader: cardFragment,
    })

    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.name = `project-card-${this.index}`

    scene.add(this.mesh)
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

  onMouseEnter() {
    this.element.addEventListener('mouseenter', (e) => {
      gsap.to(this.mesh.material.uniforms.hoverState, { duration: 1, value: 1 })
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

  reset() {
    this.positionZ = 0
    this.positionX = 0
    this.positionY = 0
  }

  render(scrollTop, time, mouse) {
    this.updateY(scrollTop)
    if (!this.mesh) return
    // this.mesh.rotation.x += time * 0.001
    // this.mesh.rotation.y += time * 0.001
    this.mesh.material.uniforms.uTime.value = time
  }
}
