class FocusPage extends PageBase {
   constructor() { super() }

   get element()
   {
      let hdr = document.createElement('div')
      hdr.id = 'header'
      hdr.classList.add('progress')
      
      let sub = document.createElement('div')
      sub.id = 'subjects'

      let ele = document.createElement('div')
      ele.id = 'page'
      ele.appendChild(hdr)
      ele.appendChild(sub)
      return ele
   }

   async load()
   {
      this.initSubjectEle()
      // await this.loadOpenQuiz()
      // await this.loadFocusSubjects()
      
      document.getElementById('header').classList.remove('progress')
      this.showFocusSubjects()
      if (state.quiz.quizId == 0)
      {
          this.showCreateQuizHeader()
         //  state.openQuestion = new OpenQuestion()
      } else {
          this.showOpenQuizHeader()
      }
   }

   async loadOpenQuiz()
   {
      let response = await api.GET('ignyos/OpenQuiz')
      let data = app.processApiResponse(response)
      state.quiz = new Quiz(data)
   }

   async loadFocusSubjects()
   {
      let response = await api.GET("ignyos/Subject/Focus/List")
      let data = app.processApiResponse(response)
      state.focusSubjects = data
   }

   //#region Create New Quiz Header

   showCreateQuizHeader()
   {
      let hdr = document.getElementById('header')
      hdr.innerHTML = null
      let msg = document.createElement('div')
      if (state.focusSubjects.length == 0) {
         msg.innerText = 'Select at least one focus subject to begin.'
      } else {
         msg.innerText = 'Take a quiz based on the focus subjects.'
      }
      hdr.appendChild(this.createQuizButton)
      hdr.appendChild(msg)
   }

   get createQuizButton()
   {
      let btn = document.createElement('div')
      btn.classList.add('go-btn')
      if (state.focusSubjects.length == 0) {
         btn.classList.add('disable')
      } else {
         btn.addEventListener('click', this.createQuiz)
      }
      btn.innerText = "Quiz me!"
      return btn
   }

   async createQuiz()
   {
      // TODO: get all the focus subject ids
      let subjectIds = []
      let response = await api.POST('ignyos/Quiz', subjectIds)
      let data = app.processApiResponse(response)
      state.quiz = new Quiz(data)
      window.location = window.location.pathname
   }

   //#endregion

   //#region Continue Open Quiz Header

   showOpenQuizHeader()
   {
      let hdr = document.getElementById('header')
      hdr.innerHTML = null
      let msg = document.createElement('div')
      msg.innerText = `You started a quiz ${state.quiz.elapsedDays} day(s) ago.`

      hdr.appendChild(this.continueQuizButton)
      hdr.appendChild(msg)
      hdr.appendChild(this.closeQuizButton)
   }

   get continueQuizButton()
   {
      let btn = document.createElement('div')
      btn.classList.add('go-btn')
      btn.addEventListener('click', this.continueQuiz)
      btn.innerText = "Continue"
      return btn
   }

   get closeQuizButton()
   {
      let btn = document.createElement('div')
      btn.classList.add('x-btn')
      btn.addEventListener('click', this.closeQuiz)
      btn.innerText = "Close It"
      return btn
   }

   continueQuiz()
   {
      state.currentPage = pages.QUIZ
      window.location = window.location.pathname
   }

   async closeQuiz()
   {
      let response = await api.PUT('ignyos/Quiz/Complete', {}, [['id',state.quiz.quizId]])
      let data = app.processApiResponse(response)
      if (data) {
         window.location = window.location.pathname
      }
   }

   //#endregion

   //#region Focus Subject List

   initSubjectEle() {
      let sEle = document.getElementById('subjects')
      sEle.classList.add('progress')
      sEle.setAttribute('style',`max-height:${this.subjectEleHeight}`)
   }

   get subjectEleHeight() {
      let cHeight = document.getElementById('page').clientHeight
      let hHeight = document.getElementById('header').clientHeight
      return cHeight - hHeight - 30 // 30 is the 20px padding + 10px gap
   }

   showFocusSubjects()
   {
      document.getElementById('subjects').classList.remove('progress')
      // state.focusSubjects.forEach(focusSubject => {

      // })
   }

   getFocusSubjectItem(focusSubject)
   {
      let ele = document.createElement('div')
      ele.dataset.focusSubject = focusSubject
      /**
       FocusSubject {
   Id = 0
   Title = ''
   CorrectCount = ''
   QuestionCount = 0
   Score = 100
}
       */
   }

   //#endregion
}

page = new FocusPage()