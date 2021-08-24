export default class TransitionPage {
  constructor(gsap, layout, scene) {
    this.gsap = gsap
    this.layoutEl = layout
    this.scene = scene
  }

  transition(to, from, next) {
    if (from.name === 'index' && to.name === 'projects') {
      this.indexToProjects(to, next)
    } else if (from.name === 'projects' && to.name === 'projects-slug') {
      this.projectsToSlugProject(to, next)
    } else if (from.name === 'projects' && to.name === 'index') {
      this.projectsToIndex(to, next)
    } else if (from.name === 'projects-slug' && to.name === 'projects') {
      this.slugToProjects(to, next)
    } else {
      next()
    }
  }

  indexToProjects(to, next) {
    const line = document.createElement('div')
    line.classList.add('line-transition')
    line.style.zIndex = '99'
    this.layoutEl.appendChild(line)

    const indexLine = document.querySelector('.home__line')
    const posIndexLine = indexLine.getBoundingClientRect()
    const widthIndexLine = getComputedStyle(indexLine).getPropertyValue('width')
    const heightIndexLine =
      getComputedStyle(indexLine).getPropertyValue('height')
    const colorIndexLine =
      getComputedStyle(indexLine).getPropertyValue('background-color')

    line.style.position = 'absolute'
    line.style.width = widthIndexLine
    line.style.height = heightIndexLine
    line.style.top = posIndexLine.top + 'px'
    line.style.left = posIndexLine.left + 'px'
    line.style.background = colorIndexLine

    const tl = this.gsap.timeline()

    tl.to('.line-transition', {
      scaleY: 0,
      transformOrigin: 'top',
      delay: 0.2,
      duration: 1,
      onStart: () => {
        indexLine.style.visibility = 'hidden'
      },
    })
    tl.to(
      ['.home h1 .line', '.home h3 .line', '.home a .line'],
      {
        y: '-110%',
        duration: 1,
      },
      '<'
    )

    tl.add(() => {
      next()
      document.querySelector('.home').style.display = 'none'
    }, '+=0.3')
  }

  projectsToSlugProject(to, next) {
    const tl = this.gsap.timeline()

    tl.to('.projects', {
      autoAlpha: 0,
      duration: 2,
      onStart: () => {
        this.scene.scene.animateOutPlanesProjects()
        this.scene.scene.projectBackground.animateIn()
      },
    })

    tl.to(
      '.scrollbar',
      {
        x: '-7vw',
        duration: 1.5,
      },
      '<'
    )

    tl.to(
      '.navigation',
      {
        y: '-3vw',
        duration: 1.5,

        onComplete: () => {
          next()
          document.querySelector('.projects').style.display = 'none'
        },
      },
      '<'
    )
  }

  projectsToIndex(to, next) {
    const tl = this.gsap.timeline()

    tl.to('.projects', {
      autoAlpha: 0,
      duration: 2,
      onStart: () => {
        this.scene.scene.animateOutPlanesProjects()
      },
    })

    tl.to(
      '.scrollbar',
      {
        x: '-7vw',
        duration: 1.5,
      },
      '<'
    )

    tl.to(
      '.navigation',
      {
        y: '-3vw',
        duration: 1.5,

        onComplete: () => {
          next()
          document.querySelector('.projects').style.display = 'none'
        },
      },
      '<'
    )
  }

  slugToProjects(to, next) {
    const tl = this.gsap.timeline()

    tl.to('.project', {
      autoAlpha: 1,
      duration: 2,
      onStart: () => {
        this.scene.scene.animateInPlanesProjects()
        this.scene.scene.projectBackground.animateOut()
      },
      onComplete: () => {
        next()
        document.querySelector('.project').style.display = 'none'
      },
    })

    // tl.to(
    //   '.scrollbar',
    //   {
    //     x: '-7vw',
    //     duration: 1.5,
    //   },
    //   '<'
    // )

    // tl.to(
    //   '.navigation',
    //   {
    //     y: '-3vw',
    //     duration: 1.5,

    //     onComplete: () => {
    //       next()
    //       document.querySelector('.projects').style.display = 'none'
    //     },
    //   },
    //   '<'
    // )
  }
}
