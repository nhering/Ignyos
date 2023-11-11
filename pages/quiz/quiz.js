class QuizPage extends PageBase {
   constructor()
   {
      super()
   }

   get element()
   {
      let ele = document.createElement('div')
      ele.innerText = "Quiz"
      return ele
   }
}

page = new QuizPage()