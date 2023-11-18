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
      this.populateSubjectList()

      // load accountSubject list
      // set the state.accountSubjects list to the returned data
      // load state.accountSubjects into the subject-list element
   },

   //#region Subject Pane
   
   async loadSubjects()
   {
      let response = await api.GET("ignyos/Subject/List")
      let data = app.processApiResponse(response)
      state.accountSubjects = data
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
            this.populateSubjectList()
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
         },`Delete ${acctSub.subject.title}?`)
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

   get topicPane() {
      let ele = document.createElement('div')
      ele.id = 'topic-pane'
      ele.classList.add('pane')
      ele.appendChild(this.getPaneHeader('T O P I C'))
      return ele
   },

   get topicPaneControls() {
      let ele = document.createElement('div')
      ele.id = 'controls'
      return ele
   },

   //#endregion

   //#region Question Pane

   get questionPane() {
      let ele = document.createElement('div')
      ele.id = 'question-pane'
      ele.classList.add('pane')
      ele.appendChild(this.getPaneHeader('Q U E S T I O N'))
      return ele
   },

   get questionPaneControls() {
      let ele = document.createElement('div')
      ele.id = 'controls'
      return ele
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

// class SubjectListPage extends PageBase {
//    constructor() { super() }

//    get element()
//    {
//       let sub = document.createElement('div')
//       sub.id = 'subjects'

//       let ele = document.createElement('div')
//       ele.id = 'page'
//       ele.appendChild(this.header)
//       ele.appendChild(sub)
//       return ele
//    }

//    async load()
//    {
//       this.initSubjectEle()
//       await this.loadSubjects()
//       this.showSubjects()
//    }

//    initSubjectEle() {
//       let sEle = document.getElementById('subjects')
//       sEle.innerHTML = null
//       sEle.classList.add('progress')
//       sEle.setAttribute('style',`max-height:${this.subjectEleHeight}`)
//    }
   
//    async loadSubjects()
//    {
//       let response = await api.GET("ignyos/Subject/List")
//       let data = app.processApiResponse(response)
//       state.accountSubjects = data
//    }

//    //#region Create New Quiz Header

//    get header()
//    {
//       let input = document.createElement('input')
//       input.id = 'new-subject'
//       input.type = 'text'
//       input.placeholder = 'Enter new subject name.'

//       let hdr = document.createElement('div')
//       hdr.id = 'header'
//       hdr.appendChild(input)
//       hdr.appendChild(this.createSubjectButton)
//       return hdr
//    }

//    get createSubjectButton()
//    {
//       let btn = document.createElement('div')
//       btn.classList.add('create-btn')
//       btn.addEventListener('click', async () => {
//          await this.createSubject()
//       })
//       return btn
//    }

//    async createSubject()
//    {
//       let newSubject = document.getElementById('new-subject')
//       let title = newSubject.value.trim()
//       if (title === '') return

//       this.initSubjectEle()
//       let response = await api.POST("ignyos/subject", new Subject({title: title}))
//       let data = app.processApiResponse(response)
//       if (response.hasErrors) return

//       state.accountSubjects.unshift(data)
//       this.showSubjects()
//    }

//    //#endregion

//    //#region Subject List

//    showSubjects()
//    {
//       let sEle = document.getElementById('subjects')
//       sEle.classList.remove('progress')
//       sEle.innerHTML = null
//       sEle.setAttribute('style',`max-height:${this.subjectEleHeight}`)
//       if (state.accountSubjects.length > 0) {
//          state.accountSubjects.forEach(s => {
//             sEle.appendChild(this.subjectLineItem(s))
//          })
//       } else {
//          let div = document.createElement('div')
//          div.classList.add('no-subject-item')
//          div.innerText = 'Add a subject to continue.'
//          sEle.appendChild(div)
//          // show a notice that there are no subjects
//       }
//    }

//    get subjectEleHeight() {
//       let cHeight = document.getElementById('page').clientHeight
//       let hHeight = document.getElementById('header').clientHeight
//       return cHeight - hHeight - 30 // 30 is the 20px padding + 10px gap
//    }

//    subjectLineItem(accountSubject) {
//       let ele = document.createElement('div')
//       ele.classList.add('item')
//       ele.id = accountSubject.id
//       this.addItemChildElements(accountSubject, ele)
//       return ele
//    }

//    addItemChildElements(accountSubject, ele) {
//       ele.appendChild(this.focusIcon(accountSubject))
//       ele.appendChild(this.subjectExpandIcon(accountSubject))
//       if (accountSubject.editing) {
//          ele.appendChild(this.subjectTitle_Edit(accountSubject))
//          ele.appendChild(this.saveSubjectButton(accountSubject))
//          ele.appendChild(this.cancelEditSubjectButton(accountSubject))
//       } else {
//          ele.appendChild(this.subjectTitle(accountSubject))
//          ele.appendChild(this.editSubjectButton(accountSubject))
//          ele.appendChild(this.deleteSubjectButton(accountSubject))
//       }
//    }

//    subjectExpandIcon(accountSubject) {
//       let ele = document.createElement('div')
//       let c = accountSubject.expanded ? 'chevron-down' : 'chevron-right'
//       ele.classList.add(c)
//       ele.addEventListener('click', () => {
//          this.expandSubject(accountSubject.subject.id)
//          this.showSubjects()
//       })
//       return ele
//    }

//    focusIcon(accountSubject) {
//       let chk = document.createElement('div')
//       if (accountSubject.focusTopicIds.count > 0) {
//          chk.classList.add('is-focus')
//       }
//       return chk
//    }

//    expandSubject(id) {
//       state.accountSubjects.forEach(actSub => {
//          if (actSub.subject.id == id) {
//             actSub.expanded = !actSub.expanded
//          } else {
//             actSub.expanded = false
//             actSub.editing = false
//          }
//       })
//    }

//    subjectTitle(accountSubject) {
//       let ele = document.createElement('div')
//       ele.innerText = accountSubject.subject.title
//       return ele
//    }

//    editSubjectButton(accountSubject) {
//       let btn = document.createElement('div')
//       btn.classList.add('edit-btn')
//       btn.addEventListener('click', () => {
//          this.editSubject(accountSubject)
//          this.showSubjects()
//       })
//       return btn
//    }

//    editSubject(accountSubject) {
//       let item = document.getElementById(accountSubject.id)
//       state.accountSubjects.forEach(actSub => {
//          if (actSub.subject.id == accountSubject.subject.id) {
//             actSub.editing = !actSub.editing
//          } else {
//             actSub.editing = false
//          }
//       })
//       item.innerHTML = null
//       this.addItemChildElements(accountSubject, item)
//    }

//    deleteSubjectButton(subject) {
//       let btn = document.createElement('div')
//       btn.classList.add('delete-btn')
//       btn.addEventListener('click', () => {
//          app.confirm(async () => { 
//             await api.DELETE('ignyos/subject', [['id',subject.id]])
//             window.location = window.location.pathname
//          })
//       })      
//       return btn
//    }

//    subjectTitle_Edit(accountSubject) {
//       let ele = document.createElement('input')
//       ele.classList.add('title-edit')
//       ele.type = 'text'
//       ele.id = `act-sub-${accountSubject.subject.id}`
//       ele.value = accountSubject.subject.title
//       ele.addEventListener('keyup', (event) => {
//          if (event.key == 'Enter') {
//             console.log('Enter')
//          } 
//          if (event.key == "Escape" || event.key == 'Enter') {
//             state.accountSubjects.forEach(actSub => {
//                actSub.editing = false
//             })
//             this.showSubjects()
//          }
//       })

//       return ele
//    }

//    saveSubjectButton(accountSubject) {
//       let btn = document.createElement('div')
//       btn.classList.add('save-btn')
//       btn.addEventListener('click', async () => {
//          let newTitle = document.getElementById(`act-sub-${accountSubject.subject.id}`)?.value.trim()
//          if (!newTitle) return
//          accountSubject.subject.title = newTitle
//          await api.POST('ignyos/subject', accountSubject.subject)
//       })    
//       return btn
//    }

//    async saveSubject(accountSubject) {
//       let newTitle = document.getElementById(`act-sub-${accountSubject.subject.id}`)?.value.trim()
//       if (!newTitle) return
//       accountSubject.subject.title = newTitle
//       await api.POST('ignyos/subject', accountSubject.subject)
//    }

//    cancelEditSubjectButton(accountSubject) {
//       let btn = document.createElement('div')
//       btn.classList.add('cancel-btn')
//       // btn.classList.add('save-btn')
//       // btn.addEventListener('click', async () => {
//       //    let newTitle = document.getElementById(`act-sub-${accountSubject.subject.id}`)?.value.trim()
//       //    if (newTitle) return
//       //    accountSubject.subject.title = newTitle
//       //    await api.POST('ignyos/subject', accountSubject.subject)
//       //    window.location = window.location.pathname
//       // })      
//       return btn
//    }

//    cancelEditSubject(accountSubject) {

//    }

//    //#endregion
// }

// page = new SubjectListPage()