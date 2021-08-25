import * as THREE from 'three'
import { gsap } from 'gsap'

import vertex from '../shaders/projectBackground-vertex.glsl'
import fragment from '../shaders/projectBackground-fragment.glsl'

export default class Background {
  constructor(scene, sizes) {
    this.scene = scene
    this.sizesCanvas = sizes

    this.createBackground()
  }

  createBackground() {
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1, 1, 1),
      new THREE.ShaderMaterial({
        uniforms: {
          resolution: {
            value: new THREE.Vector2(1, window.innerHeight / window.innerWidth),
          },
          uTime: { value: 0 },
          uColor1: { value: new THREE.Color('#363434') },
          uColor2: { value: new THREE.Color('#151414') },

          hover: { value: new THREE.Vector2(-0.5, 0.5) },
          hoverState: { value: 0 },
          wipeX: { value: 1.2 },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
      })
    )
    this.mesh.position.z = 1

    this.mesh.name = 'project-background'

    this.updateScale()

    this.scene.add(this.mesh)
  }

  animateIn() {
    gsap.to(this.mesh.material.uniforms.wipeX, {
      value: 0,
      duration: 1.5,
    })
  }

  animateOut() {
    gsap.to(this.mesh.material.uniforms.wipeX, {
      value: 1.2,
      duration: 2,
    })
  }

  updateScale() {
    this.mesh.scale.x = this.sizesCanvas.w * 1.1
    this.mesh.scale.y = this.sizesCanvas.h * 1.2
  }

  resize(sizes) {
    this.sizesCanvas.w = sizes.w
    this.sizesCanvas.h = sizes.h

    this.updateScale()
  }
}
