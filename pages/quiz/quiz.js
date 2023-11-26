page = {
   get element() {
      let ele = document.createElement('div')
      ele.id = 'page'
      ele.appendChild(this.quizPane)
      return ele
   },

   async load() {
      if (state.question.id == 0) {
         let q = document.getElementById('question')
         q.classList.add('v-loading')

         let id = state.getNextQuestionId()
         let response = await api.GET('ignyos/question',[['id', id]])
         let data = app.processApiResponse(response)
         state.question = data
         q.innerText = state.question.phrase
         document.getElementById('answer').innerText = state.question.answer

         q.classList.remove('v-loading')
      }
   },

   async quitQuiz() {
      app.confirm(async () => {
         let response = await api.PUT('ignyos/quiz/quit', state.quiz.toJson())
         let data = app.processApiResponse(response)
         if (data == false) app.showInfo('There may have been an error while quitting this quiz.')
         state.quiz = {}
         await app.route()
      },'Really?\n\nYou want to quit?')
   },

   get quizPane() {
      let ele = document.createElement('div')
      ele.id = 'question-pane'
      ele.classList.add('without-answer')
      ele.appendChild(this.questionEle)
      ele.appendChild(this.answerEle)
      ele.appendChild(this.questionControls)
      return ele
   },

   get questionEle() {
      let ele = document.createElement('div')
      ele.id = 'question'
      ele.classList.add('info')
      ele.innerText = state.question.phrase
      return ele
   },

   get answerEle() {
      let ele = document.createElement('div')
      ele.id = 'answer'
      ele.classList.add('info')
      ele.innerText = state.question.answer
      return ele
   },

   get questionControls() {
      let ele = document.createElement('div')
      ele.id = 'controls'
      ele.appendChild(this.correctBtn)
      ele.appendChild(this.incorrectBtn)
      return ele
   },

   showAnswer() {
      let qp = document.getElementById('question-pane')
      qp.classList.remove('without-answer')
      qp.classList.add('with-answer')
   },
   
   get correctBtn() {
      let ele = document.createElement('div')
      ele.classList.add('correct')
      ele.classList.add('btn')
      ele.innerText = 'Correct'
      ele.addEventListener('click', async () => {
         this.submitAnswer(true)
      })
      return ele
   },
   
   get incorrectBtn() {
      let ele = document.createElement('div')
      ele.classList.add('incorrect')
      ele.classList.add('btn')
      ele.innerText = 'Incorrect'
      ele.addEventListener('click', async () => {
         this.submitAnswer(false)
      })
      return ele
   },

   async submitAnswer(correct) {
      let body = {
         questionId: state.question.id,
         answeredCorrectly: correct
      }
      let response = api.POST('ignyos/quiz/answer',body)
      let data = app.processApiResponse(response)
      if (data == false) app.showInfo('There may have been an error while submitting that answer.')
      state.quiz.answeredQuestionIds.push(state.question.id)
      state.question = {}
      api.PUT('ignyos/quiz', state.quiz.toJson())
      await app.route()
   }
}