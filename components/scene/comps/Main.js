import imageUrlBuilder from '@sanity/image-url'

import * as THREE from 'three'
import { gsap } from 'gsap'

import Projects from './Projects/index'
import SliderProject from './SliderProject/index'
import SliderAbout from './SliderAbout/index'
import Background from './Background'
import ProjectBackground from './ProjectBackground'

import { clientSanity } from '~/assets/js/utils/datas/clientSanity'

import ResizeHelper from '~/assets/js/utils/ResizeHelper'
import MouseHelper from '~/assets/js/utils/MouseHelper.js'

import emitter from '~/assets/js/events/EventsEmitter'

export default class Main {
  constructor(el, allProjects, aboutData, routeName, slug) {
    console.log(allProjects)
    console.log(aboutData)
    this.routeName = routeName
    this.slug = slug

    this.sizes = {
      w: ResizeHelper.width(),
      h: ResizeHelper.height(),
    }

    this.time = 0
    this.scrollTop = 0
    this.cameraZ = 300
    this.cameraX = 0
    this.cameraY = 0

    this.canvasIsLoaded = false

    this.projectsLoaded = false
    this.planesProject = []
    this.textureProjectArray = []

    this.sliderProjectLoaded = false
    this.textureSliderProjectArray = []

    this.sliderAboutLoaded = false
    this.textureSliderAboutArray = []

    this.allProjects = allProjects
    this.aboutData = aboutData[0]
    // this.allProjects = JSON.parse(JSON.stringify(allProjects))
    // this.aboutData = JSON.parse(JSON.stringify(aboutData[0]))

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
    this.background = new Background(this.scene, this.sizes, this.routeName)
  }

  createProjectBackground() {
    this.projectBackground = new ProjectBackground(this.scene, this.sizes)
  }

  loadProjects() {
    this.projectLoaded = 0
    this.sliderProjectToLoad = 0

    this.sliderAboutCategories = ['imagesFilms', 'imagesSpectacles']
    this.indexCategoryLoading = 0

    this.loadProject(this.allProjects[this.projectLoaded])
    this.loadSliderProject(this.allProjects[this.sliderProjectToLoad])

    this.loadSliderAbout(this.sliderAboutCategories[this.indexCategoryLoading])
  }

  loadSliderProject(project) {
    const slugProject = project.slug.current

    this.sliderProjectImages = []

    this.sliderProjectImagesLoaded = 0

    if (project.images) {
      project.images.forEach((img) => {
        this.sliderProjectImages.push(img)
      })
      this.loadSliderProjectImages(
        this.sliderProjectImages[this.sliderProjectImagesLoaded],
        slugProject
      )
    }
  }

  loadSliderAbout(categoryLoading) {
    this.sliderAboutImages = []
    this.sliderAboutImagesLoaded = 0

    if (this.aboutData[categoryLoading]) {
      this.aboutData[categoryLoading].forEach((img) => {
        this.sliderAboutImages.push(img)
      })
      this.loadSliderAboutImages(
        this.sliderAboutImages[this.sliderAboutImagesLoaded],
        categoryLoading
      )
    }
  }

  loadProject(project) {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      console.log('img onload')
      const imageTexture = new THREE.Texture(img)
      imageTexture.needsUpdate = true

      this.textureProjectArray.push(imageTexture)
      if (this.projectLoaded < this.allProjects.length - 1) {
        console.log('load next project')
        this.loadProject(this.allProjects[++this.projectLoaded])
      } else {
        this.projectsLoaded = true
        this.createProjects()
      }
    }

    img.src = this.urlFor(project.mainImage)
  }

  loadSliderProjectImages(image, slug) {
    const imgSlider = new Image()
    imgSlider.crossOrigin = 'anonymous'

    imgSlider.onload = (e) => {
      const imageTexture = new THREE.Texture(imgSlider)
      imageTexture.needsUpdate = true

      this.textureSliderProjectArray.push({
        [slug]: imageTexture,
      })

      if (
        this.sliderProjectImagesLoaded <
        this.sliderProjectImages.length - 1
      ) {
        this.loadSliderProjectImages(
          this.sliderProjectImages[++this.sliderProjectImagesLoaded],
          slug
        )
      } else if (this.sliderProjectToLoad < this.allProjects.length - 1) {
        this.loadSliderProject(this.allProjects[++this.sliderProjectToLoad])
      } else {
        this.sliderProjectLoaded = true
        this.createSliderProject()
      }
    }

    imgSlider.src = this.urlFor(image.asset._ref)
  }

  loadSliderAboutImages(image, category) {
    const imgSlider = new Image()
    imgSlider.crossOrigin = 'anonymous'

    imgSlider.onload = (e) => {
      const imageTexture = new THREE.Texture(imgSlider)
      imageTexture.needsUpdate = true

      this.textureSliderAboutArray.push({
        texture: imageTexture,
        category,
      })
      if (this.sliderAboutImagesLoaded < this.sliderAboutImages.length - 1) {
        this.loadSliderAboutImages(
          this.sliderAboutImages[++this.sliderAboutImagesLoaded],
          category
        )
      } else if (
        this.indexCategoryLoading <
        this.sliderAboutCategories.length - 1
      ) {
        this.loadSliderAbout(
          this.sliderAboutCategories[++this.indexCategoryLoading]
        )
      } else {
        this.sliderAboutLoaded = true
        this.createSliderAbout()
      }
    }

    imgSlider.src = this.urlFor(image.asset._ref)
  }

  createProjects() {
    console.log('create projects')
    this.projects = new Projects(
      this.textureProjectArray,
      this.sizes,
      this.renderer,
      this.scene,
      this.camera
    )

    this.projects.createPlanes()
  }

  createSliderProject() {
    this.sliderProject = new SliderProject(
      this.textureSliderProjectArray,
      this.sizes,
      this.renderer,
      this.scene,
      this.camera
    )

    this.sliderProject.createPlanes()
  }

  createSliderAbout() {
    this.sliderAbout = new SliderAbout(
      this.textureSliderAboutArray,
      this.sizes,
      this.renderer,
      this.scene,
      this.camera
    )

    this.sliderAbout.createPlanes()
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
      this.sliderProject.display(this.slug)
    }

    if (this.routeName === 'projects') {
      this.projects.display(this.slug)
    }

    if (this.routeName === 'about') {
      this.sliderAbout.display()
    }
  }

  updateLoader() {
    if (this.canvasIsLoaded) return
    console.log('update loader true')
    const elementsToLoad = {
      background: false,
      projectBackground: false,
      projects: false,
      sliderProject: false,
      sliderAbout: false,
    }
    if (this.background && this.background.isCreated)
      elementsToLoad.background = true
    if (this.projects && this.projects.isCreated) elementsToLoad.projects = true
    if (this.sliderProject && this.sliderProject.isCreated)
      elementsToLoad.sliderProject = true
    if (this.sliderAbout && this.sliderAbout.isCreated)
      elementsToLoad.sliderAbout = true
    if (this.projectBackground && this.projectBackground.isCreated)
      elementsToLoad.projectBackground = true

    const progress =
      Object.values(elementsToLoad).filter((value) => value === true).length /
      Object.keys(elementsToLoad).length

    console.log('progress: ', progress)
    console.log(elementsToLoad)

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

    if (this.sliderProject) {
      this.sliderProject.update(scrollTop, this.time)
    }

    if (this.sliderAbout) {
      this.sliderAbout.update(scrollTop, this.time)
    }

    this.renderer.render(this.scene, this.camera)
  }
}
