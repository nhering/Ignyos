const pages = {
   HOME: "Home",
   MATERIAL: "Material",
   QUIZ: "Quiz",
   SETTINGS: "Settings",
   STATS: "Stats",

   isValid(page)
   {
      if (
         page === this.HOME ||
         page === this.MATERIAL ||
         page === this.QUIZ ||
         page === this.SETTINGS ||
         page === this.STATS
      ) {
         return true
      } else {
         return false
      }
   }
}

class State {
   constructor(siteName) {
      this.name = siteName
      this.getLocal()
   }

   //#region Current Page

   _currentPage
   get currentPage() {
      if (!pages.isValid(this._currentPage)) {
         this._currentPage = pages.HOME
      }
      return this._currentPage
   }
   set currentPage(data) {
      if (pages.isValid(data)) {
         this._currentPage = data
      }
      this.setLocal()
   }

   //#endregion

   //#region Quiz

   _quiz = new Quiz()
   get quiz()
   {
      if (!this._quiz) this._quiz = new Quiz()
      return this._quiz
   }
   set quiz(data)
   {
      this._quiz = data.quizId ? data : new Quiz()
      this.setLocal()
   }

   //#endregion

   //#region AccountSubjects

   _selectedSubjectId = 0
   get selectedSubjectId() {
      return this._selectedSubjectId
   }
   set selectedSubjectId(id) {
      if (this._selectedSubjectId == id) return
      this._selectedSubjectId = id
      this.selectedTopicId = 0
   }

   _accountSubjects = []
   get accountSubjects()
   {
      if (!this._accountSubjects) this._accountSubjects = []
      return this._accountSubjects
   }
   set accountSubjects(data)
   {
      this._accountSubjects = data.length ? data : []
      this._accountSubjects.forEach(actSub => {
         actSub.focusTopicIds = JSON.parse(actSub.focusTopicIds)
      });
      this.accountSubjects.sort((a,b) => {
         return a.subject.title.localeCompare(b.subject.title)
      })
      this.setLocal()
   }

   addNewAccountSubject(data) {
      this.selectedSubjectId = data.subject.id
      this.accountSubjects.push(data)
      this.accountSubjects.sort((a,b) => {
         return a.subject.title.localeCompare(b.subject.title)
      })
      this.setLocal()
   }

   updateAccountSubject(data) {
      this.selectedSubjectId = data.subject.id
      let i = this.accountSubjects.findIndex((e) => {
         e.subject.id == data.subject.id
      })
      this.accountSubjects[i] = data
      this.accountSubjects.sort((a,b) => {
         return a.subject.title.localeCompare(b.subject.title)
      })
      this.setLocal()
   }

   deleteAccountSubject(data) {
      this.selectedSubjectId = 0
      let i = this.accountSubjects.findIndex((e) => {
         e.subject.id == data.subject.id
      })
      this.accountSubjects.splice(i,1)
      this.setLocal()
   }

   //#endregion

   //#region Topics

   _selectedTopicId = 0
   get selectedTopicId() {
      return this._selectedTopicId
   }
   set selectedTopicId(id) {
      if (this._selectedTopicId == id) return
      this._selectedTopicId = id
   }

   _topics = []
   get topics()
   {
      if (!this._topics) this._topics = []
      return this._topics
   }
   set topics(data)
   {
      this._topics = data.length ? data : []
      this.setLocal()
   }

   addNewTopic(data) {
      this.selectedTopicId = data.id
      this.topics.push(data)
      this.topics.sort((a,b) => {
         return a.title.localeCompare(b.title)
      })
      this.setLocal()
   }

   updateTopic(data) {
      this.selectedTopicId = data.id
      let i = this.topics.findIndex((e) => {
         e.id == data.id
      })
      this.topics[i] = data
      this.topics.sort((a,b) => {
         return a.title.localeCompare(b.title)
      })
      this.setLocal()
   }

   deleteTopic(data) {
      this.selectedTopicId = 0
      let i = this.topics.findIndex((e) => {
         e.id == data.id
      })
      this.topics.splice(i,1)
      this.setLocal()
   }

   //#endregion

   //#region Questions

   _selectedQuestionId = 0
   get selectedQuestionId() {
      return this._selectedQuestionId
   }
   set selectedQuestionId(id) {
      if (this._selectedQuestionId == id) return
      this._selectedQuestionId = id
   }

   _questions = []
   get questions()
   {
      if (!this._questions) this._questions = []
      return this._questions
   }
   set questions(data)
   {
      this._questions = data.length ? data : []
      this.setLocal()
   }

   addQuestion(data) {
      this.selectedQuestionId = data.id
      this.questions.push(data)
      this.questions.sort((a,b) => {
         return a.shortPhrase.localeCompare(b.shortPhrase)
      })
      this.setLocal()
   }

   updateQuestion(data) {
      this.selectedQuestionId = data.id
      let i = this.questions.findIndex((e) => {
         e.id == data.id
      })
      this.questions[i] = data
      this.questions.sort((a,b) => {
         return a.shortPhrase.localeCompare(b.shortPhrase)
      })
      this.setLocal()
   }

   deleteQuestion(data) {
      this.selectedQuestionId = 0
      let i = this.questions.findIndex((e) => {
         e.id == data.id
      })
      this.questions.splice(i,1)
      this.setLocal()
   }

   //#endregion

   //#region Browser Local Storage

   getLocal() {
      let local = localStorage.getItem(this.name)
      if (local == null)
      {
         this._currentPage = pages.HOME
         this._quiz = new Quiz()
         this._selectedSubjectId = 0
         this._accountSubjects = []
         this._selectedTopicId = 0
         this._topics = []
         this._selectedQuestionId = 0
         this._questions = []
      }
      else
      {
         local = JSON.parse(local)
         this._currentPage = local.currentPage
         this._quiz = new Quiz(local.quiz)
         this._selectedSubjectId = local.selectedSubjectId
         this._accountSubjects = local.accountSubjects
         this._selectedTopicId = local.selectedTopicId
         this._topics = local.topics
         this._selectedQuestionId = local.selectedQuestionId
         this._questions = local.questions
      }
      this.setLocal()
   }

   setLocal()
   {
      localStorage.setItem(this.name,this.toJson())
   }

   toJson()
   {
      return `{
         "currentPage": "${this.currentPage}",
         "quiz": ${JSON.stringify(this.quiz)},
         "selectedSubjectId": "${this.selectedSubjectId}",
         "accountSubjects": ${JSON.stringify(this.accountSubjects)},
         "selectedTopicId": "${this.selectedTopicId}",
         "topics": ${JSON.stringify(this.topics)},
         "selectedQuestionId": "${this.selectedQuestionId}",
         "questions": ${JSON.stringify(this.questions)}
      }`
   }

   //#endregion
}
