import * as THREE from 'three'
import { gsap } from 'gsap'

import vertexBackground from '../shaders/background-vertex.glsl'
import fragmentBackground from '../shaders/background-fragment.glsl'

export default class Background {
  constructor(scene, sizes, routeName) {
    this.scene = scene
    this.sizesCanvas = sizes
    this.routeName = routeName

    this.isCreated = false

    this.startMouse = new THREE.Vector2(0.5)
    this.endMouse = new THREE.Vector2()
    this.deltaMouse = 0

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
          hoverStart: { value: this.startMouse },
          hoverDelta: { value: 0 },
          hoverState: { value: 1 },
          openHole: { value: this.routeName === 'projects-slug' ? -1 : 0.28 },
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

    this.onMouseMove()
  }

  lerp(position, targetPosition, amt) {
    // update position by 20% of the distance between position and target position
    position.x += (targetPosition.x - position.x) * amt
    position.y += (targetPosition.y - position.y) * amt
    return position
  }

  onMouseMove(coords) {
    if (coords) {
      this.endMouse = coords

      // gsap.to(this.startMouse, {
      //   x: this.endMouse.x,
      //   y: this.endMouse.y,
      //   duration: 1,
      // })
      this.mesh.material.uniforms.hover.value = coords
    }
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

  update() {
    this.startMouse = this.lerp(this.startMouse, this.endMouse, 0.04)

    this.delta = this.endMouse.distanceTo(this.startMouse)
    this.mesh.material.uniforms.hoverDelta.value = this.delta
    this.mesh.material.uniforms.uTime.value = this.time
  }
}
