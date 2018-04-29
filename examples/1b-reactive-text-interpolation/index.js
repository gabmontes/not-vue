const app = new NotVue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})

app.message = 'This is reactive!'
