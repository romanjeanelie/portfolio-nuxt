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
    } else if (from.name === 'projects-slug' && to.name === 'projects-slug') {
      this.slugToSlug(to, next)
    } else if (from.name === 'projects' && to.name === 'about') {
      this.projectsToAbout(to, next)
    } else if (from.name === 'about' && to.name === 'projects') {
      this.aboutToProjects(to, next)
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

    tl.to(
      '.line-transition',
      {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 1,
        ease: 'power3.out',

        onStart: () => {
          indexLine.style.visibility = 'hidden'
        },
      },
      '<'
    )

    tl.to(
      ['.home h1 .lineText', '.home h3 .lineText', '.home a .lineText'],
      {
        y: '-110%',
        duration: 1,
        ease: 'power3.out',
      },
      '<'
    )

    tl.add(() => {
      next()
      document.querySelector('.home').style.display = 'none'
    })
  }

  projectsToIndex(to, next) {
    const tl = this.gsap.timeline()

    tl.to('.project-component .index .lineText', {
      yPercent: -200,
    })

    tl.to(
      [
        '.project-component .name .lineText',
        '.project-component .date .lineText',
      ],
      {
        yPercent: 200,
      },

      '<'
    )

    tl.to(
      '.project-component .line',

      {
        scaleX: 1,
        duration: 0.5,
        onComplete: () => {
          this.scene.scene.projects.destroy()
        },
      },
      '<'
    )

    tl.to(
      '.project-component .line__wrapper',

      {
        scaleX: 0,
        duration: 0.5,
        ease: 'power2.out',
      }
    )

    tl.to(
      '.scrollbar',
      {
        x: '-100px',
        duration: 1.5,
      },
      '<'
    )

    tl.to(
      '.footer',
      {
        y: '100%',
        duration: 1.5,
      },
      '<'
    )

    tl.to(
      '.navigation',
      {
        y: '-100%',
        duration: 1.5,

        onComplete: () => {
          document.querySelector('.projects').style.display = 'none'
          next()
        },
      },
      '<'
    )
  }

  projectsToSlug(to, next) {
    const tl = this.gsap.timeline()

    tl.to('.project-component .line__wrapper', {
      opacity: 0,
      duration: 1,
    })

    tl.add(() => {
      this.scene.scene.projects.animateOutHole()
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
        y: '-100%',
        duration: 1,
      },
      '<'
    )

    tl.to(
      '.footer',
      {
        y: '100%',
        duration: 1,
      },
      '<'
    )

    // Reset
    tl.set('.project-barre', {
      width: 0,
      scaleX: 1,
    })

    // Animate in
    tl.to('.project-barre', {
      width: '100vw',
      transformOrigin: 'left',
      delay: 0.3,
      duration: 1,
      ease: 'power1.in',
    })

    tl.add(() => {
      document.querySelector('.projects').style.display = 'none'
      next()
    })
  }

  slugToSlug(to, next) {
    const tl = this.gsap.timeline()

    // Animate out
    tl.to('.project-barre', {
      scaleX: 0,
      duration: 0.5,
    })

    // Reset
    tl.set('.project-barre', {
      width: 0,
      scaleX: 1,
    })

    // Animate in
    tl.to('.project-barre', {
      width: '100vw',
      transformOrigin: 'left',
      duration: 1,
      ease: 'expo.inOut',
      onComplete: next,
    })
  }

  slugToProjects(to, next) {
    const tl = this.gsap.timeline()
    tl.add(() => {
      this.scene.scene.sliderProject.animateOut()
    })

    // Animate out
    tl.to('.project-barre', {
      scaleX: 0,
      duration: 0.5,
    })
    tl.to(
      '.project__right figure',
      {
        opacity: 0,
        scale: 0.95,
        duration: 1,
      },
      '<'
    )

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
    tl.to(
      '.project__right .details .lineText',
      {
        y: '-2vw',
      },
      '<'
    )

    tl.to(
      '.project__images',

      {
        y: '-150%',
        duration: 1,
        stagger: 0.2,
      },
      '<'
    )

    tl.to(
      '.project__images__barre',
      {
        scaleX: 0,
        duration: 1,
        ease: 'power2.out',
      },
      '<'
    )

    tl.to(
      '.project__index',
      {
        opacity: 0,
      },
      '<'
    )

    tl.add(() => {
      next()
      document.querySelector('.project').style.display = 'none'
      this.scene.scene.background.animateIn()
    }, '+=0.6')
  }

  projectsToAbout(to, next) {
    const tl = this.gsap.timeline()

    tl.to('.project-component .index .lineText', {
      yPercent: -200,
    })

    tl.to(
      [
        '.project-component .name .lineText',
        '.project-component .date .lineText',
      ],
      {
        yPercent: 200,
      },

      '<'
    )

    tl.to(
      '.project-component .line',

      {
        scaleX: 1,
        duration: 0.5,
        onComplete: () => {
          this.scene.scene.projects.destroy()
        },
      },
      '<'
    )

    tl.to(
      '.project-component .line__wrapper',

      {
        scaleX: 0,
        duration: 0.5,
        ease: 'power2.out',
      }
    )

    tl.to(
      '.scrollbar',
      {
        x: '-100px',
        duration: 1.5,
      },
      '<'
    )

    tl.to(
      '.footer',
      {
        y: '100%',
        duration: 1.5,
      },
      '<'
    )

    tl.to(
      '.navigation',
      {
        y: '-100%',
        duration: 1.5,

        onComplete: () => {
          document.querySelector('.projects').style.display = 'none'
          next()
        },
      },
      '<'
    )
  }

  aboutToProjects(to, next) {
    const tl = this.gsap.timeline()

    tl.to('.about__name .lineText', {
      y: -20,
      duration: 1.4,
      ease: 'power2.inOut',
    })

    tl.to(
      '.about__socials a',
      {
        y: -20,
        duration: 2,
        ease: 'power2.inOut',
      },
      '<'
    )

    tl.to(
      '.about .line__wrapper',
      {
        scaleY: 0,
        duration: 1.4,
        ease: 'power2.inOut',
      },

      '<'
    )
    tl.to(
      '.about__presentation-els',
      {
        y: 100,
        opacity: 0,
        duration: 1.4,
        ease: 'power2.inOut',
        stagger: 0.1,
      },

      '<'
    )

    tl.to(
      '.footer',
      {
        y: '100%',
        duration: 1.5,
      },
      '<'
    )

    tl.to(
      '.navigation',
      {
        y: '-100%',
        duration: 1.5,

        onComplete: () => {
          document.querySelector('.about').style.display = 'none'
          next()
        },
      },
      '<'
    )
  }

  resize(w, h, pageHeight) {
    this.pageWidth = w
  }
}
