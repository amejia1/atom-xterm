/** @babel */
/*
 * Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * Copyright 2017-2018 Andres Mejia <amejia004@gmail.com>. All Rights Reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { AtomXtermProfilesSingleton } from './atom-xterm-profiles'

class AtomXtermOverwriteProfileModel {
  constructor (atomXtermSaveProfileModel) {
    this.atomXtermSaveProfileModel = atomXtermSaveProfileModel
    this.atomXtermProfileMenuElement = this.atomXtermSaveProfileModel.atomXtermProfileMenuElement
    this.profilesSingleton = AtomXtermProfilesSingleton.instance
    this.element = null
    this.panel = atom.workspace.addModalPanel({
      item: this,
      visible: false
    })
  }

  getTitle () {
    return 'atom-xterm Overwrite Profile Model'
  }

  getElement () {
    return this.element
  }

  setElement (element) {
    this.element = element
  }

  close (newProfile, profileChanges, rePrompt = false) {
    if (!this.panel.isVisible()) {
      return
    }
    this.panel.hide()
    if (rePrompt) {
      this.atomXtermSaveProfileModel.promptForNewProfileName(newProfile, profileChanges)
    }
  }

  promptOverwrite (profileName, newProfile, profileChanges) {
    this.panel.show()
    let confirmHandler = (event) => {
      this.profilesSingleton.setProfile(profileName, newProfile).then(() => {
        this.profilesSingleton.reloadProfiles()
        this.profilesSingleton.profilesLoadPromise.then(() => {
          this.close(newProfile, profileChanges)
          this.atomXtermProfileMenuElement.applyProfileChanges(profileChanges)
        })
      })
    }
    let cancelHandler = (event) => {
      this.close(newProfile, profileChanges, true)
    }
    this.getElement().setNewPrompt(
      profileName,
      confirmHandler,
      cancelHandler
    )
  }
}

export {
  AtomXtermOverwriteProfileModel
}
