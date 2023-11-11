class SubjectListPage extends PageBase {
   constructor() { super() }

   get element()
   {
      let sub = document.createElement('div')
      sub.id = 'subjects'

      let ele = document.createElement('div')
      ele.id = 'page'
      ele.appendChild(this.header)
      ele.appendChild(sub)
      return ele
   }

   async load()
   {
      this.initSubjectEle()
      await this.loadSubjects()
      this.showSubjects()
   }

   initSubjectEle() {
      let sEle = document.getElementById('subjects')
      sEle.innerHTML = null
      sEle.classList.add('progress')
      sEle.setAttribute('style',`max-height:${this.subjectEleHeight}`)
   }
   
   async loadSubjects()
   {
      let response = await api.GET("ignyos/Subject/List")
      let data = app.processApiResponse(response)
      state.accountSubjects = data
   }

   //#region Create New Quiz Header

   get header()
   {
      let input = document.createElement('input')
      input.id = 'new-subject'
      input.type = 'text'
      input.placeholder = 'Enter new subject name.'

      let hdr = document.createElement('div')
      hdr.id = 'header'
      hdr.appendChild(input)
      hdr.appendChild(this.createSubjectButton)
      return hdr
   }

   get createSubjectButton()
   {
      let btn = document.createElement('div')
      btn.classList.add('create-btn')
      btn.addEventListener('click', async () => {
         await this.createSubject()
      })
      return btn
   }

   async createSubject()
   {
      let newSubject = document.getElementById('new-subject')
      let title = newSubject.value.trim()
      if (title === '') return

      this.initSubjectEle()
      let response = await api.POST("ignyos/subject", new Subject({title: title}))
      let data = app.processApiResponse(response)
      if (response.hasErrors) return

      state.accountSubjects.unshift(data)
      this.showSubjects()
   }

   //#endregion

   //#region Subject List

   showSubjects()
   {
      let sEle = document.getElementById('subjects')
      sEle.classList.remove('progress')
      sEle.innerHTML = null
      sEle.setAttribute('style',`max-height:${this.subjectEleHeight}`)
      if (state.accountSubjects.length > 0) {
         state.accountSubjects.forEach(s => {
            sEle.appendChild(this.subjectLineItem(s))
         })
      } else {
         let div = document.createElement('div')
         div.classList.add('no-subject-item')
         div.innerText = 'Add a subject to continue.'
         sEle.appendChild(div)
         // show a notice that there are no subjects
      }
   }

   get subjectEleHeight() {
      let cHeight = document.getElementById('page').clientHeight
      let hHeight = document.getElementById('header').clientHeight
      return cHeight - hHeight - 30 // 30 is the 20px padding + 10px gap
   }

   subjectLineItem(accountSubject) {
      let ele = document.createElement('div')
      ele.classList.add('item')
      ele.id = accountSubject.id
      this.addItemChildElements(accountSubject, ele)
      return ele
   }

   addItemChildElements(accountSubject, ele) {
      ele.appendChild(this.focusIcon(accountSubject))
      ele.appendChild(this.subjectExpandIcon(accountSubject))
      if (accountSubject.editing) {
         ele.appendChild(this.subjectTitle_Edit(accountSubject))
         ele.appendChild(this.saveSubjectButton(accountSubject))
         ele.appendChild(this.cancelEditSubjectButton(accountSubject))
      } else {
         ele.appendChild(this.subjectTitle(accountSubject))
         ele.appendChild(this.editSubjectButton(accountSubject))
         ele.appendChild(this.deleteSubjectButton(accountSubject))
      }
   }

   subjectExpandIcon(accountSubject) {
      let ele = document.createElement('div')
      let c = accountSubject.expanded ? 'chevron-down' : 'chevron-right'
      ele.classList.add(c)
      ele.addEventListener('click', () => {
         this.expandSubject(accountSubject.subject.id)
         this.showSubjects()
      })
      return ele
   }

   focusIcon(accountSubject) {
      let chk = document.createElement('div')
      if (accountSubject.focusTopicIds.count > 0) {
         chk.classList.add('is-focus')
      }
      return chk
   }

   expandSubject(id) {
      state.accountSubjects.forEach(actSub => {
         if (actSub.subject.id == id) {
            actSub.expanded = !actSub.expanded
         } else {
            actSub.expanded = false
            actSub.editing = false
         }
      })
   }

   subjectTitle(accountSubject) {
      let ele = document.createElement('div')
      ele.innerText = accountSubject.subject.title
      return ele
   }

   editSubjectButton(accountSubject) {
      let btn = document.createElement('div')
      btn.classList.add('edit-btn')
      btn.addEventListener('click', () => {
         this.editSubject(accountSubject)
         this.showSubjects()
      })
      return btn
   }

   editSubject(accountSubject) {
      let item = document.getElementById(accountSubject.id)
      state.accountSubjects.forEach(actSub => {
         if (actSub.subject.id == accountSubject.subject.id) {
            actSub.editing = !actSub.editing
         } else {
            actSub.editing = false
         }
      })
      item.innerHTML = null
      this.addItemChildElements(accountSubject, item)
   }

   deleteSubjectButton(subject) {
      let btn = document.createElement('div')
      btn.classList.add('delete-btn')
      btn.addEventListener('click', () => {
         app.confirm(async () => { 
            await api.DELETE('ignyos/subject', [['id',subject.id]])
            window.location = window.location.pathname
         })
      })      
      return btn
   }

   subjectTitle_Edit(accountSubject) {
      let ele = document.createElement('input')
      ele.classList.add('title-edit')
      ele.type = 'text'
      ele.id = `act-sub-${accountSubject.subject.id}`
      ele.value = accountSubject.subject.title
      ele.addEventListener('keyup', (event) => {
         if (event.key == 'Enter') {
            console.log('Enter')
         } 
         if (event.key == "Escape" || event.key == 'Enter') {
            state.accountSubjects.forEach(actSub => {
               actSub.editing = false
            })
            this.showSubjects()
         }
      })

      return ele
   }

   saveSubjectButton(accountSubject) {
      let btn = document.createElement('div')
      btn.classList.add('save-btn')
      btn.addEventListener('click', async () => {
         let newTitle = document.getElementById(`act-sub-${accountSubject.subject.id}`)?.value.trim()
         if (!newTitle) return
         accountSubject.subject.title = newTitle
         await api.POST('ignyos/subject', accountSubject.subject)
      })    
      return btn
   }

   async saveSubject(accountSubject) {
      let newTitle = document.getElementById(`act-sub-${accountSubject.subject.id}`)?.value.trim()
      if (!newTitle) return
      accountSubject.subject.title = newTitle
      await api.POST('ignyos/subject', accountSubject.subject)
   }

   cancelEditSubjectButton(accountSubject) {
      let btn = document.createElement('div')
      btn.classList.add('cancel-btn')
      // btn.classList.add('save-btn')
      // btn.addEventListener('click', async () => {
      //    let newTitle = document.getElementById(`act-sub-${accountSubject.subject.id}`)?.value.trim()
      //    if (newTitle) return
      //    accountSubject.subject.title = newTitle
      //    await api.POST('ignyos/subject', accountSubject.subject)
      //    window.location = window.location.pathname
      // })      
      return btn
   }

   cancelEditSubject(accountSubject) {

   }

   //#endregion
}

page = new SubjectListPage()