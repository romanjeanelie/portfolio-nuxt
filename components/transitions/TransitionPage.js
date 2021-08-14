export default class TransitionPage {
  constructor(gsap) {
    this.gsap = gsap
    this.layoutEl = document.querySelector('.layout')
  }

  transition(to, from, next) {
    console.log('page transition')
    if (from.name === 'index' && to.name === 'projects') {
      this.indexToProjects(to, next)
    } else {
      next()
    }
  }

  indexToProjects(to, next) {
    // Create transition lin
    const line = document.createElement('div')
    line.classList.add('line-transition')
    this.layoutEl.appendChild(line)

    const indexLine = document.querySelector('.home .line')
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
    console.log(to)

    const tl = this.gsap.timeline()
    tl.to('.line-transition', {
      scaleX: 100,
      transformOrigin: 'left',
      delay: 0.2,
      duration: 1,
    })
    tl.to(
      '.home',
      {
        opacity: 0,
        duration: 1,
        onComplete: () => {
          next()
        },
      },
      '<'
    )
    tl.to('.line-transition', {
      scaleX: 0,
      duration: 1,
    })
  }
}
