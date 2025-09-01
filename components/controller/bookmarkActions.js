import {
  translations,
  safeChromeBookmarksCall,
  showCustomPopup,
  showCustomConfirm,
} from "../utils.js"
import { getBookmarkTree } from "../bookmarks.js"
import { renderFilteredBookmarks } from "../ui.js"
import { uiState, selectedBookmarks, setCurrentBookmarkId } from "../state.js"
import { openAddToFolderPopup } from "./addToFolder.js"

export function setupBookmarkActionListeners(elements) {
  // Rename Bookmark Popup Listeners
  if (elements.renameSave) {
    elements.renameSave.addEventListener("click", () => {
      const newTitle = elements.renameInput.value.trim()
      const language = localStorage.getItem("appLanguage") || "en"
      if (!newTitle) {
        elements.renameInput.classList.add("error")
        elements.renameInput.placeholder =
          translations[language].emptyTitleError
        elements.renameInput.focus()
        return
      }
      if (!uiState.currentBookmarkId) {
        showCustomPopup(translations[language].errorUnexpected, "error", false)
        elements.renamePopup.classList.add("hidden")
        return
      }

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
                  sibling.title.toLowerCase() === newTitle.toLowerCase()
              )
              if (isDuplicate) {
                elements.renameInput.classList.add("error")
                elements.renameInput.placeholder =
                  translations[language].duplicateTitleError
                elements.renameInput.focus()
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
                          translations[language].renameSuccess ||
                            "Bookmark renamed successfully!",
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
    })
  }

  if (elements.renameCancel) {
    elements.renameCancel.addEventListener("click", () => {
      elements.renamePopup.classList.add("hidden")
      elements.renameInput.classList.remove("error")
      elements.renameInput.value = ""
      const language = localStorage.getItem("appLanguage") || "en"
      elements.renameInput.placeholder =
        translations[language].renamePlaceholder
      setCurrentBookmarkId(null)
    })
  }

  if (elements.renameInput) {
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
  }

  if (elements.renamePopup) {
    elements.renamePopup.addEventListener("click", (e) => {
      if (e.target === elements.renamePopup) {
        elements.renameCancel.click()
      }
    })
  }

  if (elements.clearRenameButton) {
    elements.clearRenameButton.addEventListener("click", () => {
      elements.renameInput.value = ""
      elements.renameInput.classList.remove("error")
      const language = localStorage.getItem("appLanguage") || "en"
      elements.renameInput.placeholder =
        translations[language].renamePlaceholder
      elements.renameInput.focus()
    })
  }

  // Dropdown and Checkbox Actions
  const addToFolderButtons = document.querySelectorAll(".add-to-folder")
  console.log("Found add-to-folder buttons:", addToFolderButtons.length)
  addToFolderButtons.forEach((button) => {
    button.removeEventListener("click", handleAddToFolder)
    button.addEventListener("click", (e) => handleAddToFolder(e, elements))
  })

  const deleteButtons = document.querySelectorAll(".delete-btn")
  console.log("Found delete buttons:", deleteButtons.length)
  deleteButtons.forEach((button) => {
    button.removeEventListener("click", handleDeleteBookmark)
    button.addEventListener("click", (e) => handleDeleteBookmark(e, elements))
  })

  const renameButtons = document.querySelectorAll(".rename-btn")
  console.log("Found rename buttons:", renameButtons.length)
  renameButtons.forEach((button) => {
    button.removeEventListener("click", handleRenameBookmark)
    button.addEventListener("click", (e) => handleRenameBookmark(e, elements))
  })

  const checkboxes = document.querySelectorAll(".bookmark-checkbox")
  console.log("Found bookmark checkboxes:", checkboxes.length)
  checkboxes.forEach((checkbox) => {
    checkbox.removeEventListener("change", handleBookmarkCheckbox)
    checkbox.addEventListener("change", (e) =>
      handleBookmarkCheckbox(e, elements)
    )
  })
}

function handleAddToFolder(e, elements) {
  e.stopPropagation()
  const bookmarkId = e.target.dataset.id
  if (!bookmarkId) {
    console.error("Bookmark ID is undefined in handleAddToFolder")
    const language = localStorage.getItem("appLanguage") || "en"
    showCustomPopup(translations[language].errorUnexpected, "error", false)
    return
  }
  console.log("Opening add to folder popup for bookmarkId:", bookmarkId)
  openAddToFolderPopup(elements, [bookmarkId])
  e.target.closest(".dropdown-menu").classList.add("hidden")
}

