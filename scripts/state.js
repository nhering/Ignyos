const pages = {
   FOCUS: "focus",
   HOME: "home",
   QUIZ: "quiz",
   SUBJECT: "subject",
   SETTINGS: "settings",

   valid(page)
   {
      if (
         page === this.FOCUS ||
         page === this.HOME ||
         page === this.QUIZ ||
         page === this.SUBJECT ||
         page === this.SETTINGS
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

      this._currentPage
      this._quiz
      // this._openQuestion
      // this._focusSubjects
      this._accountSubjects
      // this._topicList

      this.getLocal()
   }

   //#region currentPage

   get currentPage()
   {
      try {
         if (!pages.valid(this._currentPage)) {
            this._currentPage = pages.HOME
         }
      } catch (error) {
         console.error(error)
         this._currentPage = pages.HOME
      }
      return this._currentPage
   }

   set currentPage(data)
   {
      try {
         this._currentPage = pages.valid(data) ? data : pages.HOME
      } catch (error) {
         console.error(error)
         this._currentPage = pages.HOME
      }
      this.setLocal()
   }

   //#endregion

   //#region Quiz

   get quiz()
   {
      try {
         if (!this._quiz) this._quiz = new Quiz()
      } catch (error) {
         console.error(error)
         this._quiz = new Quiz()
      }
      return this._quiz
   }

   set quiz(data)
   {
      try {
         this._quiz = data.quizId ? data : new Quiz()
      } catch (error) {
         console.error(error)
         this._quiz = new Quiz()
      }
      this.setLocal()
   }

   //#endregion

   //#region openQuestion

   // get openQuestion()
   // {
   //    try {
   //       if (!this._openQuestion) this._openQuestion = new OpenQuestion()
   //    } catch (error) {
   //       console.error(error)
   //       this._openQuestion = new OpenQuestion()
   //    }
   //    return this._openQuestion
   // }

   // set openQuestion(data)
   // {
   //    try {
   //       this._openQuestion = data.id ? data : new OpenQuestion()
   //    } catch (error) {
   //       console.error(error)
   //       this._openQuestion = new OpenQuestion()
   //    }
   //    this.setLocal()
   // }

   //#endregion

   //#region focusSubjects

   // get focusSubjects()
   // {
   //    try {
   //       if (!this._focusSubjects.length) this._focusSubjects = []
   //    } catch (error) {
   //       console.error(error)
   //       this._focusSubjects = []
   //    }
   //    return this._focusSubjects
   // }

   // set focusSubjects(data)
   // {
   //    try {
   //       this._focusSubjects = data.length ? data : []
   //    } catch (error) {
   //       console.error(error)
   //       this._focusSubjects = []
   //    }
   //    this.setLocal()
   // }

   //#endregion

   //#region accountSubjects

   get accountSubjects()
   {
      try {
         if (!this._accountSubjects) this._accountSubjects = []
      } catch (error) {
         console.error(error)
         this._accountSubjects = []
      }
      return this._accountSubjects
   }

   set accountSubjects(data)
   {
      try {
         this._accountSubjects = data.length ? data : []
         this._accountSubjects.forEach(actSub => {
            actSub.editing = false
            actSub.expanded = false
            actSub.focusTopicIds = JSON.parse(actSub.focusTopicIds)
         });
      } catch (error) {
         console.error(error)
         this._accountSubjects = []
      }
      this.setLocal()
   }

   //#endregion

   //#region

   get actSubEditing()
   {

   }

   set actSubEditing(data)
   {

   }

   //#endregion

   //#region topicList

   // get topicList()
   // {
   //    try {
   //       if (!this._topicList) this._topicList = []
   //    } catch (error) {
   //       console.error(error)
   //       this._topicList = []
   //    }
   //    return this._topicList
   // }

   // set topicList(data)
   // {
   //    try {
   //       this._topicList = data.length ? data : []
   //    } catch (error) {
   //       console.error(error)
   //       this._topicList = []
   //    }
   // }

   //#endregion

   //#region localStorage

   getLocal() {
      let local = localStorage.getItem(this.name)
      if (local == null)
      {
         this._quiz = new Quiz()
         this._accountSubjects = []
      }
      else
      {
         local = JSON.parse(local)
         this._quiz = new Quiz(local.quiz)
         this._currentPage = local.currentPage
         this._accountSubjects = local.accountSubjects
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
         "quiz": ${JSON.stringify(this.quiz)},
         "currentPage": "${this.currentPage}",
         "accountSubjects": ${JSON.stringify(this.accountSubjects)}
      }`
   }

   //#endregion
}
