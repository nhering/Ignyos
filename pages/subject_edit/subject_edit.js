// class SubjectEditPage extends PageBase {
//    constructor() { super() }

//    get element()
//    {
//       let top = document.createElement('div')
//       top.id = 'topics'

//       let ele = document.createElement('div')
//       ele.id = 'page'
//       ele.appendChild(this.header)
//       ele.appendChild(this.addTopic)
//       ele.appendChild(top)
//       return ele
//    }

//    async load()
//    {
//       this.initTopicsEle()
//       // await this.loadTopics()
//       this.showTopics()
//    }

//    initTopicsEle() {
//       let tEle = document.getElementById('topics')
//       tEle.classList.add('progress')
//       tEle.setAttribute('style',`max-height:${this.topicEleHeight}`)
//    }

//    get topicEleHeight() {
//       let cHeight = document.getElementById('page').clientHeight
//       let hHeight = document.getElementById('header').clientHeight
//       return cHeight - hHeight - 30 // 30 is the 20px padding + 10px gap
//    }

//    //#region Header

//    get header()
//    {
//       let title = document.createElement('div')
//       title.id = 'sub-title'
//       title.innerText = state.subject.title
//       // title.title = state.subject.description      

//       // let desc = document.createElement('div')
//       // desc.id = 'sub-desc'
//       // desc.innerText = state.subject.description

//       let hdr = document.createElement('div')
//       hdr.id = 'header'
//       hdr.appendChild(title)
//       hdr.appendChild(this.editSubjectButton)
//       // hdr.appendChild(desc)
//       return hdr
//    }

//    get editSubjectButton()
//    {
//       let btn = document.createElement('div')
//       btn.classList.add('edit-btn')
//       btn.title = "Edit Subject"
//       btn.addEventListener('click', () => {
//          app.formModal(this.editSubjectForm)
//       })
//       return btn
//    }

//    get editSubjectForm() {
//       let tInp = document.createElement('input')
//       tInp.type = 'text'
//       tInp.id = 't-inp'
//       tInp.classList.add('title')
//       tInp.value = state.subject.title

//       let dInp = document.createElement('input')
//       dInp.type = 'text'
//       dInp.id = 'd-inp'
//       dInp.classList.add('desc')
//       // dInp.value = state.subject.description

//       let ok = document.createElement('div')
//       ok.classList.add('ok')
//       ok.innerText = 'OK'
//       ok.addEventListener('click', async () => {
//          await this.saveSubject()
//       })

//       let cancel = document.createElement('div')
//       cancel.classList.add('cancel')
//       cancel.innerText = 'CANCEL'
//       cancel.addEventListener('click', app.hideModal)

//       let form = document.createElement('div')
//       form.classList.add('edit-subject-form')
//       form.addEventListener('click', (event) => { event.stopPropagation() })
//       form.appendChild(tInp)
//       form.appendChild(dInp)
//       form.appendChild(ok)
//       form.appendChild(cancel)
//       return form
//    }

//    async saveSubject() {
//       state.subject.title = document.getElementById('t-inp').value
//       // state.subject.description = document.getElementById('d-inp').value
//       await api.PUT('ignyos/subject', state.subject)
//       document.getElementById('header').remove()
//       document.getElementById('page').appendChild(this.header)
//       app.hideModal()
//    }

//    //#endregion

//    //#region Topic List

//    showTopics() {
//       let tEle = document.getElementById('topics')
//       tEle.innerHTML = null
//       state.topicList.forEach(topic => {
//          tEle.appendChild(this.topicLineItem(topic))
//       })
//    }

//    get addTopic() {
//       let input = document.createElement('input')
//       input.type = 'text'
//       input.placeholder = "Enter new topic title."

//       let btn = document.createElement('div')
//       btn.classList.add('btn')
//       btn.innerText = 'Add'
//       btn.addEventListener('click', async () => {
//          await this.newTopic()
//       })

//       let ele = document.createElement('div')
//       ele.id = 'new-topic'
//       ele.appendChild(input)
//       ele.appendChild(btn)
//       return ele
//    }

//    async newTopic() {
//       title = document.getElementById('new-topic').value
//       if(title.trim() != '') {
//          let t = {
//             subjectId: state.subject.id,
//             title: title
//          }
//          let response = await api.POST('ignyos/topic', t)
//          let data = app.processApiResponse(response)
//          state.topicList.push(data)
//          this.showTopics()
//       }      
//    }

//    topicLineItem(topic) {
//       let title = document.createElement('div')
//       title.classList.add('title')
//       title.innerText = topic.title
//       title.title = `${topic.questionCount} question(s)`

//       let edit = document.createElement('div')
//       edit.classList.add('edit')

//       let del = document.createElement('div')
//       del.classList.add('del')

//       let ele = document.createElement('div')
//       ele.classList.add('item')
//       ele.appendChild(title)
//       ele.appendChild(count)
//       ele.appendChild(edit)
//       ele.appendChild(del)
//    }

//    //#endregion
// }

// page = new SubjectEditPage()