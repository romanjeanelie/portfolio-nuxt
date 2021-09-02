import imageUrlBuilder from '@sanity/image-url'

import * as THREE from 'three'
import { gsap } from 'gsap'

import Projects from './Projects/index'
import Slider from './Slider/index'
import Background from './Background'
import ProjectBackground from './ProjectBackground'

import { clientSanity } from '~/assets/js/utils/datas/clientSanity'

import ResizeHelper from '~/assets/js/utils/ResizeHelper'
import MouseHelper from '~/assets/js/utils/MouseHelper.js'

import emitter from '~/assets/js/events/EventsEmitter'

export default class Main {
  constructor(el, allProjects, routeName, slug) {
    this.routeName = routeName
    this.slug = slug

    this.canvasIsLoaded = false
    this.projectsLoaded = false
    this.sliderLoaded = false

    this.sizes = {
      w: ResizeHelper.width(),
      h: ResizeHelper.height(),
    }

    this.time = 0
    this.scrollTop = 0
    this.cameraZ = 300
    this.cameraX = 0
    this.cameraY = 0

    this.planesProject = []
    this.textureProjectArray = []

    this.textureSliderArray = []
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

  urlFor(source) {
    return this.builder.image(source)
  }

  init(el) {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.sizes.w / this.sizes.h,
      0.1,
      3700
    )
    this.camera.position.z = this.cameraZ

    this.fov =
      2 * Math.atan(this.sizes.h / 2 / this.camera.position.z) * (180 / Math.PI)

    this.camera.fov = this.fov
    this.camera.aspect = this.sizes.w / this.sizes.h
    this.camera.updateProjectionMatrix()

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(this.sizes.w, this.sizes.h)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

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
    this.sliderProjectLoaded = 0

    this.loadProject(this.allProjects[this.projectLoaded])
    this.loadSlider(this.allProjects[this.sliderProjectLoaded])
  }

  loadSlider(project) {
    const slugProject = project.slug.current

    this.sliderImages = []

    this.sliderImagesLoaded = 0

    if (project.images) {
      project.images.forEach((img) => {
        this.sliderImages.push(img)
      })
      this.loadSliderImages(
        this.sliderImages[this.sliderImagesLoaded],
        slugProject
      )
    }
  }

  loadProject(project) {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const imageTexture = new THREE.Texture(img)
      imageTexture.needsUpdate = true

      this.textureProjectArray.push(imageTexture)
      if (this.projectLoaded < this.allProjects.length - 1) {
        this.loadProject(this.allProjects[++this.projectLoaded])
      } else {
        this.projectsLoaded = true
        this.createProjects()
      }
    }

    img.src = this.urlFor(project.mainImage)
  }

  loadSliderImages(image, slug) {
    const imgSlider = new Image()
    imgSlider.crossOrigin = 'anonymous'

    imgSlider.onload = (e) => {
      const imageTexture = new THREE.Texture(imgSlider)
      imageTexture.needsUpdate = true

      this.textureSliderArray.push({
        [slug]: imageTexture,
      })

      if (this.sliderImagesLoaded < this.sliderImages.length - 1) {
        this.loadSliderImages(
          this.sliderImages[++this.sliderImagesLoaded],
          slug
        )
      } else if (this.sliderProjectLoaded < this.allProjects.length - 1) {
        this.loadSlider(this.allProjects[++this.sliderProjectLoaded])
      } else {
        this.sliderLoaded = true
        this.createSlider()
      }
    }

    imgSlider.src = this.urlFor(image.asset._ref)
  }

  createProjects() {
    this.projects = new Projects(
      this.textureProjectArray,
      this.sizes,
      this.renderer,
      this.scene,
      this.camera
    )

    this.projects.createPlanes()
  }

  createSlider() {
    this.slider = new Slider(
      this.textureSliderArray,
      this.sizes,
      this.renderer,
      this.scene,
      this.camera
    )

    this.slider.createPlanes()
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
          const objName = intersects[0].object.name

          if (objName.includes('project-card')) {
            gsap.to(this.background.mesh.material.uniforms.hoverState, {
              duration: 1,
              value: 0,
            })

            const regex = /[0-9]/g
            const index = parseInt(objName.match(regex).join())

            this.projects.planesProject[
              index
            ].mesh.material.uniforms.hover.value = intersects[0].uv
          }

          if (this.background && objName.includes('background')) {
            gsap.to(this.background.mesh.material.uniforms.hoverState, {
              duration: 1,
              value: 1,
            })

            this.background.mesh.material.uniforms.hover.value =
              intersects[0].uv

            gsap.to(this.projectBackground.mesh.material.uniforms.hoverState, {
              duration: 1,
              value: 1,
            })

            this.projectBackground.mesh.material.uniforms.hover.value =
              intersects[0].uv
          }
        }
      },
      false
    )
  }

  updatePage() {
    if (this.routeName === 'projects-slug') {
      this.background.animateOut()
    }

    if (this.routeName === 'projects') {
      this.projects.display(this.slug)
    }
    if (this.routeName === 'projects-slug') {
      this.slider.display(this.slug)
    }
  }

  updateLoader() {
    if (this.canvasIsLoaded) return
    const elementsToLoad = {
      background: false,
      projectBackground: false,
      planesProject: false,
      planesSlider: false,
    }
    if (this.slider && this.slider.isLoaded) elementsToLoad.planesSlider = true
    if (this.background && this.background.isLoaded)
      elementsToLoad.background = true
    if (this.projectBackground && this.projectBackground.isLoaded)
      elementsToLoad.projectBackground = true
    if (this.slider && this.slider.isLoaded) elementsToLoad.planesProject = true

    const progress =
      Object.values(elementsToLoad).filter((value) => value === true).length /
      Object.keys(elementsToLoad).length

    if (progress === 1) {
      emitter.emit('CANVAS:LOADED')
      this.canvasIsLoaded = true
      this.updatePage()
    }
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
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    this.fov =
      2 * Math.atan(this.sizes.h / 2 / this.camera.position.z) * (180 / Math.PI)

    this.camera.fov = this.fov

    if (this.projects) {
      this.projects.resize(this.sizes)
    }

    if (this.background) {
      this.background.resize(this.sizes)
    }

    if (this.projectBackground) {
      this.projectBackground.resize(this.sizes)
    }
  }

  tick(scrollTop) {
    this.updateLoader()

    this.time += 0.016
    this.mouse.x = MouseHelper.easeX
    this.mouse.y = MouseHelper.easeY

    if (!this.background) return
    if (!this.background.mesh.material.uniforms.uTime) return
    this.background.mesh.material.uniforms.uTime.value = this.time

    if (!this.projectBackground.mesh.material.uniforms.uTime) return
    this.projectBackground.mesh.material.uniforms.uTime.value = this.time

    if (this.projects) {
      this.projects.update(scrollTop, this.time)
    }

    if (this.slider) {
      this.slider.update(scrollTop, this.time)
    }

    this.renderer.render(this.scene, this.camera)
  }
}
