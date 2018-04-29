// Wrap it all in an IIFE to play fair with the global context.
;(function (global) {
  'use strict'

  // Define a helper to get nested properties.
  const getProp = (obj, path) => path.split('.').reduce((o, p) => o[p], obj)

  // Defien `NotView` as we don't want to mess with `Vue`, right?
  global.NotVue = function ({ el, data }) {
    // Need to keep the original HTML to use as a template during rendering.
    const element = document.querySelector(el)
    const template = element.innerHTML

    // Only shallowly cloning the initial state. Should do deep cloning but that
    // would add much more complexity.
    const state = Object.assign({}, data)

    // The main function returns a new HTML based on a template and a state.
    // It could be recursively called for nested HTML elements.
    function render (_template, _state) {
      // A new template element is created so the actual DOM is not manipulated.
      const newElement = document.createElement('template')
      newElement.innerHTML = _template

      // Need to walk all the children nodes
      Array.from(newElement.content.children).forEach(function (child) {
        // And for each children, all its attributes
        Array.from(child.attributes).forEach(function (attribute) {
          const { name, value } = attribute
          const [directive, target] = name.split(':')

          // If the attribute is "known"...
          switch (directive) {
            case 'v-bind':
              // Remove it.
              child.removeAttribute(name)
              // Set the proper attribute and value.
              child.setAttribute(target, getProp(_state, value))
              break
            case 'v-if':
              // Remove it.
              child.removeAttribute(name)
              // Replace the child element with a comment as indicated by the
              // state variable.
              if (!getProp(_state, value)) {
                child.replaceWith(document.createComment(''))
              }
              break
            case 'v-for':
              // Remove it
              child.removeAttribute(name)
              // Take the contents as a template and clean it up to avoid
              // looping into its own contents later.
              const childTemplate = child.innerHTML
              child.innerHTML = ''
              // Remove the child from the parent as it is a template, not an
              // actual node that needs to stay there.
              const { parentNode } = child
              parentNode.removeChild(child)
              // Loop through the sub-state list, create a new node for each
              // element in that list and append it to the parent node.
              const [partial, list] = value.split(' in ')
              getProp(_state, list).forEach(function (subState) {
                const newChild = child.cloneNode()
                // Each element shall be processed to properly interpolate,
                // update its own attributes, and so.
                newChild.innerHTML = render(childTemplate, {
                  [partial]: subState
                })
                parentNode.appendChild(newChild)
              })
              break
          }
        })

        // When done processing attributes, process its own contents to
        // recursively walk the DOM tree.
        child.innerHTML = render(child.innerHTML, _state)
      })

      // When all children are done, is time to process text interpolation.
      return newElement.innerHTML.replace(
        /(?:{{\s*(.+?)\s*}})/g,
        (_, prop) => getProp(_state, prop)
      ).trim()
    }

    // Render the HTML for the first time during app creation.
    element.innerHTML = render(template, state)

    // The app is an object with convenience getters and setters that will allow
    // re-rendering when called.
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
