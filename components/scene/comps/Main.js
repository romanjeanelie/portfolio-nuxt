/* eslint-disable */
import { clientSanity } from '~/assets/js/utils/datas/clientSanity'
import imageUrlBuilder from '@sanity/image-url'

import ResizeHelper from '~/assets/js/utils/ResizeHelper'
import MouseHelper from '~/assets/js/utils/MouseHelper.js'

import * as THREE from 'three'
import { gsap } from 'gsap'

import Plane from './Plane'
import Background from './Background'
import ProjectBackground from './ProjectBackground'

import emitter from '~/assets/js/events/EventsEmitter'

export default class Main {
  constructor(el, allProjects, routeName) {
    this.routeName = routeName
    this.canvasIsLoaded = false

    this.sizes = {
      w: ResizeHelper.width(),
      h: ResizeHelper.height(),
    }

    this.time = 0
    this.scrollTop = 0
    this.cameraZ = 300
    this.cameraX = 0
    this.cameraY = 0

    this.planes = []
    this.projectShow = false
    this.textureArray = []
    this.allProjects = JSON.parse(JSON.stringify(allProjects))

    this.mouse = {
      x: 0,
      y: 0,
    }
    this.mouseNormalized = new THREE.Vector2()

    this.raycaster = new THREE.Raycaster()

    this.builder = imageUrlBuilder(clientSanity)

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
    this.camera.aspect = this.sizes.w / this.sizes.h
    this.camera.updateProjectionMatrix()

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(this.sizes.w, this.sizes.h)

    el.appendChild(this.renderer.domElement)

    this.createBackground()
    this.createProjectBackground()
    this.loadProjects()
  }

  createBackground() {
    this.background = new Background(this.scene, this.sizes)
  }

  createProjectBackground() {
    this.projectBackground = new ProjectBackground(this.scene, this.sizes)
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
        this.canvasIsLoaded = true
        if (this.routeName === 'projects') {
          this.createPlanesProject()
          console.log('porject show true ,?', this.projectShow)
          if (this.projectShow === true) {
            this.animateInPlanesProjects(0)
          }
          emitter.on('PROJECT:SHOW', (index) => {
            this.animateInPlanesProjects(index)
          })
          emitter.on('PROJECT:RESET', (index) => {
            this.resetPlanesProjects(index)
          })
        } else {
          return
        }
      }
    }

    img.src = this.urlFor(project.mainImage)
  }

  createPlanesProject() {
    this.planes = []
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
  }

  animateInPlanesProjects(index) {
    if (this.planes.length > 0) {
      this.planes[index].animateIn()
    }
  }

  animateOutPlanesProjects() {
    if (this.planes.length > 0) {
      this.planes.forEach((plane) => {
        plane.animateOut()
      })
    }
  }

  resetPlanesProjects(index) {
    if (this.planes.length > 0) {
      this.planes[index].reset()
    }
  }

  destroyPlanesProjects() {
    console.log('destroy planes')
    if (this.planes.length > 0) {
      this.planes.forEach((plane) => {
        this.scene.remove(plane.mesh)
      })
    }
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
          const obj = intersects[1].object
          const objName = intersects[1].object.name

          if (obj.name.includes('project-card')) {
            gsap.to(this.background.mesh.material.uniforms.hoverState, {
              duration: 1,
              value: 0,
            })

            const regex = /[0-9]/g
            const index = parseInt(objName.match(regex).join())

            this.planes[index].mesh.material.uniforms.hover.value =
              intersects[1].uv
          }
          if (obj.name.includes('background')) {
            gsap.to(this.background.mesh.material.uniforms.hoverState, {
              duration: 1,
              value: 1,
            })

            this.background.mesh.material.uniforms.hover.value =
              intersects[1].uv

            gsap.to(this.projectBackground.mesh.material.uniforms.hoverState, {
              duration: 1,
              value: 1,
            })

            this.projectBackground.mesh.material.uniforms.hover.value =
              intersects[1].uv
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

    if (!this.projectBackground.mesh.material.uniforms.uTime) return
    this.projectBackground.mesh.material.uniforms.uTime.value = this.time

    this.planes.forEach((plane, i) => {
      const scroll = scrollTop
      plane.render(scroll, this.time, this.mouse)
    })

    this.renderer.render(this.scene, this.camera)
  }

  resize(w, h, pageHeight) {
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

    if (this.planes.length > 0) {
      this.planes.forEach((plane) => {
        plane.resize(this.sizes)
      })
    }

    this.background.resize(this.sizes)

    this.projectBackground.resize(this.sizes)
  }
}