function handleDeleteBookmark(e, elements) {
  e.stopPropagation()
  const bookmarkId = e.target.dataset.id
  const language = localStorage.getItem("appLanguage") || "en"
  if (!bookmarkId) {
    console.error("Bookmark ID is undefined in handleDeleteBookmark")
    showCustomPopup(translations[language].errorUnexpected, "error", false)
    return
  }
  showCustomConfirm(translations[language].deleteConfirm, () => {
    safeChromeBookmarksCall("remove", [bookmarkId], () => {
      getBookmarkTree((bookmarkTreeNodes) => {
        if (bookmarkTreeNodes) {
          renderFilteredBookmarks(bookmarkTreeNodes, elements)
          showCustomPopup(
            translations[language].deleteBookmarkSuccess ||
              "Bookmark deleted successfully!",
            "success"
          )
        } else {
          showCustomPopup(
            translations[language].errorUnexpected,
            "error",
            false
          )
        }
      })
    })
  })
  e.target.closest(".dropdown-menu").classList.add("hidden")
}

function handleRenameBookmark(e, elements) {
  e.stopPropagation()
  const bookmarkId = e.target.dataset.id
  const language = localStorage.getItem("appLanguage") || "en"
  console.log("handleRenameBookmark called, bookmarkId:", bookmarkId)
  if (!bookmarkId) {
    console.error("Bookmark ID is undefined in handleRenameBookmark")
    showCustomPopup(translations[language].errorUnexpected, "error", false)
    return
  }

  // Re-query DOM elements
  const renamePopup = document.getElementById("rename-popup")
  const renameInput = document.getElementById("rename-input")
  if (!renamePopup || !renameInput) {
    console.error("Rename popup or input element is missing", {
      renamePopup: !!renamePopup,
      renameInput: !!renameInput,
    })
    showCustomPopup(
      translations[language].popupNotFound || "Rename popup not found",
      "error",
      false
    )
    return
  }
  if (!document.body.contains(renamePopup)) {
    console.error("Rename popup is not in the DOM")
    showCustomPopup(
      translations[language].popupNotFound || "Rename popup not found",
      "error",
      false
    )
    return
  }

  try {
    console.log("Validating rename popup elements")
    setCurrentBookmarkId(bookmarkId)
    renameInput.value = ""
    renameInput.classList.remove("error")
    renameInput.placeholder = translations[language].renamePlaceholder
    console.log("Setting up rename popup, elements:", {
      renamePopupDisplay: getComputedStyle(renamePopup).display,
      hiddenClass: renamePopup.classList.contains("hidden"),
    })
    setTimeout(() => {
      try {
        console.log("Attempting to show rename popup")
        renamePopup.classList.remove("hidden")
        console.log("Rename popup class 'hidden' removed")
        renameInput.focus()
        console.log("Rename input focused")
        safeChromeBookmarksCall("get", [bookmarkId], (bookmark) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Chrome bookmarks API error:",
              chrome.runtime.lastError.message
            )
            showCustomPopup(
              translations[language].errorUnexpected,
              "error",
              false
            )
            renamePopup.classList.add("hidden")
            return
          }
          if (bookmark && bookmark[0]) {
            console.log("Bookmark retrieved:", bookmark[0])
            renameInput.value = bookmark[0].title || ""
            console.log("Rename input value set to:", renameInput.value)
          } else {
            console.error("Bookmark not found for ID:", bookmarkId)
            showCustomPopup(
              translations[language].bookmarkNotFound || "Bookmark not found",
              "error",
              false
            )
            renamePopup.classList.add("hidden")
          }
        })
      } catch (error) {
        console.error("Error showing rename popup:", error)
        showCustomPopup(translations[language].errorUnexpected, "error", false)
        renamePopup.classList.add("hidden")
      }
    }, 200)
  } catch (error) {
    console.error("Error in handleRenameBookmark:", error)
    showCustomPopup(translations[language].errorUnexpected, "error", false)
    renamePopup.classList.add("hidden")
  }
  e.target.closest(".dropdown-menu").classList.add("hidden")
}

function handleBookmarkCheckbox(e, elements) {
  const bookmarkId = e.target.dataset.id
  if (!bookmarkId) {
    console.error("Bookmark ID is undefined in handleBookmarkCheckbox", {
      checkbox: e.target,
      dataset: e.target.dataset,
    })
    return
  }
  console.log(
    "Checkbox changed, bookmarkId:",
    bookmarkId,
    "checked:",
    e.target.checked
  )
  if (e.target.checked) {
    selectedBookmarks.add(bookmarkId)
  } else {
    selectedBookmarks.delete(bookmarkId)
  }
  console.log("Updated selectedBookmarks:", Array.from(selectedBookmarks))
  elements.addToFolderButton.classList.toggle(
    "hidden",
    selectedBookmarks.size === 0
  )
  console.log(
    "Add to folder button hidden:",
    elements.addToFolderButton.classList.contains("hidden")
  )
}
