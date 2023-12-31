page = {
   get element() {
      let ele = document.createElement('div')
      ele.id = 'page'
      ele.appendChild(this.quizPane)
      return ele
   },

   async load() {
      // if (state.quiz.completeDateUTC) {
      //    await this.loadQuizResults()
      // } else {
         await this.loadNextQuestion()
      // }
   },

   get quizPane() {
      let ele = document.createElement('div')
      ele.id = 'quiz-pane'
      ele.classList.add('without-answer')
      ele.classList.add('without-answer')
      ele.appendChild(this.questionEle)
      ele.appendChild(this.answerEle)
      ele.appendChild(this.questionControls)
      // if (state.quiz.completeDateUTC !== null) {
      //    ele.classList.add('results')
      //    ele.appendChild(this.summaryEle)
      //    ele.appendChild(this.questionListEle)
      // } else {
      //    ele.classList.add('without-answer')
      //    ele.appendChild(this.questionEle)
      //    ele.appendChild(this.answerEle)
      //    ele.appendChild(this.questionControls)
      // }
      return ele
   },

   //#region Quiz Results

   async loadQuizResults() {      
      let pane = document.getElementById('quiz-pane')
      pane.classList.remove('without-answer')
      pane.classList.remove('with-answer')
      pane.classList.add('results')
      pane.innerHTML = null
      document.getElementById('nav').innerHTML = null
      
      let response = await api.GET('ignyos/quiz/results',[['id',state.quiz.id]])
      let questions = app.processApiResponse(response)
      
      pane.appendChild(this.getSummaryEle(questions))
      pane.appendChild(this.getQuestionList(questions))
   },

   getSummaryEle(questions) {
      let count = questions.length
      let correct = 0
      questions.forEach(question => { if (question.correct) correct++ })

      let ele = document.createElement('div')
      ele.id = 'quiz-summary'

      let sEle = document.createElement('div')
      sEle.classList.add('info')
      sEle.innerText = `${correct} out of ${count} correct.`
      ele.appendChild(sEle)
      ele.appendChild(this.closeSummaryButtton)
      return ele
   },

   get closeSummaryButtton() {
      let ele = document.createElement('div')
      ele.classList.add('close')
      ele.innerText = 'X'
      ele.addEventListener('click',async () => await app.route())
      return ele
   },

   getQuestionList(questions) {
      let ele = document.createElement('div')
      ele.id = 'question-list'
      questions.forEach(question => {
         ele.appendChild(this.getQuestionListItem(question))
      })
      return ele
   },

   getQuestionListItem(question) {
      let ele = document.createElement('div')
      ele.classList.add('item')
      if (question.correct) {
         ele.classList.add('correct')
      } else {
         ele.classList.add('incorrect')
      }
      ele.innerText = question.shortPhrase
      return ele
   },

   //#endregion

   //#region Taking Quiz

   async loadNextQuestion() {
      let q = document.getElementById('question')
      q.classList.add('v-loading')
      let id = state.getNextQuestionId()
      let response = await api.GET('ignyos/question',[['id', id]])
      let data = app.processApiResponse(response)
      state.question = data
      q.classList.remove('v-loading')
      q.innerText = state.question.phrase
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
      let qp = document.getElementById('quiz-pane')
      qp.classList.remove('without-answer')
      qp.classList.add('with-answer')
      document.getElementById('answer').innerText = state.question.answer
   },
   
   get correctBtn() {
      let ele = document.createElement('div')
      ele.classList.add('correct')
      ele.classList.add('btn')
      ele.innerText = 'Correct'
      ele.addEventListener('click', async () => {
         await this.submitAnswer(true)
      })
      return ele
   },
   
   get incorrectBtn() {
      let ele = document.createElement('div')
      ele.classList.add('incorrect')
      ele.classList.add('btn')
      ele.innerText = 'Incorrect'
      ele.addEventListener('click', async () => {
         await this.submitAnswer(false)
      })
      return ele
   },

   async submitAnswer(correct) {
      let body = {
         questionId: state.question.id,
         quizId: state.quiz.id,
         answeredCorrectly: correct
      }
      let response = await api.POST('ignyos/quiz/answer',body)
      let data = app.processApiResponse(response)
      state.quiz = data
      state.question = { id: 0, shortPhrase: null , phrase: null, answer: null }
      if (state.quiz.completeDateUTC !== null) {
         await this.loadQuizResults()
      } else {
         await app.route()
      }
      // await app.route()
   },

   //#endregion

   async quitQuiz() {
      app.confirm(async () => {
         let response = await api.PUT('ignyos/quiz/quit',{},[[state.quiz.id]])
         let data = app.processApiResponse(response)
         if (data == false) {
            state.quiz = {id: 0, startDateUTC: null, allQuestionIds: [], answeredQuestionIds: []}
            messageCenter.addInfo('There may have been an error while quitting this quiz.')
            setTimeout(async () => { await app.route() },5000)
         } else {
            state.quiz = {id: 0, startDateUTC: null, allQuestionIds: [], answeredQuestionIds: []}
            await app.route()
         }},
         'Really?\n\nYou want to quit?')
   }
}