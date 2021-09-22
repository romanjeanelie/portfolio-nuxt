export default class TransitionPage {
  constructor(gsap, layout, scene, w, isTouch, isMobile, reducedMotion) {
    this.gsap = gsap
    this.layoutEl = layout
    this.scene = scene
    this.pageWidth = w
    this.isTouch = isTouch
    this.isMobile = isMobile
    this.reducedMotion = reducedMotion
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
    const tl = this.gsap.timeline()

    tl.to(
      '.home__line',
      {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 1,
        ease: 'power3.out',
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
        y: -100,
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
      scaleY: 0,
      duration: 1,
    })

    if (!this.isTouch) {
      tl.add(() => {
        this.scene.scene.projects.animateOutHole()
        this.scene.scene.background.animateOut()
      }, '-=2')
    }

    if (this.isTouch) {
      tl.to(
        '.project-component .image',
        {
          scale: 0.95,
          opacity: 0,
        },
        '<'
      )
    }

    tl.to(
      '.project-component .index .lineText',
      {
        y: -100,
        duration: 2,
      },
      '-=1'
    )
    tl.to(
      [
        '.project-component .name .lineText',
        '.project-component .date .lineText',
      ],
      {
        y: 100,
        duration: 2,
      },
      '<'
    )

    tl.to(
      '.scrollbar',
      {
        x: -100,
        duration: 1,
      },
      '<'
    )

    tl.to(
      '.navigation',
      {
        y: -100,
        duration: 1,
      },
      '<'
    )

    tl.to(
      '.footer',
      {
        y: 100,
        duration: 1,
      },
      '<'
    )

    // // Reset
    tl.set(
      '.project-barre',
      {
        width: '100vw',
        scaleX: 0,
        transformOrigin: 'right',
        opacity: 1,
      },
      '<'
    )

    // Animate in
    tl.to(
      '.project-barre',
      {
        scaleX: 1,
        // delay: 0.4,
        duration: 1,
        // ease: 'power1.in',
      },
      this.isTouch ? '-=1.5' : '-=0.5'
    )

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
      width: '100vw',
      scaleX: 0,
      transformOrigin: 'right',
      opacity: 1,
    })

    // Animate in
    tl.to('.project-barre', {
      scaleX: 1,
      duration: 0.7,
      ease: 'power2.in',
    })

    tl.add(() => {
      document.querySelector('.project').style.display = 'none'
      next()
    }, '+=0.1')
  }

  slugToProjects(to, next) {
    const tl = this.gsap.timeline()

    if (!this.isTouch) {
      tl.add(() => {
        this.scene.scene.sliderProject.animateOut()
      })
    }

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
        y: -100,
      },
      '<'
    )
    tl.to(
      '.project .project__footer',
      {
        y: 100,
      },
      '<'
    )

    tl.to(
      '.project__title .sublineText',
      {
        y: -100,
      },
      '<'
    )
    tl.to(
      '.project__description  .sublineText',
      {
        y: 10,
        opacity: 0,
        // duration: 1,
        stagger: 0.1,
      },
      '<'
    )
    tl.to(
      '.project__description a .lineText',
      {
        y: -100,
      },
      '<'
    )
    tl.to(
      '.project__right .details .sublineText',
      {
        y: -100,
      },
      '<'
    )

    if (this.isMobile) {
      tl.to(
        ' .slider-mobile',
        {
          yPercent: -100,
          duration: 1,
        },
        '<'
      )
    }

    tl.to(
      '.project__images',

      {
        yPercent: -150,
        duration: 1,
        stagger: 0.2,
      },
      '<'
    )

    if (this.isTouch) {
      tl.to(
        '.project__images__barre',
        {
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
        },
        '<'
      )
    } else {
      tl.to(
        '.project__images__barre',
        {
          scaleX: 0,
          duration: 1,
          ease: 'power2.out',
        },
        '<'
      )
    }

    tl.to(
      '.project__index',
      {
        opacity: 0,
      },
      '<'
    )

    if (this.isTouch) {
      // Reset
      tl.set('.project-barre', {
        width: '100vw',
        scaleX: 0,
        transformOrigin: 'right',
        opacity: 1,
      })

      // Animate in
      tl.to('.project-barre', {
        scaleX: 1,
        duration: 0.7,
        ease: 'power2.in',
      })
    }

    tl.add(() => {
      document.querySelector('.project').style.display = 'none'
      if (!this.isTouch) {
        this.scene.scene.background.animateIn()
      }
      next()
    }, '+=0.6')

    if (this.isTouch) {
      // Reset
      tl.set('.project-barre', {
        width: '100vw',
        scaleX: 1,
        opacity: 1,
        transformOrigin: 'left',
      })

      // Animate out
      tl.to('.project-barre', {
        scaleX: 0,
        duration: 2,
        ease: 'expo.out',
      })
    }
  }

  projectsToAbout(to, next) {
    const tl = this.gsap.timeline()

    if (this.isMobile) {
      tl.to('.project-component', {
        scale: 0.9,
        opacity: 0,
      })
      tl.to(
        '.projects-controls__mobile',
        {
          y: 50,
        },
        '<'
      )
    } else {
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
            if (!this.isTouch) {
              this.scene.scene.projects.destroy()
            }
          },
        },
        '<'
      )

      if (this.isTouch) {
        tl.set(
          '.project-component .image',

          {
            scale: 0.9,
            opacity: 0,
          }
        )
      }
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
    }

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
        y: -100,
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

    if ((this.isTouch && !this.isMobile) || this.reducedMotion) {
      tl.to(
        '.about .slider__container',
        {
          scale: 0.9,
          opacity: 0,
        },

        '<'
      )
    }

    if (this.reducedMotion) {
      tl.to(
        '.about__presentation-els',
        {
          scale: 0.9,
          opacity: 0,
          duration: 1.4,
          stagger: 0.1,
        },

        '<'
      )
    } else {
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
    }

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
        y: -100,
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
