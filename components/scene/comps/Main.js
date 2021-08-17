/* eslint-disable */
import MouseHelper from '~/assets/js/utils/MouseHelper.js'

import * as THREE from 'three'

import vertex from '../shaders/background-vertex.glsl'
import fragment from '../shaders/background-fragment.glsl'
import Plane from './Plane'

export default class Main {
  constructor(el) {
    this.w = el.offsetWidth
    this.h = el.offsetHeight
    this.time = 0
    this.scrollTop = 0
    this.cameraZ = 300
    this.cameraX = 0
    this.cameraY = 0
    this.rotateX = 0
    this.rotateY = 0
    this.planes = []

    this.mouse = {
      x: 0,
      y: 0,
    }

    this.init(el)
    this.createBackground()
    // this.addClippingMask()
  }

  init(el) {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      el.offsetWidth / el.offsetHeight,
      0.1,
      700
    )
    this.camera.position.z = this.cameraZ

    this.fov =
      2 *
      Math.atan(el.offsetHeight / 2 / this.camera.position.z) *
      (180 / Math.PI)

    this.camera.fov = this.fov

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.clippingPlanes = Object.freeze([]) // GUI sets it to globalPlanes
    this.renderer.localClippingEnabled = true

    el.appendChild(this.renderer.domElement)

    this.loadProjectCards()
    // this.addClippingMask()
  }

  loadProjectCards() {
    this.projectCards = document.querySelectorAll('.project-component .plane')
    if (this.projectCards.length === 3) {
      this.onLoaded()
    }
  }

  onLoaded() {
    this.projectCards.forEach((card, i) => {
      const plane = new Plane(card, i, this.renderer, this.scene, this.camera)
      this.planes.push(plane)
    })
    // const plane = new Plane(this.projectCards, this.renderer, this.scene)

    this.resize()
  }

  tick(scrollTop) {
    this.time += 0.016
    this.mouse.x = MouseHelper.easeX
    this.mouse.y = MouseHelper.easeY

    if (!this.background.material.uniforms.uTime) return
    this.background.material.uniforms.uTime.value = this.time

    this.planes.forEach((plane, i) => {
      const scroll = scrollTop
      plane.render(scroll, this.time, this.mouse)
    })

    this.renderer.render(this.scene, this.camera)
  }

  resize(w, h, pageHeight) {
    if (w && h) {
      this.w = w
      this.h = h
      this.pageHeight = pageHeight - h
    }

    this.camera.aspect = this.w / this.h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.w, this.h)

    this.fov =
      2 * Math.atan(this.h / 2 / this.camera.position.z) * (180 / Math.PI)
    this.camera.fov = this.fov
  }

  createBackground() {
    this.background = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1, 1, 1),
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: this.time },
          mainColor: { value: new THREE.Color('#EFEFEF') },
          pointColor: { value: new THREE.Color('#C4C4C4') },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
      })
    )
    this.background.position.z = -0.5
    this.background.scale.set(this.w, this.h, 0)
    this.scene.add(this.background)
  }

  addClippingMask() {
    // src: https://threejs.org/examples/?q=clip#webgl_clipping
    const cutEdgeX = 10.2
    const localPlane1 = new THREE.Plane(new THREE.Vector3(cutEdgeX, 0, 0), 0.8)
    const localPlane2 = new THREE.Plane(new THREE.Vector3(-cutEdgeX, 0, 0), 0.8)
    const globalPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0.1)

    // Geometry

    const material = new THREE.MeshBasicMaterial({
      color: 0x80ee10,
      side: THREE.DoubleSide,

      // ***** Clipping setup (material): *****
      clippingPlanes: [localPlane1],
    })

    // const geometry = new THREE.TorusKnotGeometry(0.4, 0.08, 95, 20)
    const geometry = new THREE.TorusKnotGeometry(100.4, 100.08, 1095, 1020)

    this.torus = new THREE.Mesh(geometry, material)
    this.scene.add(this.torus)

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    )

    this.scene.add(ground)

    const globalPlanes = [globalPlane]
    const Empty = Object.freeze([])
    this.renderer.clippingPlanes = Empty // GUI sets it to globalPlanes
    this.renderer.localClippingEnabled = true
  }
}
