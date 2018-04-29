;(function (global) {
  global.NotVue = function ({ el, data }) {
    const element = document.querySelector(el)
    element.innerHTML = element.innerHTML.replace(
      /(?:{{\s*(.+?)\s*}})/g,
      (_, prop) => data[prop]
    )
  }
})(this)
