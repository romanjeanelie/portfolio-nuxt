import * as THREE from 'three'
import { gsap } from 'gsap'

import vertexBackground from '../shaders/background-vertex.glsl'
import fragmentBackground from '../shaders/background-fragment.glsl'

export default class Background {
  constructor(scene, sizes) {
    this.scene = scene
    this.sizesCanvas = sizes

    this.isCreated = false

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
          mainColor: { value: new THREE.Color('#EFEFEF') },
          pointColor: { value: new THREE.Color('#C4C4C4') },

          hover: { value: new THREE.Vector2(-0.5, 0.5) },
          hoverState: { value: 0 },
          openHole: { value: 0.28 },
        },
        vertexShader: vertexBackground,
        fragmentShader: fragmentBackground,
        transparent: true,
      })
    )
    this.mesh.position.z = -0.5

    this.mesh.name = 'background'

    this.updateScale()

    this.scene.add(this.mesh)

    this.isCreated = true
  }

  updateScale() {
    this.mesh.scale.x = this.sizesCanvas.w * 1.1
    this.mesh.scale.y = this.sizesCanvas.h * 1.2
  }

  animateIn() {
    gsap.to(this.mesh.material.uniforms.openHole, {
      value: 0.5,
      duration: 4,
    })
  }

  animateOut() {
    gsap.to(this.mesh.material.uniforms.openHole, {
      value: -1,
      duration: 4,
      delay: 0.3,
    })
  }

  hide() {
    gsap.set(this.mesh.material.uniforms.openHole, {
      value: -1,
      duration: 4,
      // ease: 'power1.in',
    })
  }

  resize(sizes) {
    this.sizesCanvas.w = sizes.w
    this.sizesCanvas.h = sizes.h

    this.updateScale()
  }
}
