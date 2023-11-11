class HomePage extends PageBase {
   constructor()
   {
      super()
   }

   get element()
   {
      let ele = document.createElement('div')
      ele.innerText = "Sign In to continue."
      return ele
   }
}

page = new HomePage()