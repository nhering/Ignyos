class App {
   constructor(appName) {
      this.appName = appName
      document.head.appendChild(this.title)
      document.body.appendChild(new TopBar(appName).element)
      if (api.userIsSignedIn) {
         if (state.quiz.id > 0) {
            state.currentPage = pages.QUIZ
         } else {
            if (state.currentPage == pages.HOME) state.currentPage = pages.FOCUS
            document.body.appendChild(new Navigation().element)
         }
      } else {
         state.currentPage = pages.HOME
      }
      document.body.appendChild(this.content)
      this.funtilityUi = new FuntilityUI(api)
      this.loadPage()
   }

   get title()
   {
      let ele = document.createElement('title')
      ele.innerHTML = this.appName;
      return ele
   }

   get content()
   {
      let ele = document.getElementById('content')
      if (ele) return ele
      ele = document.createElement('div')
      ele.id = 'content'
      return ele
   }

   get resources()
   {
      return {
         src: `./pages/${state.currentPage}/${state.currentPage}.js`,
         href: `./pages/${state.currentPage}/${state.currentPage}.css`,
         version: this.pageVersion[state.currentPage]
      }
   }

   get pageVersion()
   {
      const result = {}
      result[pages.FOCUS] = 0;
      result[pages.HOME] = 0;
      result[pages.QUIZ] = 0;
      result[pages.SUBJECT] = 0;
      // result[pages.SUBJECT_LIST] = 0;
      result[pages.SETTINGS] = 0;
      return result
   }

   async loadPage()
   {
      try {
         await this.loadScripts(this.resources)
         .then(async (page) => {
            this.content.innerHTML = null
            this.content.appendChild(page.element)
            await page.load()
         })
      } catch(err) {
         console.log(err)
         this.showErrors([err])
      }
   }

   async loadScripts(resource)
   {
      return new Promise((resolve, reject) => {
         try {
            if(resource.href) {
               let ele = document.createElement('link')
               ele.setAttribute('rel', 'stylesheet')
               ele.setAttribute('href',`${resource.href}?v=${resource.version}`)
               document.head.appendChild(ele)
            }

            if(resource.src) {
               let scr = document.createElement('script')
               scr.setAttribute('async', true)
               scr.setAttribute('type','text/javascript')
               scr.setAttribute('src',`${resource.src}?v=${resource.version}`)
               scr.addEventListener('load',() => {
                  resolve(page)
               })
               document.head.appendChild(scr)
            }
         } catch (error) {
            reject(error)
         }
      })
   }

   //#region Funtility API

   //  showLoadingModal()
   //  {
   //    this.hideLoadingModal()
   //    let modal = document.createElement('div')
   //    modal.classList.add('modal')
   //    modal.classList.add('loading')
      
   //    let bg = document.createElement('div')
   //    bg.classList.add('modal-bg')
   //    bg.id = 'loading-modal'
   //    bg.appendChild(modal)
   //    document.body.appendChild(bg)
   //  }

   //  hideLoadingModal()
   //  {
   //      let ele = document.getElementById('loading-modal')
   //      if (ele) ele.remove()
   //  }

    processApiResponse(apiResponse)
    {
        console.log(apiResponse)
        if (apiResponse.hasErrors) {
         apiResponse.errors.forEach(err => {
            console.error(err)
         })
            this.showErrors(apiResponse.errors)
        }
        return apiResponse.result
    }

    showErrors(errors = [], duration = 5000) {
        errors.forEach((err) => {
            this.funtilityUi.showEphemeralMessage('fnt-msg-cntr',this.funtilityUi.messageType.ERROR,err, duration)
        })
    }

    showInfo(msg, duration = 5000) {
      this.funtilityUi.showEphemeralMessage('fnt-msg-cntr',this.funtilityUi.messageType.INFO,msg,duration)
    }

    showSuccess(msg, duration = 5000) {
        this.funtilityUi.showEphemeralMessage('fnt-msg-cntr',this.funtilityUi.messageType.SUCCESS,msg,duration)
    }

   //#endregion

   //#region Modals

   //#region Confirm Modal

   confirm(okFn, message = 'Are You Sure?') {
      this.hideModal()

      let bg = document.createElement('div')
      bg.id = 'modal-bg'
      bg.addEventListener('click', this.hideModal)
      bg.appendChild(this.getConfirmModal(okFn, message))
      document.body.appendChild(bg)
   }

   getConfirmModal(okFn, message) {
      let msg = document.createElement('div')
      msg.classList.add('msg')
      msg.innerText = message

      let ok = document.createElement('div')
      ok.classList.add('ok')
      ok.innerText = 'OK'
      ok.addEventListener('click', okFn)

      let cancel = document.createElement('div')
      cancel.classList.add('cancel')
      cancel.innerText = 'CANCEL'
      cancel.addEventListener('click', this.hideModal)

      let ele = document.createElement('div')
      ele.classList.add('confirm-modal')
      ele.appendChild(msg)
      ele.appendChild(ok)
      ele.appendChild(cancel)
      return ele
   }

   //#endregion

   //#region Form Modal

   formModal(form) {
      this.hideModal()

      let bg = document.createElement('div')
      bg.id = 'modal-bg'
      bg.addEventListener('click', this.hideModal)
      bg.appendChild(form)
      document.body.appendChild(bg)
   }

   //#endregion
   
   hideModal() {
      let ele = document.getElementById('modal-bg')
      if (ele) ele.remove()
   }

   //#endregion
}

class TopBar {
   constructor(siteName) {
      this.siteName = siteName
   }

   get element()
   {
      let e = document.createElement('div')
      e.id = 'top-bar'
      e.appendChild(this.siteLabel)
      e.appendChild(document.createElement('div'))
      e.appendChild(this.signIn)
      return e
   }
   
   get siteLabel()
   {
      let e = document.createElement('div')
      e.id = 'site-lbl'
      e.innerText = this.siteName;
      return e
   }

   get signIn()
   {
      let e = document.createElement('div')
      e.id = 'funtility'
      return e
   }
}

/**
 * Three options: Focus, Subjects, and Settings
 */
class Navigation {
   constructor() { }

   get element()
   {
      let div = document.createElement('div')
      div.id = 'nav'
      div.appendChild(this.listItem('Focus', pages.FOCUS))
      div.appendChild(this.listItem('Subjects', pages.SUBJECT))
      div.appendChild(this.listItem('Settings', pages.SETTINGS))
      return div
   }

   listItem(text, page)
   {
      let div = document.createElement('div')
      div.classList.add('btn')
      div.innerText = text
      if (state.currentPage === page)
      {
         div.classList.add('selected')
      } else {
         div.addEventListener('click', () => {
            state.currentPage = page
            window.location = window.location.pathname
         })
      }
      return div
   }
}

class PageBase {
   constructor(name) {
      this.pageName = name
    }

   /**
    * Override this to return the unloaded dom element that
    * will be the content of the current page.
    */
   get element()
   {
     return document.createElement('div')
   }

   /**
    * Overridable method for implementations of the Page class.
    * This is called when the site is loaded. This should be 
    * overriden by the inheriting PageBase class if it needs
    * to perform any async loading.
    */
   async load() { }
}
