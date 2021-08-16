/* eslint-disable */

import * as THREE from 'three'

import vertex from '../shaders/background-vertex.glsl'
import fragment from '../shaders/background-fragment.glsl'

export default class Main {
  constructor(el) {
    this.time = 0
    this.scrollTop = 0
    this.cameraZ = 2
    this.cameraX = 0
    this.cameraY = 0
    this.rotateX = 0
    this.rotateY = 0
    this.planes = []
    this.textureArray = []

    this.init(el)
  }

  init(el) {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    )
    this.camera.position.z = this.cameraZ

    this.fov = this.camera.fov * (Math.PI / 180)
    this.heightCanvas = 2 * Math.tan(this.fov / 2) * this.camera.position.z
    this.widthCanvas = this.heightCanvas * this.camera.aspect

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    el.appendChild(this.renderer.domElement)
  }

  tick(scrollTop) {
    this.renderer.render(this.scene, this.camera)
    this.time += 0.016
    if (!this.background.material.uniforms.uTime) return
    this.background.material.uniforms.uTime.value = this.time
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

    this.fov = this.camera.fov * (Math.PI / 180)
    this.heightCanvas = 2 * Math.tan(this.fov / 2) * this.camera.position.z
    this.widthCanvas = this.heightCanvas * this.camera.aspect
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
    this.background.scale.set(this.widthCanvas, this.heightCanvas, 0)
    this.scene.add(this.background)
  }

  addClippingMask() {
    // src: https://threejs.org/examples/?q=clip#webgl_clipping
    const cutEdgeX = 0.2
    const localPlane1 = new THREE.Plane(new THREE.Vector3(cutEdgeX, 0, 0), 0.8)
    const localPlane2 = new THREE.Plane(new THREE.Vector3(-cutEdgeX, 0, 0), 0.8)
    const globalPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0.1)

    // Geometry

    const material = new THREE.MeshBasicMaterial({
      color: 0x80ee10,
      side: THREE.DoubleSide,

      // ***** Clipping setup (material): *****
      clippingPlanes: [localPlane1, localPlane2],
    })

    const geometry = new THREE.TorusKnotGeometry(0.4, 0.08, 95, 20)

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
