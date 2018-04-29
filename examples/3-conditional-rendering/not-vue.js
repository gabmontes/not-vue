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
      Array.from(element.children).forEach(function (child) {
        Array.from(child.attributes).forEach(function (attribute) {
          const { name, value } = attribute
          const [directive, target] = name.split(':')
          switch (directive) {
            case 'v-bind':
              child.removeAttribute(name)
              child.setAttribute(target, state[value])
              break
            case 'v-if':
              child.removeAttribute(name)
              if (!state[value]) {
                child.outerHTML = '<!---->'
              }
              break
          }
        })
      })
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
