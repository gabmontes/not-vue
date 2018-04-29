;(function (global) {
  const getProp = (obj, path) => path.split('.').reduce((o, p) => o[p], obj)

  global.NotVue = function ({ el, data }) {
    const element = document.querySelector(el)
    const template = element.innerHTML

    const state = Object.assign({}, data)

    function render (_template, _state) {
      const newElement = document.createElement('template')
      newElement.innerHTML = _template

      Array.from(newElement.content.children).forEach(function (child) {
        Array.from(child.attributes).forEach(function (attribute) {
          const { name, value } = attribute
          const [directive, target] = name.split(':')
          child.removeAttribute(name)
          switch (directive) {
            case 'v-bind':
              child.removeAttribute(name)
              child.setAttribute(target, getProp(_state, value))
              break
            case 'v-if':
              child.removeAttribute(name)
              if (!getProp(_state, value)) {
                child.replaceWith(document.createComment(''))
              }
              break
            case 'v-for':
              child.removeAttribute(name)
              const childTemplate = child.innerHTML
              child.innerHTML = ''
              const { parentNode } = child
              parentNode.removeChild(child)
              const [partial, list] = value.split(' in ')
              getProp(_state, list).forEach(function (subState) {
                const newChild = child.cloneNode()
                newChild.innerHTML = render(childTemplate, {
                  [partial]: subState
                })
                parentNode.appendChild(newChild)
              })
              break
          }
        })

        child.innerHTML = render(child.innerHTML, _state)
      })

      return newElement.innerHTML.replace(
        /(?:{{\s*(.+?)\s*}})/g,
        (_, prop) => getProp(_state, prop)
      ).trim()
    }

    element.innerHTML = render(template, state)

    const app = this
    Object.keys(data).forEach(function (prop) {
      Object.defineProperty(app, prop, {
        set: function (value) {
          state[prop] = value
          element.innerHTML = render(template, state)
        },
        get: () => getProp(state, prop)
      })
    })
  }
})(this)
