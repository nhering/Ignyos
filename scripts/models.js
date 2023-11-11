// These classes are stored in the database
//#region Database Models

// class AccountSubject {

// }

// class Question {

// }

// class Quiz {

// }

// class QuizQuestion {

// }

class AccountSubject {
   constructor(data = {}) {
      this.id = data.hasOwnProperty('id') ? data.id : 0
      this.subjectId = data.hasOwnProperty('subjectId') ? data.subjectId : 0
      this.focusTopicIds = data.hasOwnProperty('focusTopicIds') ? data.focusTopicIds : []
   }
}

class Subject {
   constructor(data = {}) {
      this.id = data.hasOwnProperty('id') ? data.id : 0
      this.title = data.hasOwnProperty('title') ? data.title : ''
      this.deleteDateUTC = data.hasOwnProperty('deleteDateUTC') ? data.deleteDateUTC : null
   }
}

// class Topic {

// }

//#endregion

// These models are shared between the api and the UI
//#region View Models

// class FocusSubject {
//    id = 0
//    title = ''
//    // description = ''
//    correctCount = ''
//    questionCount = 0
//    score = 100
// }

class Quiz {
   // #remainingQuestionIds = []
   // #currentQuestionId = 0
   constructor(data = {})
   {
      if (!data) data = {}
      this.id = data.hasOwnProperty('id') ? data.id : 0
      this.startDateUTC = data.hasOwnProperty('startDateUTC') ? data.startDateUTC : null
      this.completeDateUTC = data.hasOwnProperty('completeDateUTC') ? data.completeDateUTC : null
      this.questions = data.hasOwnProperty('questions') ? data.questions : []
      
      // this.#init()
   }

   // #init()
   // {
   //    this.#remainingQuestionIds = []
   //    this.allIds.forEach(id => this.#remainingQuestionIds.push(id))
   //    this.incorrectIds.forEach(id => { this.#removeAnswered(id) })
   //    this.correctIds.forEach(id => { this.#removeAnswered(id) })
   // }

   // #removeAnswered(id)
   // {
   //    console.log(`#removeAnswered(${id})`)
   //    let i = this.#remainingQuestionIds.indexOf(id)
   //    if (i > -1) this.#remainingQuestionIds.splice(i,1)
   // }

   // answeredCorrectly()
   // {
   //    // this.#removeAnswered(this.#currentQuestionId)
   //    this.correctIds.push(this.#currentQuestionId)
   //    this.#currentQuestionId = 0
   // }

   // answeredIncorrectly()
   // {
   //    // this.#removeAnswered(this.#currentQuestionId)
   //    this.incorrectIds.push(this.#currentQuestionId)
   //    this.#currentQuestionId = 0
   // }

   // get currentQuestionId()
   // {
   //    // console.log('get currentQuestionId')
   //    if (this.#currentQuestionId == 0) {
   //       this.#init()
   //       let i = Math.floor(Math.random() * this.#remainingQuestionIds.length)
   //       // console.log(i)
   //       // console.log(this.#remainingQuestionIds)
   //       this.#currentQuestionId = this.#remainingQuestionIds[i]
   //       // console.log(this.#currentQuestionId)
   //    }
   //    return this.#currentQuestionId
   // }

   // get questionNumber()
   // {
   //    this.#init()
   //    return this.allIds.length - this.#remainingQuestionIds.length + 1
   // }

   // get completed()
   // {
   //    this.#init()
   //    return this.#remainingQuestionIds.length === 0
   // }

   // get score()
   // {
   //    this.#init()
   //    let decimal = this.correctIds.length / this.allIds.length
   //    let int = Math.floor(decimal * 100)
   //    return(`${int}%`)
   // }
}

// class SubjectListItem {
//    Id = 0
//    Title = ''
//    // Description = ''
//    IsFocus = true
//    QuestionCount = 0
// }

// class TopicListItem {
//    Id = 0
//    Title = ''
//    QuestionCount = 0
// }

//#endregion

// These models are only used by the UI
//#region UI Models

// class OpenQuestion {
//    constructor(data = {})
//    {
//       if (!data) data = {}
//       this.subjectId = data.hasOwnProperty('subjectId') ? data.subjectId : 0
//       this.subjectName = data.hasOwnProperty('subjectName') ? data.subjectName : ""
      
//       this.id = data.hasOwnProperty('id') ? data.id : 0
//       this.phrase = data.hasOwnProperty('phrase') ? data.phrase : ""
//       this.answer = data.hasOwnProperty('answer') ? data.answer : ""
//    }

//    // setSubjectName(focusSubjects = [])
//    // {
//    //    try {
//    //       focusSubjects.forEach(fs => {
//    //          if (fs.id === this.subjectId) {
//    //             this.subjectName = fs.title
//    //          }
//    //       })
//    //    } catch (error) {
//    //       console.error(error)
//    //       this.subjectName = "!~!!~!!!~ERROR~!!!~!!~!"
//    //    }
//    // }
// }

//#endregion