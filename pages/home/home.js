page = {
   get element() {
      let ele = document.createElement('div')
      ele.id = 'page'
      ele.innerText = "Welcome to Ignyos. Here's some information about the site."
      return ele
   },
   load() {}
}

// class HomePage extends PageBase {
//    constructor()
//    {
//       super()
//    }

//    get element()
//    {
//       let ele = document.createElement('div')
//       ele.innerText = "Welcome to Ignyos. Here's some information about the site."
//       return ele
//    }
// }

// page = new HomePage()