page = {
   get element() {
      let ele = document.createElement('div')
      ele.id = 'page'
      ele.appendChild(this.subjectPane)
      ele.appendChild(this.topicPane)
      ele.appendChild(this.questionPane)
      return ele
   },

   async load() {
      await this.loadSubjects()
      await this.loadTopics()
      await this.loadQuestions()
   },

   //#region Subject Pane
   
   async loadSubjects()
   {
      let response = await api.GET("ignyos/Subject/List")
      let data = app.processApiResponse(response)
      state.accountSubjects = data
      this.populateSubjectList()
   },

   get subjectPane() {
      let ele = document.createElement('div')
      ele.id = 'subject-pane'
      ele.classList.add('pane')
      ele.appendChild(this.getPaneHeader('S U B J E C T'))
      ele.appendChild(this.subjectPaneControls)
      ele.appendChild(this.subjectList)
      return ele
   },

   get subjectPaneControls() {
      let ele = document.createElement('div')
      ele.classList.add('controls')
      ele.appendChild(this.newSubjectControl)
      return ele
   },

   get newSubjectControl() {
      let ele = document.createElement('div')
      ele.id = 'new-subject-control'
      ele.appendChild(this.newSubjectInput)
      ele.appendChild(this.newSubjectButton)
      return ele
   },

   get newSubjectInput() {
      let input = document.createElement('input')
      input.type = 'text'
      input.placeholder = 'New Subject'
      input.spellcheck = false
      input.id = 'new-subject'
      input.classList.add('new-subject')
      input.addEventListener('keyup',async (event) => {
         if (event.key == 'Enter') {
            await this.createNewSubject()
         } else if (event.key == 'Escape') {
            document.getElementById('new-subject').value = ''
         }
      })
      return input
   },

   get newSubjectButton() {
      let btn = document.createElement('div')
      btn.classList.add('btn')
      btn.classList.add('plus')
      btn.addEventListener('click', async () => {
         await this.createNewSubject()
      })
      return btn
   },

   async createNewSubject() {
      let val = document.getElementById('new-subject').value.trim()
      if (val == '') return
      let response = await api.POST('ignyos/subject', { title: val })
      let data = app.processApiResponse(response)
      state.addNewAccountSubject(data)
      app.route()
   },

   get subjectList() {
      let ele = document.createElement('div')
      ele.id = 'subject-list'
      ele.classList.add('v-loading')
      return ele
   },

   populateSubjectList() {
      let subList = document.getElementById('subject-list')
      subList.innerHTML = null
      subList.classList.remove('v-loading')
      state.accountSubjects.forEach(aSub => {
         subList.appendChild(this.subjectListItem(aSub))
      })
   },

   subjectListItem(acctSub) {
      console.log(acctSub)
      let ele = document.createElement('div')
      ele.id = `sub-${acctSub.subject.id}`
      ele.innerText = acctSub.subject.title
      if (state.selectedSubjectId == acctSub.subject.id) {
         ele.classList.add('item-selected')
         ele.appendChild(this.editAcctSubBtn(acctSub))
         ele.appendChild(this.deleteAcctSubBtn(acctSub))
      } else {
         ele.classList.add('item')
         ele.addEventListener('click', async () => {
            state.selectedSubjectId = acctSub.subject.id
            // this.populateSubjectList()
            await app.route()
         })
      }
      return ele
   },

   editAcctSubBtn(acctSub) {
      let ele = document.createElement('div')
      ele.classList.add('edit')
      ele.addEventListener('click', () => {
         let item = document.getElementById(`sub-${acctSub.subject.id}`)
         let edit = this.subjectListItemEditing(acctSub)
         item.replaceWith(edit)
         document.getElementById('edit-subject').focus()
      })
      return ele
   },

   deleteAcctSubBtn(acctSub) {
      let ele = document.createElement('div')
      ele.classList.add('trash')
      ele.addEventListener('click', () => {
         app.confirm(async () => {
            await this.deleteSubject(acctSub)
         },`Delete "${acctSub.subject.title}"?`)
      })
      return ele
   },

   async deleteSubject(acctSub) {
      let response = await api.DELETE('ignyos/subject', [["id",acctSub.subject.id]])
      let data = app.processApiResponse(response)
      if (data) state.deleteAccountSubject(acctSub)
      await app.route()
   },

   subjectListItemEditing(acctSub) {
      let ele = document.createElement('div')
      ele.id = `sub-${acctSub.subject.id}`
      ele.classList.add('item-editing')
      ele.appendChild(this.getEditSubjectInput(acctSub))
      ele.appendChild(this.getEditSubjectButton(acctSub))
      return ele
   },

   getEditSubjectInput(acctSub) {
      let input = document.createElement('input')
      input.type = 'text'
      input.spellcheck = false
      input.placeholder = 'A title is required!'
      input.value = acctSub.subject.title
      input.id = 'edit-subject'
      input.classList.add('edit-subject')
      input.addEventListener('keyup',async (event) => {
         if (event.key == 'Enter') {
            await this.editSubject(acctSub)
         } else if (event.key == 'Escape') {
            await app.route()
         }
      })
      return input
   },

   getEditSubjectButton(acctSub) {
      let btn = document.createElement('div')
      btn.classList.add('btn')
      btn.classList.add('check')
      btn.addEventListener('click', async () => {
         await this.editSubject(acctSub)
      })
      return btn
   },

   async editSubject(acctSub) {
      let val = document.getElementById('edit-subject').value.trim()
      if (val == '') return
      acctSub.subject.title = val
      let response = await api.PUT('ignyos/subject', acctSub.subject)
      let data = app.processApiResponse(response)
      state.updateAccountSubject(data)
      await app.route()
   },

   //#endregion

   //#region Topic Pane
   
   async loadTopics()
   {
      if (state.selectedSubjectId == "0") return
      let response = await api.GET("ignyos/Topic/List",[['subjectId',state.selectedSubjectId]])
      let data = app.processApiResponse(response)
      state.topics = data
      this.populateTopicList()
   },

   get topicPane() {
      let ele = document.createElement('div')
      ele.id = 'topic-pane'
      ele.classList.add('pane')
      ele.appendChild(this.getPaneHeader('T O P I C'))
      if (state.selectedSubjectId != 0) {
         ele.appendChild(this.topicPaneControls)
         ele.appendChild(this.topicList)
      }
      return ele
   },

   get topicPaneControls() {
      let ele = document.createElement('div')
      ele.classList.add('controls')
      ele.appendChild(this.newTopicControl)
      return ele
   },

   get newTopicControl() {
      let ele = document.createElement('div')
      ele.id = 'new-topic-control'
      ele.appendChild(this.newTopicInput)
      ele.appendChild(this.newTopicButton)
      return ele
   },

   get newTopicInput() {
      let input = document.createElement('input')
      input.type = 'text'
      input.placeholder = 'New Topic'
      input.spellcheck = false
      input.id = 'new-topic'
      input.classList.add('new-topic')
      input.addEventListener('keyup',async (event) => {
         if (event.key == 'Enter') {
            await this.createNewTopic()
         } else if (event.key == 'Escape') {
            document.getElementById('new-topic').value = ''
         }
      })
      return input
   },

   get newTopicButton() {
      let btn = document.createElement('div')
      btn.classList.add('btn')
      btn.classList.add('plus')
      btn.addEventListener('click', async () => {
         await this.createNewTopic()
      })
      return btn
   },

   async createNewTopic() {
      let val = document.getElementById('new-topic').value.trim()
      if (val == '') return
      let response = await api.POST('ignyos/topic', { subjectId: state.selectedSubjectId, title: val })
      let data = app.processApiResponse(response)
      state.addNewTopic(data)
      app.route()
   },

   get topicList() {
      let ele = document.createElement('div')
      ele.id = 'topic-list'
      ele.classList.add('v-loading')
      return ele
   },

   populateTopicList() {
      let topicList = document.getElementById('topic-list')
      topicList.innerHTML = null
      topicList.classList.remove('v-loading')
      state.topics.forEach(topic => {
         topicList.appendChild(this.topicListItem(topic))
      })
   },

   topicListItem(topic) {
      let ele = document.createElement('div')
      ele.id = `top-${topic.id}`
      ele.innerText = topic.title
      if (state.selectedTopicId == topic.id) {
         ele.classList.add('item-selected')
         ele.appendChild(this.editTopicBtn(topic))
         ele.appendChild(this.deleteTopicBtn(topic))
      } else {
         ele.classList.add('item')
         ele.addEventListener('click', async () => {
            state.selectedTopicId = topic.id
            await app.route()
         })
      }
      return ele
   },

   editTopicBtn(topic) {
      let ele = document.createElement('div')
      ele.classList.add('edit')
      ele.addEventListener('click', () => {
         let item = document.getElementById(`top-${topic.id}`)
         let edit = this.topictListItemEditing(topic)
         item.replaceWith(edit)
         document.getElementById('edit-topic').focus()
      })
      return ele
   },

   deleteTopicBtn(topic) {
      let ele = document.createElement('div')
      ele.classList.add('trash')
      ele.addEventListener('click', () => {
         app.confirm(async () => {
            await this.deleteTopic(topic)
         },`Delete "${topic.title}"?`)
      })
      return ele
   },

   async deleteTopic(topic) {
      let response = await api.DELETE('ignyos/Topic', [["topicId",topic.id],["subjectId",state.selectedSubjectId]])
      let data = app.processApiResponse(response)
      if (data) state.deleteTopic(topic)
      await app.route()
   },

   topictListItemEditing(topic) {
      let ele = document.createElement('div')
      ele.id = `top-${topic.id}`
      ele.classList.add('item-editing')
      ele.appendChild(this.getEditTopicInput(topic))
      ele.appendChild(this.getEditTopicButton(topic))
      return ele
   },

   getEditTopicInput(topic) {
      let input = document.createElement('input')
      input.type = 'text'
      input.spellcheck = false
      input.placeholder = 'A title is required!'
      input.value = topic.title
      input.id = 'edit-topic'
      input.classList.add('edit-topic')
      input.addEventListener('keyup',async (event) => {
         if (event.key == 'Enter') {
            await this.editTopic(topic)
         } else if (event.key == 'Escape') {
            await app.route()
         }
      })
      return input
   },

   getEditTopicButton(topic) {
      let btn = document.createElement('div')
      btn.classList.add('btn')
      btn.classList.add('check')
      btn.addEventListener('click', async () => {
         await this.editTopic(topic)
      })
      return btn
   },

   async editTopic(topic) {
      let val = document.getElementById('edit-topic').value.trim()
      if (val == '') return
      topic.title = val
      let response = await api.PUT('ignyos/topic', topic)
      let data = app.processApiResponse(response)
      state.updateTopic(data)
      await app.route()
   },

   //#endregion

   //#region Question Pane
   
   async loadQuestions()
   {
      if (state.selectedTopicId == "0") return
      let response = await api.GET("ignyos/Question/List",[['topicId',state.selectedTopicId]])
      let data = app.processApiResponse(response)
      state.topics = data
      this.populateQuestionList()
   },

   get questionPane() {
      let ele = document.createElement('div')
      ele.id = 'question-pane'
      ele.classList.add('pane')
      ele.appendChild(this.getPaneHeader('Q U E S T I O N'))
      if (state.selectedTopicId != 0) {
         ele.appendChild(this.questionPaneControls)
         ele.appendChild(this.questionList)
      }
      return ele
   },

   get questionPaneControls() {
      let ele = document.createElement('div')
      ele.classList.add('controls')
      ele.appendChild(this.newQuestionControl)
      return ele
   },

   get newQuestionControl() {
      let ele = document.createElement('div')
      ele.id = 'new-question-control'
      ele.appendChild(this.newQuestionInput)
      ele.appendChild(this.newQuestionButton)
      return ele
   },

   get newQuestionInput() {
      let input = document.createElement('input')
      input.type = 'text'
      input.placeholder = 'New Question'
      input.spellcheck = false
      input.id = 'new-question'
      input.classList.add('new-question')
      input.addEventListener('keyup',async (event) => {
         if (event.key == 'Enter') {
            await this.createNewQuestion()
         } else if (event.key == 'Escape') {
            document.getElementById('new-question').value = ''
         }
      })
      return input
   },

   get newQuestionButton() {
      let btn = document.createElement('div')
      btn.classList.add('btn')
      btn.classList.add('plus')
      btn.addEventListener('click', async () => {
         await this.createNewQuestion()
      })
      return btn
   },

   async createNewQuestion() {
      let val = document.getElementById('new-question').value.trim()
      if (val == '') return
      let response = await api.POST('ignyos/question', { topicId: state.selectedTopicId, shortPhrase: val })
      let data = app.processApiResponse(response)
      state.addQuestion(data)
      app.route()
   },

   get questionList() {
      let ele = document.createElement('div')
      ele.id = 'question-list'
      ele.classList.add('v-loading')
      return ele
   },

   populateQuestionList() {
      let questionList = document.getElementById('question-list')
      questionList.innerHTML = null
      questionList.classList.remove('v-loading')
      state.questions.forEach(question => {
         questionList.appendChild(this.questionListItem(question))
      })
   },

   questionListItem(question) {
      let ele = document.createElement('div')
      ele.id = `que-${question.id}`
      ele.innerText = question.shortPhrase
      if (state.selectedQuestionId == question.id) {
         ele.classList.add('item-selected')
         ele.appendChild(this.editQuestionBtn(question))
         ele.appendChild(this.deleteQuestionBtn(question))
      } else {
         ele.classList.add('item')
         ele.addEventListener('click', async () => {
            state.selectedQuestionId = question.id
            await app.route()
         })
      }
      return ele
   },

   editQuestionBtn(question) {
      let ele = document.createElement('div')
      ele.classList.add('edit')
      ele.addEventListener('click', () => {
         let item = document.getElementById(`que-${question.id}`)
         // TODO 
         // - call to api to get the question
         // - open a modal with the edit question form
      })
      return ele
   },

   deleteQuestionBtn(question) {
      let ele = document.createElement('div')
      ele.classList.add('trash')
      ele.addEventListener('click', () => {
         app.confirm(async () => {
            await this.deleteQuestion(question)
         },`Delete "${question.shortPhrase}"?`)
      })
      return ele
   },

   async deleteQuestion(question) {
      let response = await api.DELETE('ignyos/Question', [["id",question.id]])
      let data = app.processApiResponse(response)
      if (data) state.deleteTopic(question)
      await app.route()
   },

   //#endregion

   getPaneHeader(name) {
      let ele = document.createElement('div')
      ele.classList.add('header')

      let left = document.createElement('div')
      left.classList.add('left-line')
      ele.appendChild(left)

      let txt = document.createElement('div')
      txt.classList.add('txt')
      txt.innerText = name
      ele.appendChild(txt)

      let right = document.createElement('div')
      right.classList.add('right-line')
      ele.appendChild(right)

      return ele
   },
}