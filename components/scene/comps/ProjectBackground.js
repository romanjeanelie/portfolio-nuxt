import * as THREE from 'three'

import vertex from '../shaders/projectBackground-vertex.glsl'
import fragment from '../shaders/projectBackground-fragment.glsl'

export default class Background {
  constructor(scene, sizes) {
    this.scene = scene
    this.sizesCanvas = sizes

    this.isCreated = false

    this.mouse = new THREE.Vector2()

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
        },
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
      })
    )
    this.mesh.position.z = -1

    this.mesh.name = 'project-background'

    this.updateScale()

    this.scene.add(this.mesh)

    this.isCreated = true
  }

  updateScale() {
    this.mesh.scale.x = this.sizesCanvas.w * 1.1
    this.mesh.scale.y = this.sizesCanvas.h * 1.2
  }

  onMouseMove(mouse) {
    const mouseComputed = new THREE.Vector2()
    mouseComputed.x = 1 + (mouse.x - 0.5)
    mouseComputed.y = 1 + (mouse.y - 0.5)
    this.mesh.material.uniforms.hover.value = mouseComputed
  }

  resize(sizes) {
    this.sizesCanvas.w = sizes.w
    this.sizesCanvas.h = sizes.h

    this.updateScale()
  }
}
