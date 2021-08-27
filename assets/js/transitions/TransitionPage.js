export default class TransitionPage {
  constructor(gsap, layout, scene, w) {
    this.gsap = gsap
    this.layoutEl = layout
    this.scene = scene
    this.pageWidth = w
  }

  transition(to, from, next) {
    if (from.name === 'index' && to.name === 'projects') {
      this.indexToProjects(to, next)
    } else if (from.name === 'projects' && to.name === 'projects-slug') {
      this.projectsToSlug(to, next)
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
      ['.home h1 .lineText', '.home h3 .lineText', '.home a .lineText'],
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

  projectsToSlug(to, next) {
    const tl = this.gsap.timeline()

    tl.to('.project-component .line', {
      scaleY: 0,
      transformOrigin: 'top',
      duration: 2,
    })

    tl.add(() => {
      this.scene.scene.animateOutHolePlanesProjects()
      this.scene.scene.background.animateOut()
    }, '-=2')

    tl.to(
      '.project-component .index .lineText',
      {
        y: '-2vw',
        duration: 2,
      },
      '<'
    )
    tl.to(
      [
        '.project-component .name .lineText',
        '.project-component .date .lineText',
      ],
      {
        y: '2vw',
        duration: 2,
      },
      '<'
    )

    tl.to(
      '.scrollbar',
      {
        x: '-7vw',
        duration: 1,
      },
      '<'
    )

    tl.to(
      '.navigation',
      {
        y: '-3vw',
        duration: 1,
      },
      '<'
    )
    tl.to(
      '.footer',
      {
        y: '3vw',
        duration: 1,
      },
      '<'
    )

    tl.add(() => {
      next()
      document.querySelector('.projects').style.display = 'none'
    })

    // tl.to(
    //   ['.navigation', '.scrollbar'],
    //   {
    //     autoAlpha: 0,
    //     duration: 1.5,
    //     onStart: () => {
    //       this.scene.scene.animateOutPlanesProjects()
    //       // this.scene.scene.projectBackground.animateIn()
    //     },
    //     onComplete: () => {
    //       // document.querySelector('.projects').style.display = 'none'
    //       // next()
    //     },
    //   },
    //   '<'
    // )
  }

  slugToProjects(to, next) {
    const tl = this.gsap.timeline()

    tl.to(
      '.project .project__top',
      {
        y: '-3vw',
      },
      '<'
    )
    tl.to(
      '.project .project__footer',
      {
        y: '3vw',
      },
      '<'
    )

    tl.to(
      '.project__title .sublineText',
      {
        y: '-10vw',
      },
      '<'
    )
    tl.to(
      '.project__description p .sublineText',
      {
        y: '-4vw',
      },
      '<'
    )
    tl.to(
      '.project__description a .lineText',
      {
        y: '-2vw',
      },
      '<'
    )

    // const offsetImages = 4 * (this.pageWidth / 100)
    tl.to(
      '.project__images',

      {
        y: '-150%',
        duration: 1,
        stagger: 0.2,
      }
    )

    tl.add(() => {
      next()
      document.querySelector('.project').style.display = 'none'
      this.scene.scene.background.animateIn()
    }, '+=0.6')
  }

  resize(w, h, pageHeight) {
    this.pageWidth = w
  }
}
