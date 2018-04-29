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
