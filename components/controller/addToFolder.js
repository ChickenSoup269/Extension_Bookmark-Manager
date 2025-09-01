import {
  translations,
  safeChromeBookmarksCall,
  showCustomPopup,
} from "../utils.js"
import {
  getBookmarkTree,
  moveBookmarksToFolder,
  getFolders,
} from "../bookmarks.js"
import { uiState, selectedBookmarks, saveUIState } from "../state.js"

export function setupAddToFolderListeners(elements) {
  // Add to Folder Button
  elements.addToFolderButton.addEventListener("click", () => {
    if (selectedBookmarks.size > 0) {
      populateAddToFolderSelect(elements)
      elements.newFolderInput.value = ""
      elements.newFolderInput.classList.remove("error")
      const language = localStorage.getItem("appLanguage") || "en"
      elements.newFolderInput.placeholder =
        translations[language].newFolderPlaceholder
      elements.addToFolderPopup.classList.remove("hidden")
      elements.addToFolderSelect.focus()
    }
  })

  // Create New Folder Button
  elements.createNewFolderButton.addEventListener("click", () => {
    const folderName = elements.newFolderInput.value.trim()
    const language = localStorage.getItem("appLanguage") || "en"
    if (!folderName) {
      elements.newFolderInput.classList.add("error")
      elements.newFolderInput.placeholder =
        translations[language].emptyFolderError
      elements.newFolderInput.focus()
      return
    }
    safeChromeBookmarksCall(
      "create",
      [{ parentId: "2", title: folderName }],
      (newFolder) => {
        if (newFolder) {
          getBookmarkTree((bookmarkTreeNodes) => {
            if (bookmarkTreeNodes) {
              uiState.bookmarkTree = bookmarkTreeNodes
              uiState.folders = getFolders(bookmarkTreeNodes)
              populateAddToFolderSelect(elements)
              elements.addToFolderSelect.value = newFolder.id
              elements.newFolderInput.value = ""
              elements.newFolderInput.classList.remove("error")
              elements.newFolderInput.placeholder =
                translations[language].newFolderPlaceholder
              showCustomPopup(
                translations[language].createFolderSuccess,
                "success"
              )
              saveUIState()
            } else {
              showCustomPopup(
                translations[language].errorUnexpected,
                "error",
                false
              )
            }
          })
        } else {
          showCustomPopup(
            translations[language].errorUnexpected,
            "error",
            false
          )
        }
      }
    )
  })

  // Add to Folder Save Button
  elements.addToFolderSaveButton.addEventListener("click", () => {
    const targetFolderId = elements.addToFolderSelect.value
    const newFolderName = elements.newFolderInput.value.trim()
    const language = localStorage.getItem("appLanguage") || "en"

    if (!targetFolderId && !newFolderName) {
      elements.newFolderInput.classList.add("error")
      elements.newFolderInput.placeholder =
        translations[language].emptyFolderError
      elements.newFolderInput.focus()
      return
    }

    if (selectedBookmarks.size === 0) {
      showCustomPopup(
        translations[language].noBookmarksSelected,
        "error",
        false
      )
      elements.addToFolderPopup.classList.add("hidden")
      return
    }

    if (newFolderName) {
      safeChromeBookmarksCall(
        "create",
        [{ parentId: "2", title: newFolderName }],
        (newFolder) => {
          if (newFolder) {
            getBookmarkTree((bookmarkTreeNodes) => {
              if (bookmarkTreeNodes) {
                uiState.bookmarkTree = bookmarkTreeNodes
                uiState.folders = getFolders(bookmarkTreeNodes)
                populateAddToFolderSelect(elements)
                elements.addToFolderSelect.value = newFolder.id
                moveBookmarksToFolder(
                  Array.from(selectedBookmarks),
                  newFolder.id,
                  elements,
                  () => {
                    elements.addToFolderPopup.classList.add("hidden")
                    elements.newFolderInput.value = ""
                    elements.newFolderInput.classList.remove("error")
                    elements.newFolderInput.placeholder =
                      translations[language].newFolderPlaceholder
                    showCustomPopup(
                      translations[language].addToFolderSuccess,
                      "success"
                    )
                    saveUIState()
                  }
                )
              } else {
                showCustomPopup(
                  translations[language].errorUnexpected,
                  "error",
                  false
                )
              }
            })
          } else {
            showCustomPopup(
              translations[language].errorUnexpected,
              "error",
              false
            )
          }
        }
      )
    } else {
      moveBookmarksToFolder(
        Array.from(selectedBookmarks),
        targetFolderId,
        elements,
        () => {
          elements.addToFolderPopup.classList.add("hidden")
          elements.newFolderInput.value = ""
          elements.newFolderInput.classList.remove("error")
          elements.newFolderInput.placeholder =
            translations[language].newFolderPlaceholder
          showCustomPopup(translations[language].addToFolderSuccess, "success")
          saveUIState()
        }
      )
    }
  })

  // Add to Folder Cancel
  elements.addToFolderCancelButton.addEventListener("click", () => {
    elements.addToFolderPopup.classList.add("hidden")
    elements.newFolderInput.classList.remove("error")
    elements.newFolderInput.value = ""
    const language = localStorage.getItem("appLanguage") || "en"
    elements.newFolderInput.placeholder =
      translations[language].newFolderPlaceholder
  })

  // Popup click outside
  elements.addToFolderPopup.addEventListener("click", (e) => {
    if (e.target === elements.addToFolderPopup) {
      elements.addToFolderCancelButton.click()
    }
  })

  // Keyboard events
  elements.newFolderInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      elements.createNewFolderButton.click()
    }
  })

  elements.newFolderInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      elements.addToFolderCancelButton.click()
    }
  })

  elements.addToFolderSelect.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      elements.addToFolderSaveButton.click()
    }
  })

  elements.addToFolderSelect.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      elements.addToFolderCancelButton.click()
    }
  })
}

function populateAddToFolderSelect(elements) {
  const language = localStorage.getItem("appLanguage") || "en"
  elements.addToFolderSelect.innerHTML = `<option value="">${translations[language].selectFolder}</option>`
  uiState.folders.forEach((folder) => {
    const option = document.createElement("option")
    option.value = folder.id
    option.textContent = folder.title
    elements.addToFolderSelect.appendChild(option)
  })
}
