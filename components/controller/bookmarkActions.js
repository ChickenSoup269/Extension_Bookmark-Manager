import {
  translations,
  safeChromeBookmarksCall,
  showCustomPopup,
  showCustomConfirm,
} from "../utils.js"
import { getBookmarkTree } from "../bookmarks.js"
import { renderFilteredBookmarks } from "../ui.js"
import { uiState, selectedBookmarks, setCurrentBookmarkId } from "../state.js"

export function setupBookmarkActionListeners(elements) {
  // Rename Bookmark
  elements.renameSave.addEventListener("click", () => {
    const newTitle = elements.renameInput.value.trim()
    const language = localStorage.getItem("appLanguage") || "en"
    if (newTitle && uiState.currentBookmarkId) {
      safeChromeBookmarksCall(
        "get",
        [uiState.currentBookmarkId],
        (bookmark) => {
          if (bookmark && bookmark[0]) {
            const parentId = bookmark[0].parentId
            safeChromeBookmarksCall("getChildren", [parentId], (siblings) => {
              const isDuplicate = siblings.some(
                (sibling) =>
                  sibling.id !== uiState.currentBookmarkId &&
                  sibling.title === newTitle
              )
              if (isDuplicate) {
                elements.renameInput.classList.add("error")
                elements.renameInput.placeholder =
                  translations[language].duplicateTitleError
                return
              }
              safeChromeBookmarksCall(
                "update",
                [uiState.currentBookmarkId, { title: newTitle }],
                (result) => {
                  if (result) {
                    getBookmarkTree((bookmarkTreeNodes) => {
                      if (bookmarkTreeNodes) {
                        renderFilteredBookmarks(bookmarkTreeNodes, elements)
                        showCustomPopup(
                          translations[language].renameSuccess,
                          "success"
                        )
                        setCurrentBookmarkId(null)
                        elements.renamePopup.classList.add("hidden")
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
          } else {
            showCustomPopup(
              translations[language].errorUnexpected,
              "error",
              false
            )
            elements.renamePopup.classList.add("hidden")
          }
        }
      )
    } else if (!newTitle) {
      elements.renameInput.classList.add("error")
      elements.renameInput.placeholder = translations[language].emptyTitleError
    } else {
      showCustomPopup(translations[language].errorUnexpected, "error", false)
      elements.renamePopup.classList.add("hidden")
    }
  })

  elements.renameCancel.addEventListener("click", () => {
    elements.renamePopup.classList.add("hidden")
    elements.renameInput.classList.remove("error")
    elements.renameInput.value = ""
    setCurrentBookmarkId(null)
  })

  elements.renameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      elements.renameSave.click()
    }
  })

  elements.renameInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      elements.renameCancel.click()
    }
  })

  elements.renamePopup.addEventListener("click", (e) => {
    if (e.target === elements.renamePopup) {
      elements.renameCancel.click()
    }
  })

  elements.clearRenameButton.addEventListener("click", () => {
    elements.renameInput.value = ""
    elements.renameInput.classList.remove("error")
    const language = localStorage.getItem("appLanguage") || "en"
    elements.renameInput.placeholder = translations[language].renamePlaceholder
    elements.renameInput.focus()
  })

  // Dropdown and Checkbox Actions
  document.querySelectorAll(".add-to-folder").forEach((button) => {
    button.removeEventListener("click", handleAddToFolder)
    button.addEventListener("click", (e) => handleAddToFolder(e, elements))
  })

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.removeEventListener("click", handleDeleteBookmark)
    button.addEventListener("click", (e) => handleDeleteBookmark(e, elements))
  })

  document.querySelectorAll(".rename-btn").forEach((button, index) => {
    button.removeEventListener("click", handleRenameBookmark)
    button.addEventListener("click", (e) => {
      handleRenameBookmark(e, elements)
    })
  })

  document.querySelectorAll(".bookmark-checkbox").forEach((checkbox) => {
    checkbox.removeEventListener("change", handleBookmarkCheckbox)
    checkbox.addEventListener("change", (e) =>
      handleBookmarkCheckbox(e, elements)
    )
  })

  function handleAddToFolder(e, elements) {
    const bookmarkId = e.target.dataset.id
    if (!bookmarkId) {
      console.error("Bookmark ID is undefined")
      return
    }
    selectedBookmarks.clear()
    selectedBookmarks.add(bookmarkId)
    const language = localStorage.getItem("appLanguage") || "en"
    elements.newFolderInput.value = ""
    elements.newFolderInput.classList.remove("error")
    elements.newFolderInput.placeholder =
      translations[language].newFolderPlaceholder
    elements.addToFolderPopup.classList.remove("hidden")
    elements.addToFolderSelect.focus()
  }

  function handleDeleteBookmark(e, elements) {
    const bookmarkId = e.target.dataset.id
    const language = localStorage.getItem("appLanguage") || "en"
    showCustomConfirm(translations[language].deleteConfirm, () => {
      safeChromeBookmarksCall("remove", [bookmarkId], () => {
        getBookmarkTree((bookmarkTreeNodes) => {
          if (bookmarkTreeNodes) {
            renderFilteredBookmarks(bookmarkTreeNodes, elements)
            showCustomPopup(
              translations[language].deleteBookmarkSuccess,
              "success"
            )
          }
        })
      })
    })
  }

  function handleRenameBookmark(e, elements) {
    const bookmarkId = e.target.dataset.id
    if (!bookmarkId) {
      const language = localStorage.getItem("appLanguage") || "en"
      showCustomPopup(translations[language].errorUnexpected, "error", false)
      return
    }
    setCurrentBookmarkId(bookmarkId)
    const language = localStorage.getItem("appLanguage") || "en"
    elements.renameInput.value = ""
    elements.renameInput.classList.remove("error")
    elements.renameInput.placeholder = translations[language].renamePlaceholder
    elements.renamePopup.classList.remove("hidden")
    elements.renameInput.focus()
    safeChromeBookmarksCall("get", [bookmarkId], (bookmark) => {
      if (bookmark && bookmark[0]) {
        elements.renameInput.value = bookmark[0].title || ""
      } else {
        showCustomPopup(translations[language].errorUnexpected, "error", false)
      }
    })
  }

  function handleBookmarkCheckbox(e, elements) {
    const bookmarkId = e.target.dataset.id
    if (e.target.checked) {
      selectedBookmarks.add(bookmarkId)
    } else {
      selectedBookmarks.delete(bookmarkId)
    }
    elements.addToFolderButton.classList.toggle(
      "hidden",
      selectedBookmarks.size === 0
    )
  }
}
