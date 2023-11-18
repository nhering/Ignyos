class App {
   constructor(appName) {
      this.appName = appName
      document.head.appendChild(this.title)
      this.route()
   }

   async route() {
      if (!api.userIsSignedIn) {
         state.currentPage = pages.HOME
      }

      let siteHeader = document.getElementById('site-header')
      if (siteHeader) siteHeader.remove()
      document.body.appendChild(new SiteHeader(appName).element)
      this.funtilityUi = new FuntilityUI(api)

      if (api.userIsSignedIn) {
         let nav = document.getElementById('nav')
         if (nav) nav.remove()
         document.body.appendChild(navigation.element)
      }
      
      await this.loadPage()
   }

   get title()
   {
      let ele = document.createElement('title')
      ele.innerHTML = this.appName;
      return ele
   }

   async loadPage()
   {
      try {
         this.removeScripts()
         await this.loadScripts(this.resources)
         .then(async (page) => {
            let pageEle = document.getElementById('page')
            if (pageEle) pageEle.remove()
            document.body.appendChild(page.element)
            await page.load()
         })
      } catch(err) {
         console.log(err)
         this.showErrors([err])
      }
   }

   removeScripts() {
      let css = document.getElementById('css')
      if (css) css.remove()
      let script = document.getElementById('script')
      if (script) script.remove()
   }

   async loadScripts(resource)
   {
      return new Promise((resolve, reject) => {
         try {
            if(resource.href) {
               let ele = document.createElement('link')
               ele.id = 'css'
               ele.setAttribute('rel', 'stylesheet')
               ele.setAttribute('href',`${resource.href}?v=${resource.version}`)
               document.head.appendChild(ele)
            }

            if(resource.src) {
               let scr = document.createElement('script')
               scr.id = 'script'
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
      // result[pages.FOCUS] = 0;
      result[pages.HOME] = 0;
      result[pages.QUIZ] = 0;
      result[pages.SETTINGS] = 0;
      result[pages.STATS] = 0;
      result[pages.MATERIAL] = 0;
      return result
   }

   //#region Funtility API

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
      ok.classList.add('btn')
      ok.classList.add('ok')
      ok.innerText = 'OK'
      ok.addEventListener('click', okFn)

      let cancel = document.createElement('div')
      cancel.classList.add('btn')
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

   // formModal(form) {
   //    this.hideModal()

   //    let bg = document.createElement('div')
   //    bg.id = 'modal-bg'
   //    bg.addEventListener('click', this.hideModal)
   //    bg.appendChild(form)
   //    document.body.appendChild(bg)
   // }

   //#endregion
   
   hideModal() {
      let ele = document.getElementById('modal-bg')
      if (ele) ele.remove()
   }

   //#endregion
}

class SiteHeader {
   constructor(siteName) {
      this.siteName = siteName
   }

   get element()
   {
      let e = document.createElement('div')
      e.id = 'site-header'
      e.appendChild(this.siteLabel)
      e.appendChild(document.createElement('div'))
      e.appendChild(this.signIn)
      return e
   }
   
   get siteLabel()
   {
      let e = document.createElement('div')
      e.classList.add('site-label')
      e.innerText = this.siteName;
      e.addEventListener('click', async () => {
         state.currentPage = pages.HOME
         await app.route()
      })
      return e
   }

   get signIn()
   {
      let e = document.createElement('div')
      e.id = 'funtility'
      return e
   }
}

navigation = {
   get element() {
      let n = this.nav
      if (state.quiz.id > 0) {
         n.classList.add('quiz')
         // don't show the regular nav items
         // show the quiz items: 'Question # of #', 'Show Answer', 'Quit Quiz'
      } else {
         n.classList.add('standard')
         n.appendChild(this.materialBtn)
         n.appendChild(this.quizBtn)
         n.appendChild(this.statsBtn)
         n.appendChild(this.settingsBtn)
      }
      return n
   },

   get nav() {
      let nav = document.getElementById('nav')
      if (nav) {
         nav.innerHTML = null
      } else {
         nav = document.createElement('div')
         nav.id = 'nav'
      }
      return nav
   },

   get materialBtn() {
      let ele = this.getNavItemPill("Study Material", state.currentPage == pages.MATERIAL)
      ele.id = 'study-material'
      if (state.currentPage != pages.MATERIAL) {
         ele.addEventListener('click', async () => {
            state.currentPage = pages.MATERIAL
            await app.route()
         })
      }
      return ele
   },

   get quizBtn() {
      let ele = this.getNavItemPill("Create a Quiz", state.currentPage == pages.QUIZ)
      ele.id = 'create-quiz'
         if (state.currentPage != pages.QUIZ) {
            ele.addEventListener('click', async () => {
               state.currentPage = pages.QUIZ
               await app.route()
            })
         }
      return ele
   },

   getNavItemPill(word, selected) {
      let ele = document.createElement('div')
      ele.innerText = word
      if (selected) {
         ele.classList.add('pill-selected')
      } else {
         ele.classList.add('pill')
      }
      return ele
   },

   get statsBtn() {
      let ele = document.createElement('div')
      ele.id = 'stats'
      if (state.currentPage != pages.STATS) {
         ele.addEventListener('click', async () => {
            state.currentPage = pages.STATS
            await app.route()
         })
      }
      return ele
   },

   get settingsBtn() {
      let ele = document.createElement('div')
      ele.id = 'settings'
      ele.addEventListener('click', async () => {
         state.currentPage = pages.SETTINGS
         await app.route()
      })
      return ele
   }
}
