/* eslint-disable */

export default (el) => {
  const SplitText = require('gsap/SplitText').SplitText
  new SplitText(el, {
    type: 'lines',
    linesClass: 'line',
  })
  const lines = [].slice.call(el.querySelectorAll('.line'))

  lines.forEach((el) => {
    el.innerHTML = '<div class="inner">' + el.innerHTML + '</div>'
  })
}
