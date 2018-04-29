;(function (global) {
  global.NotVue = function ({ el, data }) {
    const element = document.querySelector(el)
    const template = element.innerHTML

    const state = Object.assign({}, data)

    function render () {
      element.innerHTML = template.replace(
        /(?:{{\s*(.+?)\s*}})/g,
        (_, prop) => state[prop]
      )
    }
    render()

    const app = this
    Object.keys(data).forEach(function (prop) {
      Object.defineProperty(app, prop, {
        set: function (value) {
          state[prop] = value
          render()
        },
        get: () => state[prop]
      })
    })
  }
})(this)
