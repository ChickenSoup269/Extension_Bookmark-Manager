import {
  translations,
  safeChromeBookmarksCall,
  showCustomPopup,
} from "../utils.js"
import {
  getBookmarkTree,
  getFolders,
  moveBookmarksToFolder,
} from "../bookmarks.js"

import { uiState, saveUIState } from "../state.js"

export function openAddToFolderPopup(elements, bookmarkIds) {
  const language = localStorage.getItem("appLanguage") || "en"
  elements.addToFolderSelect.innerHTML = `<option value="">${translations[language].selectFolder}</option>`
  uiState.folders.forEach((folder) => {
    if (folder.id !== "1" && folder.id !== "2") {
      const option = document.createElement("option")
      option.value = folder.id
      option.textContent = folder.title
      elements.addToFolderSelect.appendChild(option)
    }
  })
  elements.newFolderInput.value = ""
  elements.newFolderInput.classList.remove("error")
  elements.newFolderInput.placeholder =
    translations[language].newFolderPlaceholder
  elements.addToFolderPopup.classList.remove("hidden")
  elements.addToFolderSelect.focus()

  // Remove existing listeners to prevent duplicates
  elements.addToFolderSaveButton.removeEventListener("click", handleSave)
  elements.addToFolderSaveButton.addEventListener("click", handleSave)

  elements.addToFolderCancelButton.removeEventListener("click", handleCancel)
  elements.addToFolderCancelButton.addEventListener("click", handleCancel)

  elements.createNewFolderButton.removeEventListener(
    "click",
    handleCreateFolder
  )
  elements.createNewFolderButton.addEventListener("click", handleCreateFolder)

  elements.newFolderInput.removeEventListener("keypress", handleKeypress)
  elements.newFolderInput.addEventListener("keypress", handleKeypress)

  elements.newFolderInput.removeEventListener("keydown", handleKeydown)
  elements.newFolderInput.addEventListener("keydown", handleKeydown)

  elements.addToFolderSelect.removeEventListener(
    "keypress",
    handleSelectKeypress
  )
  elements.addToFolderSelect.addEventListener("keypress", handleSelectKeypress)

  elements.addToFolderSelect.removeEventListener("keydown", handleSelectKeydown)
  elements.addToFolderSelect.addEventListener("keydown", handleSelectKeydown)

  elements.addToFolderPopup.removeEventListener("click", handlePopupClick)
  elements.addToFolderPopup.addEventListener("click", handlePopupClick)

  function handleSave() {
    const targetFolderId = elements.addToFolderSelect.value
    const newFolderName = elements.newFolderInput.value.trim()
    if (!targetFolderId && !newFolderName) {
      elements.addToFolderSelect.classList.add("error")
      elements.newFolderInput.classList.add("error")
      showCustomPopup(translations[language].selectFolderError, "error", false)
      elements.newFolderInput.focus()
      return
    }

    if (bookmarkIds.length === 0) {
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
                elements.addToFolderSelect.innerHTML = `<option value="">${translations[language].selectFolder}</option>`
                uiState.folders.forEach((folder) => {
                  if (folder.id !== "1" && folder.id !== "2") {
                    const option = document.createElement("option")
                    option.value = folder.id
                    option.textContent = folder.title
                    elements.addToFolderSelect.appendChild(option)
                  }
                })
                elements.addToFolderSelect.value = newFolder.id
                moveBookmarksToFolder(
                  bookmarkIds,
                  newFolder.id,
                  elements,
                  () => {
                    elements.addToFolderPopup.classList.add("hidden")
                    elements.newFolderInput.value = ""
                    elements.newFolderInput.classList.remove("error")
                    elements.addToFolderSelect.classList.remove("error")
                    showCustomPopup(
                      translations[language].addToFolderSuccess ||
                        "Bookmark(s) moved successfully!",
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
      moveBookmarksToFolder(bookmarkIds, targetFolderId, elements, () => {
        elements.addToFolderPopup.classList.add("hidden")
        elements.newFolderInput.value = ""
        elements.newFolderInput.classList.remove("error")
        elements.addToFolderSelect.classList.remove("error")
        showCustomPopup(
          translations[language].addToFolderSuccess ||
            "Bookmark(s) moved successfully!",
          "success"
        )
        saveUIState()
      })
    }
  }

  function handleCancel() {
    elements.addToFolderPopup.classList.add("hidden")
    elements.newFolderInput.value = ""
    elements.newFolderInput.classList.remove("error")
    elements.addToFolderSelect.classList.remove("error")
    elements.newFolderInput.placeholder =
      translations[language].newFolderPlaceholder
  }

  function handleCreateFolder() {
    const folderName = elements.newFolderInput.value.trim()
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
              elements.addToFolderSelect.innerHTML = `<option value="">${translations[language].selectFolder}</option>`
              uiState.folders.forEach((folder) => {
                if (folder.id !== "1" && folder.id !== "2") {
                  const option = document.createElement("option")
                  option.value = folder.id
                  option.textContent = folder.title
                  elements.addToFolderSelect.appendChild(option)
                }
              })
              elements.addToFolderSelect.value = newFolder.id
              elements.newFolderInput.value = ""
              elements.newFolderInput.classList.remove("error")
              elements.newFolderInput.placeholder =
                translations[language].newFolderPlaceholder
              showCustomPopup(
                translations[language].createFolderSuccess ||
                  "Folder created successfully!",
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
  }

  function handleKeypress(e) {
    if (e.key === "Enter") {
      elements.createNewFolderButton.click()
    }
  }

  function handleKeydown(e) {
    if (e.key === "Escape") {
      elements.addToFolderCancelButton.click()
    }
  }

  function handleSelectKeypress(e) {
    if (e.key === "Enter") {
      elements.addToFolderSaveButton.click()
    }
  }

  function handleSelectKeydown(e) {
    if (e.key === "Escape") {
      elements.addToFolderCancelButton.click()
    }
  }

  function handlePopupClick(e) {
    if (e.target === elements.addToFolderPopup) {
      elements.addToFolderCancelButton.click()
    }
  }
}

export function setupAddToFolderListeners(elements) {
  if (elements.addToFolderButton) {
    elements.addToFolderButton.addEventListener("click", () => {
      if (selectedBookmarks.size > 0) {
        openAddToFolderPopup(elements, Array.from(selectedBookmarks))
      }
    })
  }
}
