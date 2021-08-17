import * as THREE from 'three'
import card1Vertex from '../shaders/card1-vertex.glsl'
import card1Fragment from '../shaders/card1-fragment.glsl'

import tribute from '~/assets/img/tribute.png'
import lpf from '~/assets/img/lpf.png'
import ldo from '~/assets/img/ldo.png'

export default class Plane {
  constructor(element, i, renderer, scene, camera) {
    this.element = element
    this.index = i
    this.renderer = renderer
    this.scene = scene
    this.camera = camera
    this.widthCanvas = window.innerWidth
    this.heightCanvas = window.innerHeight
    this.images = [tribute, lpf, ldo]

    this.raycaster = new THREE.Raycaster()
    this.mouseNormalized = new THREE.Vector2()

    // this.reset()
    this.createMesh(this.scene)
    this.computeBounds()
    this.onMouseMove()
  }

  createMesh(scene) {
    const geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)

    // CLIPPING
    // const cutEdgeX = 100.2
    // const localPlane1 = new THREE.Plane(
    //   new THREE.Vector3(cutEdgeX, 0.2, 0, 0),
    //   0.8
    // )

    const texture = new THREE.TextureLoader().load(this.images[this.index])

    const material = new THREE.ShaderMaterial({
      uniforms: {
        bgColor1: { value: new THREE.Color('#383838') },
        bgColor2: { value: new THREE.Color('#4D4D4D') },
        fgColor1: { value: new THREE.Color('#ECECEC') },
        uImage: { value: texture },
        hover: { value: new THREE.Vector2(0.5, 0.5) },
        uTime: { value: 0 },
      },
      vertexShader: card1Vertex,
      fragmentShader: card1Fragment,
      //   clipping: true,
      clippingPlanes: [],

      //   transparent: true,
    })

    this.mesh = new THREE.Mesh(geometry, material)

    scene.add(this.mesh)
  }

  computeBounds() {
    this.bounds = this.element.getBoundingClientRect()

    // console.log(this.bounds.width)
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
    this.mesh.position.x = this.x - this.widthCanvas / 2 + this.bounds.width / 2
  }

  updateY(scroll) {
    this.y = this.bounds.top
    this.mesh.position.y =
      scroll - this.y + this.heightCanvas / 2 - this.bounds.height / 2
    // console.log(this.mesh.position.y)
  }

  onMouseMove() {
    window.addEventListener(
      'mousemove',
      (event) => {
        this.mouseNormalized.x = (event.clientX / window.innerWidth) * 2 - 1
        this.mouseNormalized.y = -(event.clientY / window.innerHeight) * 2 + 1
        // update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(this.mouseNormalized, this.camera)
        // calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.scene.children)
        if (intersects.length > 0) {
          const obj = intersects[0].object
          obj.material.uniforms.hover.value = intersects[0].uv
          console.log(obj.material.uniforms.hover.value)
        }
      },
      false
    )
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
