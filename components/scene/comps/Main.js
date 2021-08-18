/* eslint-disable */
import { clientSanity } from '~/assets/js/utils/datas/clientSanity'
import imageUrlBuilder from '@sanity/image-url'

import ResizeHelper from '~/assets/js/utils/ResizeHelper'
import ScrollHelper from '~/assets/js/utils/ScrollHelper'
import MouseHelper from '~/assets/js/utils/MouseHelper.js'

import * as THREE from 'three'
import { gsap } from 'gsap'

import Plane from './Plane'
import Background from './Background'

export default class Main {
  constructor(el, allProjects) {
    this.sizes = {
      w: ResizeHelper.width(),
      h: ResizeHelper.height(),
    }

    console.log('sizes main', this.sizes.w, this.sizes.h)

    this.time = 0
    this.scrollTop = 0
    this.cameraZ = 300
    this.cameraX = 0
    this.cameraY = 0

    this.planes = []
    this.textureArray = []
    this.allProjects = JSON.parse(JSON.stringify(allProjects))

    this.mouse = {
      x: 0,
      y: 0,
    }
    this.mouseNormalized = new THREE.Vector2()

    this.raycaster = new THREE.Raycaster()

    this.builder = imageUrlBuilder(clientSanity)

    console.log('new Main')

    this.init(el)
    this.onMouseMove()
  }

  init(el) {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.sizes.w / this.sizes.h,
      0.1,
      700
    )
    this.camera.position.z = this.cameraZ

    this.fov =
      2 * Math.atan(this.sizes.h / 2 / this.camera.position.z) * (180 / Math.PI)

    this.camera.fov = this.fov

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.clippingPlanes = Object.freeze([]) // GUI sets it to globalPlanes
    this.renderer.localClippingEnabled = true

    el.appendChild(this.renderer.domElement)

    this.background = new Background(this.scene, this.sizes)
    console.log('background ?', this.background)
    this.loadProjects()
  }

  loadProjects() {
    this.projectLoaded = 0
    this.loadProject(this.allProjects[this.projectLoaded])
  }

  urlFor(source) {
    return this.builder.image(source)
  }

  loadProject(project) {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = (e) => {
      const imageTexture = new THREE.Texture(img)
      imageTexture.needsUpdate = true

      this.textureArray.push(imageTexture)

      if (this.projectLoaded < this.allProjects.length - 1) {
        this.loadProject(this.allProjects[++this.projectLoaded])
      } else {
        this.onLoaded()
      }
    }

    img.src = this.urlFor(project.mainImage)
  }

  onLoaded() {
    this.textureArray.forEach((texture, i) => {
      const plane = new Plane(
        texture,
        i,
        this.sizes,
        this.renderer,
        this.scene,
        this.camera
      )
      this.planes.push(plane)
    })

    this.resize()
  }

  onMouseMove() {
    window.addEventListener(
      'mousemove',
      (event) => {
        this.mouseNormalized.x = (event.clientX / this.sizes.w) * 2 - 1
        this.mouseNormalized.y = -(event.clientY / this.sizes.h) * 2 + 1

        this.raycaster.setFromCamera(this.mouseNormalized, this.camera)
        const intersects = this.raycaster.intersectObjects(this.scene.children)

        if (intersects.length > 0) {
          const obj = intersects[0].object
          const objName = intersects[0].object.name

          if (obj.name.includes('project-card')) {
            gsap.to(this.background.mesh.material.uniforms.hoverState, {
              duration: 1,
              value: 0,
            })

            const regex = /[0-9]/g
            const index = parseInt(objName.match(regex).join())

            this.planes[index].mesh.material.uniforms.hover.value =
              intersects[0].uv
          }
          if (obj.name.includes('background')) {
            gsap.to(this.background.mesh.material.uniforms.hoverState, {
              duration: 1,
              value: 1,
            })

            this.background.mesh.material.uniforms.hover.value =
              intersects[0].uv
          }
        }
      },
      false
    )
  }

  tick(scrollTop) {
    this.time += 0.016
    this.mouse.x = MouseHelper.easeX
    this.mouse.y = MouseHelper.easeY

    if (!this.background.mesh.material.uniforms.uTime) return
    this.background.mesh.material.uniforms.uTime.value = this.time

    this.planes.forEach((plane, i) => {
      const scroll = scrollTop
      plane.render(scroll, this.time, this.mouse)
    })

    this.renderer.render(this.scene, this.camera)
  }

  resize(w, h, pageHeight) {
    console.log('resize main', w, h)
    ScrollHelper.goTo(0)

    if (w && h) {
      this.sizes.w = w
      this.sizes.h = h
      this.pageHeight = pageHeight - h
    }

    this.camera.aspect = this.sizes.w / this.sizes.h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.sizes.w, this.sizes.h)

    this.fov =
      2 * Math.atan(this.sizes.h / 2 / this.camera.position.z) * (180 / Math.PI)

    this.camera.fov = this.fov

    this.planes.forEach((plane) => {
      plane.resize(this.sizes)
    })

    this.background.resize(this.sizes)
  }
}
