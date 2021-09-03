import { gsap } from 'gsap'
import * as THREE from 'three'
import cardVertex from '../../shaders/card-vertex.glsl'
import cardFragment from '../../shaders/card-fragment.glsl'

export default class PlaneProject {
  constructor(texture, i, sizes, renderer, scene, camera) {
    this.texture = texture

    this.index = i
    this.sizesCanvas = sizes
    this.renderer = renderer
    this.scene = scene
    this.camera = camera

    this.scrollTop = 0

    this.isResizing = false

    this.createMesh(this.scene)
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
        uReveal: { value: 0 },
        openHole: { value: 0 },
        centerHole: { value: 0 },
        opacity: { value: 0 },
      },
      vertexShader: cardVertex,
      fragmentShader: cardFragment,
      transparent: true,
    })

    this.mesh = new THREE.Mesh(geometry, material)

    this.mesh.name = `project-card-${this.index}`

    scene.add(this.mesh)
  }

  computeBounds() {
    this.element = document.querySelectorAll('.project-component .plane')[
      this.index
    ]

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

  updateY() {
    this.y = this.bounds.top
    this.mesh.position.y =
      this.scrollTop - this.y + this.sizesCanvas.h / 2 - this.bounds.height / 2
  }

  animateIn() {
    gsap.set(this.mesh.material.uniforms.opacity, {
      value: 1,
    })
    gsap.to(this.mesh.material.uniforms.uReveal, {
      duration: 4,
      value: 1.2,
    })
  }

  animateOut() {
    gsap.to(this.mesh.material.uniforms.uReveal, {
      duration: 1,
      value: 0,
    })
  }

  animateInHole() {
    gsap.to(this.mesh.material.uniforms.openHole, {
      value: 0,
      delay: 1,
      duration: 2,
    })
    gsap.to(this.mesh.material.uniforms.centerHole, {
      value: 0,
      delay: 1,
      duration: 2,
    })
    gsap.to(this.mesh.material.uniforms.uReveal, {
      value: 1.2,
      delay: 1,
      duration: 2,
    })
  }

  animateOutHole() {
    gsap.to(this.mesh.material.uniforms.openHole, {
      value: 1,
      duration: 2,
    })
  }

  reset() {
    gsap.killTweensOf(this.mesh.material.uniforms.uReveal)

    gsap.set(this.mesh.material.uniforms.openHole, {
      value: 0,
    })

    gsap.set(this.mesh.material.uniforms.uReveal, {
      value: 0,
      duration: 1,
    })
    gsap.set(this.mesh.material.uniforms.opacity, {
      value: 0,
      duration: 1,
    })
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

  resize(sizes) {
    if (!this.display) return
    console.log('resize')
    this.isResizing = true
    this.sizesCanvas.w = sizes.w
    this.sizesCanvas.h = sizes.h

    setTimeout(() => {
      this.computeBounds()
      this.isResizing = false
    }, 100)
  }

  render(scrollTop, time) {
    if (!this.display) return
    this.scrollTop = scrollTop
    if (!this.mesh) return
    this.mesh.material.uniforms.uTime.value = time
    if (this.isResizing) return
    this.updateY()
  }
}
