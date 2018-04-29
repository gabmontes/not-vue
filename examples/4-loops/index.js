const app = new NotVue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})

app.message = 'This is reactive!'

const app2 = new NotVue({
  el: '#app-2',
  data: {
    message: 'You loaded this page on ' + new Date().toLocaleString()
  }
})

app2.message = 'some new message'

const app3 = new NotVue({
  el: '#app-3',
  data: {
    seen: true
  }
})

app3.seen = false

const app4 = new NotVue({
  el: '#app-4',
  data: {
    todos: [
      { text: 'Learn JavaScript' },
      { text: 'Learn Vue' },
      { text: 'Build something awesome' }
    ]
  }
})

app4.todos = app4.todos.concat({ text: 'New item' })
